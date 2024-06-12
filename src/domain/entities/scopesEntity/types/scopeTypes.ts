import { TableBasicItem } from '../../../../commons/types/commonTypes';

export type ScopeType = {
  scope_id: string;
  scope_type: string;
  api_name: string;
  endpoints: string[];
  description?: string;
  is_active?: boolean;
};

export type ScopeInputType = Omit<ScopeType, 'scope_id'>;

export type ScopeTableItem = TableBasicItem & ScopeType;

export type ScopeUpdatePayload = Omit<ScopeType, 'scope_id'> & {
  conditions?: { endpoints?: string };
};
