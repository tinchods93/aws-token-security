import {
  ScopeTableItem,
  ScopeType,
  ScopeUpdatePayload,
} from '../../../../domain/entities/scopesEntity/types/scopeTypes';
import { GetScopeByApiNameServiceInput } from '../../../../domain/services/scopeService/types/scopeServiceTypes';
import { ScopeRepositoryValidateScopeInput } from '../types/scopeRepositoryTypes';

export const SCOPE_REPOSITORY_TOKEN = Symbol('ScopeRepositoryInterface');

export interface ScopeRepositoryInterface {
  createScope(scope: any): Promise<ScopeTableItem>;
  getScopeById(params: { scopeId: string }): Promise<ScopeType>;
  getScopeByApiName(params: GetScopeByApiNameServiceInput): Promise<ScopeType>;
  updateScopeById(
    scopeId: string,
    payload: ScopeUpdatePayload
  ): Promise<ScopeTableItem>;
  deleteScopeById(scopeId: string): Promise<ScopeTableItem>;
  validateScopes(params: ScopeRepositoryValidateScopeInput): Promise<boolean>;
}
