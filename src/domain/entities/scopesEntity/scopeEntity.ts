/* eslint-disable @typescript-eslint/no-unused-vars */
import dayjs from 'dayjs';
import { randomUUID } from 'crypto';
import { EntitiesEnum } from '../../../commons/enums/entitiesEnum';
import { HttpMethodsEnum } from '../../../commons/enums/httpMethodsEnum';
import BasicEntity from '../basicEntity/basicEntity';
import { ScopeInputType, ScopeTableItem, ScopeType } from './types/scopeTypes';
import { ScopeEntityInterface } from './interfaces/scopeInterfaces';

class ScopeEntity extends BasicEntity implements ScopeEntityInterface {
  pk!: string; // <type>#id (sub es el sub que viene de cognito)

  sk!: string; // <type>#id (sub es el sub del usuario)

  type = EntitiesEnum.SCOPE;

  scope_id!: string;

  scope_type!: string;

  api_name!: string;

  endpoints!: string[];

  description?: string;

  is_active?: boolean;

  created_at!: number;

  updated_at!: number;

  data!: ScopeTableItem;

  build(input: ScopeInputType) {
    this.scope_id = randomUUID();
    this.pk = `${this.type}#${this.scope_id}`;
    this.sk = this.pk;
    this.scope_type = input.scope_type;
    this.api_name = input.api_name;
    this.endpoints = input.endpoints;
    this.description = input.description;
    this.is_active = input.is_active || true;
    this.created_at = dayjs().unix();
    this.updated_at = dayjs().unix();

    this.data = {
      pk: this.pk,
      sk: this.sk,
      scope_id: this.scope_id,
      type: this.type,
      scope_type: this.scope_type,
      api_name: this.api_name,
      endpoints: this.endpoints,
      created_at: this.created_at,
      updated_at: this.updated_at,
      description: this.description,
      is_active: this.is_active,
    };

    return this.data;
  }

  static addEndpoint(scope: ScopeType, endpoint: string) {
    const [method] = endpoint.split(' ');
    if (!HttpMethodsEnum[method]) {
      throw new Error('Invalid HTTP Method');
    }
    if (!scope.endpoints.includes(endpoint)) {
      scope.endpoints.push(endpoint);
    }
    return scope.endpoints;
  }

  static removeEndpoint(endpoints: string[], endpoint: string) {
    return endpoints.filter((ep) => ep !== endpoint);
  }

  static getClean(scope: ScopeTableItem): ScopeType {
    const { pk, sk, type, ...cleanScope } = scope;
    console.log('MARTIN_LOG=> cleanScope', cleanScope);
    return cleanScope;
  }
}

export default ScopeEntity;
