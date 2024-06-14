import { inject, injectable } from 'tsyringe';
import { StatusCodes } from 'http-status-codes';
import { ErrorCodesEnum } from '../../../commons/errors/enums/errorCodesEnum';

import {
  CLIENT_SERVICE_TOKEN,
  ClientServiceInterface,
} from '../../../domain/services/clientService/interfaces/clientServiceInterface';
import { ClientRepositoryInterface } from './interfaces/clientRepositoryInterface';
import {
  ClientInputType,
  ClientTableItem,
  ClientType,
  ClientUpdatePayload,
} from '../../../domain/entities/clientEntity/types/clientEntityTypes';
import ClientRepositoryException from '../errors/clientRepositoryException';

@injectable()
export default class ClientRepository implements ClientRepositoryInterface {
  constructor(
    @inject(CLIENT_SERVICE_TOKEN) private clientService: ClientServiceInterface
  ) {}

  async createClient(client: ClientInputType): Promise<ClientTableItem> {
    try {
      const response = await this.clientService.createClient(client);
      return response;
    } catch (error) {
      throw ClientRepositoryException.handle({
        message: error.message,
        code: ErrorCodesEnum.CLIENT_CREATE_FAILED,
        status: error.status ?? StatusCodes.CONFLICT,
        payload: client,
        error,
      });
    }
  }

  async getClientById(params: { clientId: string }): Promise<ClientType> {
    try {
      const response = await this.clientService.getClientById(params.clientId);
      return response;
    } catch (error) {
      throw ClientRepositoryException.handle({
        message: error.message,
        code: ErrorCodesEnum.CLIENT_GET_BY_ID_FAILED,
        status: error.status ?? StatusCodes.NOT_FOUND,
        payload: params,
        error,
      });
    }
  }

  async getClientByName(params: { clientName: string }): Promise<ClientType> {
    try {
      const response = await this.clientService.getClientByName(
        params.clientName
      );
      return response;
    } catch (error) {
      throw ClientRepositoryException.handle({
        message: error.message,
        code: ErrorCodesEnum.CLIENT_GET_BY_NAME_FAILED,
        status: error.status ?? StatusCodes.NOT_FOUND,
        payload: params,
        error,
      });
    }
  }

  async updateClientById(
    clientId: string,
    payload: ClientUpdatePayload
  ): Promise<ClientTableItem> {
    try {
      const response = await this.clientService.updateClientById(
        clientId,
        payload
      );
      return response;
    } catch (error) {
      throw ClientRepositoryException.handle({
        message: error.message,
        code: ErrorCodesEnum.CLIENT_UPDATE_FAILED,
        status: error.status ?? StatusCodes.CONFLICT,
        payload: {
          clientId,
          payload,
        },
        error,
      });
    }
  }

  async deleteClientById(params: {
    clientId: string;
  }): Promise<ClientTableItem> {
    try {
      const response = await this.clientService.deleteClientById(
        params.clientId
      );
      return response;
    } catch (error) {
      throw ClientRepositoryException.handle({
        message: error.message,
        code: ErrorCodesEnum.CLIENT_DELETE_FAILED,
        status: error.status ?? StatusCodes.NOT_FOUND,
        payload: params,
        error,
      });
    }
  }
}
