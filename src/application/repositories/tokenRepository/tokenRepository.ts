import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import {
  TOKEN_SERVICE_TOKEN,
  TokenServiceInterface,
} from '../../../domain/services/tokenService/interfaces/tokenServiceInterfaces';
import {
  CLIENT_REPOSITORY_TOKEN,
  ClientRepositoryInterface,
} from '../clientRepository/interfaces/clientRepositoryInterface';
import { ErrorCodesEnum } from '../../../commons/errors/enums/errorCodesEnum';
import TokenRepositoryException from '../errors/tokenRepositoryException';
import { ErrorMessagesEnum } from '../../../commons/errors/enums/errorMessagesEnum';
import { TokenRepositoryInterface } from './interfaces/tokenRepositoryInterface';

@injectable()
export default class TokenRepository implements TokenRepositoryInterface {
  constructor(
    @inject(TOKEN_SERVICE_TOKEN) private tokenService: TokenServiceInterface,
    @inject(CLIENT_REPOSITORY_TOKEN)
    private clientRepository: ClientRepositoryInterface
  ) {}

  async createToken(params: {
    client_id: string;
    client_secret: string;
  }): Promise<string> {
    try {
      // buscamos el cliente por id
      const client = await this.clientRepository.getClientById({
        clientId: params.client_id,
      });

      // si no existe o el secreto no coincide, lanzamos un error
      if (!client || client?.client_secret !== params.client_secret) {
        // el mensaje es generico para no dar pistas a un atacante
        throw new Error(ErrorMessagesEnum.INVALID_CLIENT_DATA);
      }

      const response = this.tokenService.createToken(client);
      return response;
    } catch (error) {
      throw TokenRepositoryException.handle({
        message: error.message,
        code: ErrorCodesEnum.TOKEN_CREATE_FAILED,
        status: error.status ?? StatusCodes.CONFLICT,
        payload: params,
        error,
      });
    }
  }
}
