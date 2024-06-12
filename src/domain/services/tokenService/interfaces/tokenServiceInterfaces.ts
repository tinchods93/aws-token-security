import { ClientType } from '../../../entities/clientEntity/types/clientEntityTypes';

export const TOKEN_SERVICE_TOKEN = Symbol('TokenServiceInterface');

export interface TokenServiceInterface {
  createToken(client: ClientType): string;
}
