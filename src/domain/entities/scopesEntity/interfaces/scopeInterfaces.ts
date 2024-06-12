import { BasicEntityInterface } from '../../basicEntity/interface/basicEntityInterface';
import { ScopeInputType, ScopeTableItem } from '../types/scopeTypes';

export const SCOPE_ENTITY_TOKEN = Symbol('ScopeEntityInterface');

export interface ScopeEntityInterface
  extends ScopeTableItem,
    BasicEntityInterface {
  data: ScopeTableItem;

  build(input: ScopeInputType): ScopeTableItem;
}
