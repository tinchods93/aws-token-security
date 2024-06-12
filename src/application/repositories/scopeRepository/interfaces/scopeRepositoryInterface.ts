import {
  ScopeTableItem,
  ScopeType,
  ScopeUpdatePayload,
} from '../../../../domain/entities/scopesEntity/types/scopeTypes';

export const SCOPE_REPOSITORY_TOKEN = Symbol('ScopeRepositoryInterface');

export interface ScopeRepositoryInterface {
  createScope(scope: any): Promise<ScopeTableItem>;
  getScopeById(params: { scopeId: string }): Promise<ScopeType>;
  getScopeByApiName(params: { apiName: string }): Promise<ScopeType>;
  updateScopeById(
    scopeId: string,
    payload: ScopeUpdatePayload
  ): Promise<ScopeTableItem>;
  deleteScopeById(scopeId: string): Promise<ScopeTableItem>;
}
