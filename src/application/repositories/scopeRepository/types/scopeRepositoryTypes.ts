import { HttpMethodsEnum } from '../../../../commons/enums/httpMethodsEnum';

export type ScopeRepositoryValidateScopeInput = {
  scopesList: string;
  endpointMethod: HttpMethodsEnum;
  endpoint: string;
};
