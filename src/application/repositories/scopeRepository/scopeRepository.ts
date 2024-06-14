import { inject, injectable } from 'tsyringe';
import { StatusCodes } from 'http-status-codes';
import { ErrorCodesEnum } from '../../../commons/errors/enums/errorCodesEnum';
import {
  ScopeInputType,
  ScopeTableItem,
  ScopeType,
  ScopeUpdatePayload,
} from '../../../domain/entities/scopesEntity/types/scopeTypes';
import {
  SCOPE_SERVICE_TOKEN,
  ScopeServiceInterface,
} from '../../../domain/services/scopeService/interfaces/scopeServiceInterface';
import ScopeRepositoryException from '../errors/scopeRepositoryException';
import { ScopeRepositoryInterface } from './interfaces/scopeRepositoryInterface';
import { GetScopeByApiNameServiceInput } from '../../../domain/services/scopeService/types/scopeServiceTypes';
import { ScopeRepositoryValidateScopeInput } from './types/scopeRepositoryTypes';

@injectable()
export default class ScopeRepository implements ScopeRepositoryInterface {
  constructor(
    @inject(SCOPE_SERVICE_TOKEN) private scopeService: ScopeServiceInterface
  ) {
    console.log(
      'MARTIN_LOG=> ScopeRepositoryConstructor',
      JSON.stringify({ scopeService })
    );
    console.log(
      'MARTIN_LOG=> ScopeRepositoryConstructor 2',
      JSON.stringify(this)
    );
  }

  async createScope(scope: ScopeInputType): Promise<ScopeTableItem> {
    try {
      const response = await this.scopeService.createScope(scope);
      return response;
    } catch (error) {
      throw ScopeRepositoryException.handle({
        message: error.message,
        code: ErrorCodesEnum.SCOPE_CREATE_FAILED,
        status: error.status ?? StatusCodes.CONFLICT,
        payload: scope,
        error,
      });
    }
  }

  async getScopeById(params: { scopeId: string }): Promise<ScopeType> {
    try {
      const response = await this.scopeService.getScopeById(params.scopeId);
      return response;
    } catch (error) {
      console.log(
        'MARTIN_LOG=> ScopeRepository -> getScopeById -> error',
        JSON.stringify(error)
      );
      throw ScopeRepositoryException.handle({
        message: error.message,
        code: ErrorCodesEnum.SCOPE_GET_BY_ID_FAILED,
        status: error.status ?? StatusCodes.NOT_FOUND,
        payload: params,
        error,
      });
    }
  }

  async getScopeByApiName(
    params: GetScopeByApiNameServiceInput
  ): Promise<ScopeType> {
    try {
      const response = await this.scopeService.getScopeByApiName(params);
      return response;
    } catch (error) {
      throw ScopeRepositoryException.handle({
        message: error.message,
        code: ErrorCodesEnum.SCOPE_GET_BY_API_NAME_FAILED,
        status: error.status ?? StatusCodes.NOT_FOUND,
        payload: params,
        error,
      });
    }
  }

  async updateScopeById(
    scopeId: string,
    payload: ScopeUpdatePayload
  ): Promise<ScopeTableItem> {
    try {
      const response = await this.scopeService.updateScopeById(
        scopeId,
        payload
      );
      return response;
    } catch (error) {
      throw ScopeRepositoryException.handle({
        message: error.message,
        code: ErrorCodesEnum.SCOPE_UPDATE_FAILED,
        status: error.status ?? StatusCodes.CONFLICT,
        payload: {
          scopeId,
          payload,
        },
        error,
      });
    }
  }

  async deleteScopeById(scopeId: string): Promise<ScopeTableItem> {
    try {
      const response = await this.scopeService.deleteScopeById(scopeId);
      return response;
    } catch (error) {
      throw ScopeRepositoryException.handle({
        message: error.message,
        code: ErrorCodesEnum.SCOPE_DELETE_FAILED,
        status: error.status ?? StatusCodes.NOT_FOUND,
        payload: {
          scopeId,
        },
        error,
      });
    }
  }

  async validateScopes(
    params: ScopeRepositoryValidateScopeInput
  ): Promise<boolean> {
    try {
      const { scopesList, endpointMethod, endpoint } = params;
      const response = await this.scopeService.validateScopes(scopesList, {
        method: endpointMethod,
        endpoint,
      });
      return response;
    } catch (error) {
      throw ScopeRepositoryException.handle({
        message: error.message,
        code: ErrorCodesEnum.SCOPE_VALIDATION_FAILED,
        status: error.status ?? StatusCodes.NOT_FOUND,
        payload: params,
        error,
      });
    }
  }
}
