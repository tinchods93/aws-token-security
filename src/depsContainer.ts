// import container from tsyringe and declare all dependencies for injection

import { container as depsContainer } from 'tsyringe';
import {
  TABLE_REPOSITORY_TOKEN,
  TableRepositoryInterface,
} from './infrastructure/secondary/repository/interfaces/tableRepositoryInterface';
import TableRepository from './infrastructure/secondary/repository/tableRepository';
import TableService from './infrastructure/secondary/services/tableService';
import {
  TABLE_SERVICE_TOKEN,
  TableServiceInterface,
} from './infrastructure/secondary/services/interface/tableServiceInterface';
import {
  SCOPE_ENTITY_TOKEN,
  ScopeEntityInterface,
} from './domain/entities/scopesEntity/interfaces/scopeInterfaces';
import ScopeEntity from './domain/entities/scopesEntity/scopeEntity';
import {
  SCOPE_SERVICE_TOKEN,
  ScopeServiceInterface,
} from './domain/services/scopeService/interfaces/scopeServiceInterface';
import ScopeService from './domain/services/scopeService/scopeService';
import {
  SCOPE_REPOSITORY_TOKEN,
  ScopeRepositoryInterface,
} from './application/repositories/scopeRepository/interfaces/scopeRepositoryInterface';
import ScopeRepository from './application/repositories/scopeRepository/scopeRepository';
import {
  CLIENT_REPOSITORY_TOKEN,
  ClientRepositoryInterface,
} from './application/repositories/clientRepository/interfaces/clientRepositoryInterface';
import {
  CLIENT_SERVICE_TOKEN,
  ClientServiceInterface,
} from './domain/services/clientService/interfaces/clientServiceInterface';
import ClientService from './domain/services/clientService/clientService';
import ClientRepository from './application/repositories/clientRepository/clientRepository';
import {
  CLIENT_ENTITY_TOKEN,
  ClientEntityInterface,
} from './domain/entities/clientEntity/interfaces/clientEntityInterfaces';
import ClientEntity from './domain/entities/clientEntity/clientEntity';

// application ############################################################################################################

// repositories
depsContainer.register<ScopeRepositoryInterface>(SCOPE_REPOSITORY_TOKEN, {
  useClass: ScopeRepository,
});
depsContainer.register<ClientRepositoryInterface>(CLIENT_REPOSITORY_TOKEN, {
  useClass: ClientRepository,
});

// domain ############################################################################################################
depsContainer.register<ScopeServiceInterface>(SCOPE_SERVICE_TOKEN, {
  useClass: ScopeService,
});
depsContainer.register<ClientServiceInterface>(CLIENT_SERVICE_TOKEN, {
  useClass: ClientService,
});
// entities
depsContainer.register<ScopeEntityInterface>(SCOPE_ENTITY_TOKEN, {
  useClass: ScopeEntity,
});
depsContainer.register<ClientEntityInterface>(CLIENT_ENTITY_TOKEN, {
  useClass: ClientEntity,
});

//infrastructure ############################################################################################################

depsContainer.register<TableServiceInterface>(TABLE_SERVICE_TOKEN, {
  useClass: TableService,
});
depsContainer.register<TableRepositoryInterface>(TABLE_REPOSITORY_TOKEN, {
  useClass: TableRepository,
});

export default depsContainer;
