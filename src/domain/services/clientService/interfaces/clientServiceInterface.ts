import {
  ClientInputType,
  ClientTableItem,
  ClientType,
  ClientUpdatePayload,
} from '../../../entities/clientEntity/types/clientEntityTypes';
import { getAllClientsInputType } from '../types/clientServiceTypes';

export const CLIENT_SERVICE_TOKEN = Symbol('ClientServiceInterface');

export interface ClientServiceInterface {
  createClient(client: ClientInputType): Promise<ClientTableItem>;
  getClientById(
    clientId: string,
    raw?: boolean
  ): Promise<ClientTableItem | ClientType>;
  getClientByName(
    clientName: string,
    raw?: boolean
  ): Promise<ClientTableItem | ClientType>;
  getAllClients(query?: getAllClientsInputType): Promise<ClientTableItem[]>;
  updateClientById(
    clientId: string,
    payload: ClientUpdatePayload
  ): Promise<ClientTableItem>;
  deleteClientById(clientId: string): Promise<ClientTableItem>;
}
