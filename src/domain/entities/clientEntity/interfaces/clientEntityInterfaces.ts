import { BasicEntityInterface } from '../../basicEntity/interface/basicEntityInterface';
import { ClientInputType, ClientTableItem } from '../types/clientEntityTypes';

export const CLIENT_ENTITY_TOKEN = Symbol('ClientEntityInterface');

export interface ClientEntityInterface
  extends ClientTableItem,
    BasicEntityInterface {
  data: ClientTableItem;

  build(input: ClientInputType): ClientTableItem;
}
