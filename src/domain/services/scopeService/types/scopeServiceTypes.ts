import { HttpMethodsEnum } from '../../../../commons/enums/httpMethodsEnum';

export type GetScopeByApiNameServiceInput = {
  apiName: string;
  scopeType?: string;
  raw?: boolean;
};

export type EndpointDataType = { endpoint: string; method: HttpMethodsEnum };

export type GetAllScopesType = {
  [key: string]: {
    [key: string]: string;
  };
};
