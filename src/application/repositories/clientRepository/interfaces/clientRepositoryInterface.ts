import {
  ClientTableItem,
  ClientType,
  ClientUpdatePayload,
} from '../../../../domain/entities/clientEntity/types/clientEntityTypes';

export const CLIENT_REPOSITORY_TOKEN = Symbol('ClientRepositoryInterface');

export interface ClientRepositoryInterface {
  createClient(client: any): Promise<ClientTableItem>;
  getClientById(params: { clientId: string }): Promise<ClientType>;
  getClientByName(params: { clientName: string }): Promise<ClientType>;
  updateClientById(
    clientId: string,
    payload: ClientUpdatePayload
  ): Promise<ClientTableItem>;
  deleteClientById(params: { clientId: string }): Promise<ClientTableItem>;
}
