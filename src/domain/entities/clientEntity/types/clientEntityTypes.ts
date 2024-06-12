import { TableBasicItem } from '../../../../commons/types/commonTypes';

export type ClientType = {
  client_id: string;
  client_name: string;
  scopes: string;
  client_type: string;
  client_secret?: string;
  description?: string;
  is_active?: boolean;
  grant_types?: string[]; // The grant types the client can use
};

export type ClientInputType = Omit<ClientType, 'client_id'>;

export type ClientTableItem = TableBasicItem & ClientType;

export type ClientUpdatePayload = Omit<ClientType, 'client_id'> & {
  conditions?: { scopes?: string };
};
