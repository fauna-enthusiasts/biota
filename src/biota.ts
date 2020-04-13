import * as fauna from 'faunadb';
import { Fauna, FaunaId } from '~/../types/fauna';
import * as framework from '~/framework';
import { BiotaFrameworkCollectionApi, BiotaFrameworkFoundation, BiotaFrameworkRelation } from '../types/framework/framework.collection';
import { BiotaFrameworkCollectionsApi } from '../types/framework/framework.collections';
import { BiotaFrameworkDatabaseApi } from '../types/framework/framework.database';
import { BiotaFrameworkDatabasesApi } from '../types/framework/framework.databases';
import { BiotaFrameworkDocumentApi } from '../types/framework/framework.document';
import { BiotaFrameworkIndexApi } from '../types/framework/framework.index';
import { BiotaFrameworkIndexesApi } from '../types/framework/framework.indexes';
import { BiotaFrameworkRoleApi } from '../types/framework/framework.role';
import { BiotaFrameworkRolesApi } from '../types/framework/framework.roles';
import { BiotaFrameworkUDFunctionApi } from '../types/framework/framework.udfunction';
import { BiotaFrameworkUDFunctionsApi } from '../types/framework/framework.udfunctions';
import { BiotaFrameworkUserApi } from '../types/framework/framework.user';
import { bindSubFunctions } from './helpers';

interface BiotaOptionsDocumentProtectedPaths {
  _auth: boolean;
  _membership: boolean;
  _validity: boolean;
  _activity: boolean;
  [key: string]: boolean;
}

interface BiotaOptionsDocumentPaths {
  _auth: string | string[];
  '_auth.email'?: string | string[];
  '_auth.accounts'?: string | string[];
  _membership?: string | string[];
  '_membership.owner'?: string | string[];
  '_membership.roles'?: string | string[];
  '_membership.assignees'?: string | string[];
  _validity: string | string[];
  '_validity.deleted'?: string | string[];
  '_validity.expires_at'?: string | string[];
  _activity?: string | string[];
}

interface BiotaOptionsDocument {
  paths?: BiotaOptionsDocumentPaths;
  protectedPaths?: BiotaOptionsDocumentProtectedPaths;
}

interface BiotaOptions {
  secret: string;
  debug?: boolean;
  document?: BiotaOptionsDocument;
}

export class Biota {
  client: Fauna.Client;
  secret: string;
  documentOptions: BiotaOptionsDocument;

  query: (fqlQuery: Fauna.Expr) => any;
  paginate: (paginateQuery: Fauna.Expr, paginateOptions?: object) => AsyncGenerator<any, any, any>;

  document?: (collectionName: string, id: FaunaId) => BiotaFrameworkDocumentApi;
  user?: BiotaFrameworkUserApi;
  collection?: (name: string) => BiotaFrameworkCollectionApi;
  collections?: BiotaFrameworkCollectionsApi;
  index?: (name: string) => BiotaFrameworkIndexApi;
  indexes?: BiotaFrameworkIndexesApi;
  role?: (name: string) => BiotaFrameworkRoleApi;
  roles?: BiotaFrameworkRolesApi;
  database?: (name: string) => BiotaFrameworkDatabaseApi;
  databases?: BiotaFrameworkDatabasesApi;
  udfunction?: (name: string) => BiotaFrameworkUDFunctionApi;
  udfunctions?: BiotaFrameworkUDFunctionsApi;

  foundation: BiotaFrameworkFoundation;
  relation: BiotaFrameworkRelation;

  defaults: any;

  // tslint:disable-next-line: variable-name
  privateKey: (private_key: string) => Promise<any>;

  constructor(options: BiotaOptions) {
    const { secret, debug, document } = options || {};

    this.secret = secret;

    const { paths = {}, protectedPaths = {} } = document || {};
    this.documentOptions = {};
    this.documentOptions.protectedPaths = {
      _auth: true,
      _membership: true,
      _validity: true,
      _activity: true,
      ...protectedPaths,
    };
    this.documentOptions.paths = {
      _auth: '_auth',
      '_auth.email': '_auth.email',
      '_auth.accounts': '_auth.accounts',
      _membership: '_membership',
      '_membership.owner': '_membership.owner',
      '_membership.roles': '_membership.roles',
      '_membership.assignees': '_membership.assignees',
      _validity: '_validity',
      '_validity.deleted': '_validity.deleted',
      '_validity.expires_at': '_validity.expires_at',
      _activity: '_activity',
      ...paths,
    };

    try {
      this.client = new fauna.Client({ secret });
      // tslint:disable-next-line: no-empty
    } catch (error) {}

    this.query = framework.query.bind(this);
    // this.paginate = framework.paginate.bind(this);
    // this.document = framework.document.bind(this);

    // this.user = framework.user;
    // bindSubFunctions(this, 'user');
    // this.collection = framework.collection.bind(this);
    // this.collections = framework.collections;
    // bindSubFunctions(this, 'collections');
    // this.index = framework.index.bind(this);
    // this.indexes = framework.indexes;
    // bindSubFunctions(this, 'indexes');
    // this.role = framework.role.bind(this);
    // this.roles = framework.roles;
    // bindSubFunctions(this, 'roles');
    // this.database = framework.database.bind(this);
    // this.databases = framework.databases;
    // bindSubFunctions(this, 'databases');
    // this.udfunction = framework.udfunction.bind(this);
    // this.udfunctions = framework.udfunctions;
    // bindSubFunctions(this, 'udfunctions');

    // this.foundation = framework.foundation.bind(this);
    // this.relation = framework.relation.bind(this);

    // this.privateKey = framework.privateKey.bind(this);
    // this.defaults = framework.defaults;
  }
}
