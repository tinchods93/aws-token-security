import {
  ScopeInputType,
  ScopeTableItem,
  ScopeType,
  ScopeUpdatePayload,
} from '../../../entities/scopesEntity/types/scopeTypes';

export const SCOPE_SERVICE_TOKEN = Symbol('ScopeServiceInterface');

export interface ScopeServiceInterface {
  createScope(scope: ScopeInputType): Promise<ScopeTableItem>;
  getScopeById(
    scopeId: string,
    raw?: boolean
  ): Promise<ScopeTableItem | ScopeType>;
  getScopeByApiName(
    apiName: string,
    raw?: boolean
  ): Promise<ScopeTableItem | ScopeType>;
  updateScopeById(
    scopeId: string,
    payload: ScopeUpdatePayload
  ): Promise<ScopeTableItem>;
  deleteScopeById(scopeId: string): Promise<ScopeTableItem>;
}
