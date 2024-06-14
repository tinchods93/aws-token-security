import {
  ScopeInputType,
  ScopeTableItem,
  ScopeType,
  ScopeUpdatePayload,
} from '../../../entities/scopesEntity/types/scopeTypes';
import {
  EndpointDataType,
  GetAllScopesType,
  GetScopeByApiNameServiceInput,
} from '../types/scopeServiceTypes';

export const SCOPE_SERVICE_TOKEN = Symbol('ScopeServiceInterface');

export interface ScopeServiceInterface {
  createScope(scope: ScopeInputType): Promise<ScopeTableItem>;
  getScopeById(
    scopeId: string,
    raw?: boolean
  ): Promise<ScopeTableItem | ScopeType>;
  getScopeByApiName(
    params: GetScopeByApiNameServiceInput
  ): Promise<ScopeTableItem | ScopeType>;
  updateScopeById(
    scopeId: string,
    payload: ScopeUpdatePayload
  ): Promise<ScopeTableItem>;
  deleteScopeById(scopeId: string): Promise<ScopeTableItem>;
  validateScopes(
    scopesList: string,
    endpointData: EndpointDataType
  ): Promise<boolean>;
  getAllScopes(query?: GetAllScopesType): Promise<ScopeTableItem[]>;
}
