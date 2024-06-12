import { TableBasicItem } from '../../../../../types/commonTypes';

export type ScopeType = {
  scope_type: string;
  api_name: string;
  endpoints: string[];
  description?: string;
  is_active?: boolean;
};

export type ScopeTableItem = TableBasicItem & ScopeType;
