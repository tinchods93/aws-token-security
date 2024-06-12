import {
  CreateTableItemMethodInput,
  QueryTableItemMethodInput,
  TableKeyType,
  UpdateTableItemMethodInput,
} from '../types/tableServiceTypes';

export const TABLE_SERVICE_TOKEN = Symbol('TableServiceInterface');

export interface TableServiceInterface {
  create(data: CreateTableItemMethodInput): Promise<any>;
  query(params: QueryTableItemMethodInput): Promise<any[] | undefined>;
  update(params: UpdateTableItemMethodInput): Promise<any>;
  delete(params: TableKeyType): Promise<boolean>;
}
