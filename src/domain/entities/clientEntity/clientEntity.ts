/* eslint-disable @typescript-eslint/no-unused-vars */
import dayjs from 'dayjs';
import { randomUUID } from 'crypto';
import { EntitiesEnum } from '../../../commons/enums/entitiesEnum';
import BasicEntity from '../basicEntity/basicEntity';
import {
  ClientInputType,
  ClientTableItem,
  ClientType,
} from './types/clientEntityTypes';
import { ClientEntityInterface } from './interfaces/clientEntityInterfaces';

class ClientEntity extends BasicEntity implements ClientEntityInterface {
  pk!: string; // <type>#id (sub es el sub que viene de cognito)

  sk!: string; // <type>#id (sub es el sub del usuario)

  type = EntitiesEnum.CLIENT;

  data!: ClientTableItem;

  created_at!: number;

  updated_at!: number;

  client_id!: string;

  client_secret!: string;

  client_type!: string;

  client_name!: string;

  scopes!: string;

  description?: string | undefined;

  is_active?: boolean | undefined;

  grant_types?: string[] | undefined;

  build(input: ClientInputType) {
    this.client_id = randomUUID();
    this.pk = `${this.type}#${this.client_id}`;
    this.sk = this.pk;
    this.client_type = input.client_type;
    this.client_name = input.client_name;
    this.scopes = input.scopes;
    this.client_secret = input.client_secret ?? '';
    // this.generateClientSecret();
    this.grant_types = input.grant_types;
    this.description = input.description;
    this.is_active = input.is_active ?? true;
    this.created_at = dayjs().unix();
    this.updated_at = dayjs().unix();

    this.data = {
      pk: this.pk,
      sk: this.sk,
      client_id: this.client_id,
      type: this.type,
      client_type: this.client_type,
      client_name: this.client_name,
      client_secret: this.client_secret,
      grant_types: this.grant_types,
      scopes: this.scopes,
      created_at: this.created_at,
      updated_at: this.updated_at,
      description: this.description,
      is_active: this.is_active,
    };

    return this.data;
  }

  // generateClientSecret() {
  //   // encrypt client secret with bcrypt
  //   this.client_secret = brcrypt.hashSync(this.client_secret, 10);
  // }

  static addScope(client: ClientType | ClientTableItem, scope: string) {
    const scopes = client.scopes.split(' ').filter((s) => s.trim() !== '');
    if (!scopes.includes(scope)) {
      scopes.push(scope);
      client.scopes = scopes.join(' ');
    }
    return client.scopes;
  }

  // static compareClientSecret(client: ClientTableItem, secret: string) {
  //   return brcrypt.compareSync(secret, client.client_secret ?? '');
  // }

  static removeScope(client: ClientType | ClientTableItem, scope: string) {
    const scopes = client.scopes.split(' ');
    if (scopes.includes(scope)) {
      const index = scopes.indexOf(scope);
      scopes.splice(index, 1);
      client.scopes = scopes.join(' ');
    }
    return client.scopes;
  }

  static getClean(client: ClientTableItem): ClientType {
    const { pk, sk, type, ...cleanClient } = client;
    return cleanClient;
  }
}

export default ClientEntity;
