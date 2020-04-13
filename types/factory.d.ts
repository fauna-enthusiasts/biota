import { FactoryAction } from './factory/factory.action';
import { FactoryCollection } from './factory/factory.collection';
import { FactoryCollectionsApi } from './factory/factory.collections';
import { FactoryCredential } from './factory/factory.credential';
import { FactoryCredentialsApi } from './factory/factory.credentials';
import { FactoryDatabase } from './factory/factory.database';
import { FactoryDatabasesApi } from './factory/factory.databases';
import { FactoryDocument } from './factory/factory.document';
import { FactoryIndex } from './factory/factory.index';
import { FactoryIndexesApi } from './factory/factory.indexes';
import { FactoryKey } from './factory/factory.key';
import { FactoryKeysApi } from './factory/factory.keys';
import { FactoryQLApi } from './factory/factory.ql';
import { FactoryRole } from './factory/factory.role';
import { FactoryRolesApi } from './factory/factory.roles';
import { FactoryToken } from './factory/factory.token';
import { FactoryTokensApi } from './factory/factory.tokens';
import { FactoryUDFunction } from './factory/factory.udfunction';
import { FactoryUDFunctionsApi } from './factory/factory.udfunctions';
import { FactoryUser } from './factory/factory.user';
import { FactoryUsersApi } from './factory/factory.users';
import { FactoryUserSession } from './factory/factory.userSession';

export interface BiotaFactory {
  ql: FactoryQLApi;
  // foundation: FactoryFoundationApi;
  action: FactoryAction;
  collection: FactoryCollection;
  collections: FactoryCollectionsApi;
  credential: FactoryCredential;
  credentials: FactoryCredentialsApi;
  database: FactoryDatabase;
  databases: FactoryDatabasesApi;
  document: FactoryDocument;
  index: FactoryIndex;
  indexes: FactoryIndexesApi;
  key: FactoryKey;
  keys: FactoryKeysApi;
  role: FactoryRole;
  roles: FactoryRolesApi;
  token: FactoryToken;
  tokens: FactoryTokensApi;
  udfunction: FactoryUDFunction;
  udfunctions: FactoryUDFunctionsApi;
  user: FactoryUser;
  users: FactoryUsersApi;
  userSession: FactoryUserSession;
}
