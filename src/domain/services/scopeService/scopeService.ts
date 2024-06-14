import { merge } from 'lodash';
import dayjs from 'dayjs';
import { inject, injectable } from 'tsyringe';
import {
  TABLE_REPOSITORY_TOKEN,
  TableRepositoryInterface,
} from '../../../infrastructure/secondary/repository/interfaces/tableRepositoryInterface';
import {
  SCOPE_ENTITY_TOKEN,
  ScopeEntityInterface,
} from '../../entities/scopesEntity/interfaces/scopeInterfaces';
import { TableServiceInterface } from '../../../infrastructure/secondary/services/interface/tableServiceInterface';
import { EntitiesEnum } from '../../../commons/enums/entitiesEnum';
import { TableGsiEnum } from '../../../commons/enums/tableGsiEnum';
import ScopeEntity from '../../entities/scopesEntity/scopeEntity';
import {
  ScopeInputType,
  ScopeTableItem,
  ScopeType,
  ScopeUpdatePayload,
} from '../../entities/scopesEntity/types/scopeTypes';
import { ErrorMessagesEnum } from '../../../commons/errors/enums/errorMessagesEnum';
import { ScopeServiceInterface } from './interfaces/scopeServiceInterface';
import { UpdateOperationsEnum } from './enums/updateOperationsEnum';
import {
  EndpointDataType,
  GetAllScopesType,
  GetScopeByApiNameServiceInput,
} from './types/scopeServiceTypes';
import matchPaths from '../../utils/matchPaths';

const tableName = process.env.CLIENTS_SCOPE_TABLE_NAME as string;

@injectable()
export default class ScopeService implements ScopeServiceInterface {
  private tableService: TableServiceInterface;

  constructor(
    @inject(TABLE_REPOSITORY_TOKEN)
    private tableRepository: TableRepositoryInterface,
    @inject(SCOPE_ENTITY_TOKEN) private scopeEntity: ScopeEntityInterface
  ) {
    this.tableService = tableRepository.getInstance(
      this.scopeEntity.getTableSchema(),
      tableName
    );
  }

  async createScope(scope: ScopeInputType): Promise<ScopeTableItem> {
    // buscamos el scope por api_name
    const scopeByApiName = await this.getScopeByApiName({
      apiName: scope.api_name,
      scopeType: scope.scope_type,
      raw: true,
    }).catch(() => {
      return null;
    });
    // si existe un scope con el mismo api_name, lanzamos un error
    if (scopeByApiName) {
      throw new Error(ErrorMessagesEnum.SCOPE_ALREADY_EXISTS);
    }

    const scopeData = this.scopeEntity.build(scope);
    await this.tableService.create(scopeData);

    return scopeData;
  }

  async getScopeById(
    scopeId: string,
    raw = false
  ): Promise<ScopeTableItem | ScopeType> {
    const response = await this.getAllScopes({
      scope_id: {
        eq: scopeId,
      },
    });

    if (!response?.length) {
      throw new Error(ErrorMessagesEnum.SCOPE_NOT_FOUND);
    }

    const [item] = response;

    return raw ? item : ScopeEntity.getClean(item);
  }

  async getScopeByApiName(
    params: GetScopeByApiNameServiceInput
  ): Promise<ScopeTableItem | ScopeType> {
    const { raw = false, apiName, scopeType } = params;

    const response = await this.getAllScopes({
      api_name: {
        eq: apiName,
      },
      ...(scopeType && { scope_type: { eq: scopeType } }),
    });

    const [item] = response;

    return raw ? item : ScopeEntity.getClean(item);
  }

  async deleteScopeById(scopeId: string): Promise<ScopeTableItem> {
    const scope = (await this.getScopeById(scopeId, true)) as ScopeTableItem;

    if (!scope) {
      throw new Error(ErrorMessagesEnum.SCOPE_NOT_FOUND);
    }

    await this.tableService.delete({ pk: scope.pk, sk: scope.sk });

    return scope;
  }

  async updateScopeById(
    scopeId: string,
    inputPayload: ScopeUpdatePayload
  ): Promise<ScopeTableItem> {
    // Buscamos el scope por id
    const scope = (await this.getScopeById(scopeId, true)) as ScopeTableItem;

    if (inputPayload.api_name) {
      // buscamos el scope por api_name
      const scopeByApiName = await this.getScopeByApiName({
        apiName: inputPayload.api_name,
      }).catch(() => {
        return null;
      });
      // si existe un scope con el mismo api_name, lanzamos un error
      if (scopeByApiName) {
        throw new Error(ErrorMessagesEnum.SCOPE_ALREADY_EXISTS);
      }
    }

    // Si el payload tiene condiciones, las eliminamos para no incluirlas en el payload de actualización
    const { conditions, ...payload } = inputPayload;

    // Si el payload tiene condiciones, las procesamos
    if (conditions?.endpoints) {
      const newEndpoints: string[] = [];

      // Dependiendo de la operación, agregamos o eliminamos los endpoints
      switch (conditions.endpoints) {
        case UpdateOperationsEnum.ADD:
          // Agregamos los endpoints al scope
          inputPayload.endpoints.forEach((endpoint) => {
            const response = ScopeEntity.addEndpoint(scope, endpoint);
            // agregamos los nuevos endpoints al array
            newEndpoints.push(...response);
          });
          break;
        case UpdateOperationsEnum.REMOVE:
          // Eliminamos los endpoints del scope
          inputPayload.endpoints.forEach((endpoint) => {
            scope.endpoints = ScopeEntity.removeEndpoint(
              scope.endpoints,
              endpoint
            );
          });
          break;
        default:
          break;
      }
      payload.endpoints = newEndpoints;
    }

    // eslint-disable-next-line camelcase, @typescript-eslint/no-unused-vars
    const { pk, sk, scope_id, ...updatedPayload } = merge(scope, payload);

    // Actualizamos la fecha de actualización
    const payloadForUpdate = {
      ...updatedPayload,
      updated_at: dayjs().unix(),
    };

    // Actualizamos el scope en la base de datos
    const updatedScope = await this.tableService.update({
      key: { pk: pk, sk: sk },
      payload: payloadForUpdate,
    });

    return updatedScope;
  }

  async getAllScopes(query?: GetAllScopesType): Promise<ScopeTableItem[]> {
    const response = await this.tableService.query({
      query: {
        type: {
          eq: EntitiesEnum.SCOPE,
        },
        ...(query && query),
      },
      options: {
        using_index: TableGsiEnum.TYPE,
      },
    });

    if (!response?.length) {
      throw new Error(ErrorMessagesEnum.SCOPE_NOT_FOUND);
    }

    return response;
  }

  async validateScopes(
    scopesList: string,
    endpointData: EndpointDataType
  ): Promise<boolean> {
    // Obtenemos todos los scopes
    const allScopes = await this.getAllScopes();

    // Convertimos la lista de scopes en un array
    const scopesListArray = scopesList.split(' ');

    // Filtramos los scopes que coincidan con la lista de scopes
    const scopes = allScopes.filter((scope: ScopeTableItem) =>
      scopesListArray.includes(`${scope.scope_type}.${scope.api_name}`)
    );

    // Si no hay scopes, retornamos false
    if (!scopes?.length) {
      return false;
    }

    // Obtenemos el endpoint
    const endpoint = `${endpointData.method} ${endpointData.endpoint}`;

    // Validamos si el endpoint está en alguno de los scopes
    return scopes.some((scope: ScopeTableItem) =>
      scope.endpoints.some((scopeEndpoint) => {
        return matchPaths(scopeEndpoint, endpoint);
      })
    );
  }
}
