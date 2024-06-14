/* eslint-disable @typescript-eslint/no-unused-vars */
import { randomUUID } from 'crypto';
import { merge } from 'lodash';
import dayjs from 'dayjs';
import { inject, injectable } from 'tsyringe';
import {
  TABLE_REPOSITORY_TOKEN,
  TableRepositoryInterface,
} from '../../../infrastructure/secondary/repository/interfaces/tableRepositoryInterface';
import { TableServiceInterface } from '../../../infrastructure/secondary/services/interface/tableServiceInterface';
import { EntitiesEnum } from '../../../commons/enums/entitiesEnum';
import { TableGsiEnum } from '../../../commons/enums/tableGsiEnum';
import { ErrorMessagesEnum } from '../../../commons/errors/enums/errorMessagesEnum';
import { ClientServiceInterface } from './interfaces/clientServiceInterface';
import { UpdateOperationsEnum } from './enums/updateOperationsEnum';
import {
  CLIENT_ENTITY_TOKEN,
  ClientEntityInterface,
} from '../../entities/clientEntity/interfaces/clientEntityInterfaces';
import {
  ClientInputType,
  ClientTableItem,
  ClientType,
  ClientUpdatePayload,
} from '../../entities/clientEntity/types/clientEntityTypes';
import ClientEntity from '../../entities/clientEntity/clientEntity';
import { getAllClientsInputType } from './types/clientServiceTypes';

const tableName = process.env.CLIENTS_SCOPE_TABLE_NAME as string;

@injectable()
export default class ClientService implements ClientServiceInterface {
  private tableService: TableServiceInterface;

  constructor(
    @inject(TABLE_REPOSITORY_TOKEN)
    private tableRepository: TableRepositoryInterface,
    @inject(CLIENT_ENTITY_TOKEN) private clientEntity: ClientEntityInterface
  ) {
    this.tableService = tableRepository.getInstance(
      this.clientEntity.getTableSchema(),
      tableName
    );
  }

  async createClient(client: ClientInputType): Promise<ClientTableItem> {
    // buscamos el cliente por client_name
    const clientByApiName = await this.getClientByName(
      client.client_name,
      true
    ).catch(() => {
      return null;
    });
    // si existe un cliente con el mismo client_name, lanzamos un error
    if (clientByApiName) {
      throw new Error(ErrorMessagesEnum.CLIENT_ALREADY_EXISTS);
    }

    const tempClientSecret = client.client_secret ?? randomUUID();

    if (!client.client_secret) {
      client.client_secret = tempClientSecret;
    }

    // creamos el cliente
    const clientData = this.clientEntity.build(client);

    await this.tableService.create(clientData);

    return { ...clientData, client_secret: tempClientSecret };
  }

  async getClientById(
    clientId: string,
    raw = false
  ): Promise<ClientTableItem | ClientType> {
    const response = await this.getAllClients({
      client_id: {
        eq: clientId,
      },
    });

    if (!response?.length) {
      throw new Error(ErrorMessagesEnum.CLIENT_NOT_FOUND);
    }

    const [item] = response;

    return raw ? item : ClientEntity.getClean(item);
  }

  async getClientByName(
    clientName: string,
    raw = false
  ): Promise<ClientTableItem | ClientType> {
    const response = await this.getAllClients({
      client_name: {
        eq: clientName,
      },
    });

    if (!response?.length) {
      throw new Error(ErrorMessagesEnum.CLIENT_NOT_FOUND);
    }

    const [item] = response;

    return raw ? item : ClientEntity.getClean(item);
  }

  async getAllClients(
    query?: getAllClientsInputType
  ): Promise<ClientTableItem[]> {
    const response = await this.tableService.query({
      query: {
        type: {
          eq: EntitiesEnum.CLIENT,
        },
        ...(query && query),
      },
      options: {
        using_index: TableGsiEnum.TYPE,
      },
    });

    if (!response?.length) {
      throw new Error(ErrorMessagesEnum.CLIENT_NOT_FOUND);
    }

    return response;
  }

  async deleteClientById(clientId: string): Promise<ClientTableItem> {
    const client = (await this.getClientById(
      clientId,
      true
    )) as ClientTableItem;

    if (!client) {
      throw new Error(ErrorMessagesEnum.CLIENT_NOT_FOUND);
    }

    await this.tableService.delete({ pk: client.pk, sk: client.sk });

    return client;
  }

  async updateClientById(
    clientId: string,
    inputPayload: ClientUpdatePayload
  ): Promise<ClientTableItem> {
    // buscamos el cliente por client_id
    const clientWithId = (await this.getClientById(
      clientId,
      true
    )) as ClientTableItem;

    if (inputPayload.client_name) {
      // buscamos el cliente por client_name
      const clientByName = await this.getClientByName(
        inputPayload.client_name
      ).catch(() => {
        return null;
      });
      // si existe un cliente con el mismo client_name, lanzamos un error
      if (clientByName) {
        throw new Error(ErrorMessagesEnum.CLIENT_ALREADY_EXISTS);
      }
    }

    const { conditions, ...payload } = inputPayload;

    if (conditions?.scopes) {
      let newScopes = '';
      switch (conditions.scopes) {
        case UpdateOperationsEnum.ADD:
          newScopes = ClientEntity.addScope(clientWithId, inputPayload.scopes);
          break;
        case UpdateOperationsEnum.REMOVE:
          newScopes = ClientEntity.removeScope(
            clientWithId,
            inputPayload.scopes
          );
          break;
        default:
          break;
      }
      payload.scopes = newScopes;
    }

    // eslint-disable-next-line camelcase
    const { pk, sk, client_id, ...updatedPayload } = merge(
      clientWithId,
      payload
    );

    const payloadForUpdate = {
      ...updatedPayload,
      updated_at: dayjs().unix(),
    };

    const updatedClient = await this.tableService.update({
      key: { pk, sk },
      payload: payloadForUpdate,
    });

    return updatedClient;
  }
}
