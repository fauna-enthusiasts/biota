// types
import {
  DBFrameworkCollection,
  DBFrameworkCollectionFieldOptions,
  FaunaIndexOptions,
  Fauna,
  FaunaCollectionOptions
} from "~/../types/db";
// external
// biota
import { q } from "~/index";
import { execute } from "~/tasks";
import * as helpers from "~/helpers";
import { BiotaIndexName } from "~/factory/api/index";
import { upsert } from "~/factory/api/upsert";
import * as collectionFactory from "~/factory/api/collection";

export function collection(
  collectionNameOrOptions: string | FaunaCollectionOptions
): DBFrameworkCollection {
  let self = this;

  let collectionDefinition: FaunaCollectionOptions = {
    name: null,
    data: {},
    history_days: 30,
    ttl_days: null
  };

  if (typeof collectionNameOrOptions === "string") {
    collectionDefinition.name = collectionNameOrOptions;
  } else if (typeof collectionNameOrOptions === "object") {
    Object.assign(collectionDefinition, collectionNameOrOptions);
  }

  if (!collectionDefinition.name) {
    throw new Error("biota.collection() - no valid collection name");
  }

  let methods: DBFrameworkCollection = {
    async field() {},
    async searchable() {},
    async scaffold() {},
    async search() {},
    async import(data) {}
  };

  methods.field = async function fieldMethod(
    field: string | string[] | DBFrameworkCollectionFieldOptions
  ) {
    let options: DBFrameworkCollectionFieldOptions = {
      field: null,
      binding: null,
      unique: false,
      autocomplete: false,
      searchable: false,
      data: {},
      serialized: null,
      permissions: null,
      reverse: false
    };

    let index: FaunaIndexOptions = {
      name: null,
      source: {
        collection: q.Collection(collectionDefinition.name),
        fields: {}
      },
      terms: [],
      values: [],
      unique: options.unique,
      serialized: options.serialized,
      permissions: options.permissions,
      data: options.data
    };

    if (typeof field === "string") {
      options.field = field;
    } else if (typeof field === "object") {
      Object.assign(options, field);
    }

    if (!options.field) {
      throw new Error(`biota.field() - no field name has been given`);
    }

    index.name = BiotaIndexName(
      helpers.name([
        collectionDefinition.name,
        "searchable",
        "by",
        helpers.stringPath(options.field)
      ])
    );

    index.terms = [
      {
        field: helpers.path(options.field),
        reverse: options.reverse
      }
    ];

    let tasks = [
      {
        name: `Creating index: ${index.name}`,
        async task() {
          return self.query(upsert.index(index));
        }
      }
    ];

    return execute(tasks);
  };

  methods.searchable = async function searchable(field) {
    if (typeof field === "string") {
      return methods.field({ field, searchable: true });
    } else {
      return methods.field({
        ...(field as DBFrameworkCollectionFieldOptions),
        searchable: true
      });
    }
  };

  methods.scaffold = async function scaffold() {
    let activitySearchableFields = [
      "access.roles",
      "access.owner",
      "access.assignees",
      "activity.assigned_by",
      "activity.assigned_at",
      "activity.owner_changed_by",
      "activity.owner_changed_at",
      "activity.credentials_changed_by",
      "activity.credentials_changed_at",
      "activity.imported_by",
      "activity.imported_at",
      "activity.created_by",
      "activity.created_at",
      "activity.updated_by",
      "activity.updated_at",
      "activity.replaced_by",
      "activity.replaced_at",
      "activity.expired_by",
      "activity.expired_at",
      "activity.deleted_by",
      "activity.deleted_at",
      "activity.archived_by",
      "activity.archived_at",
      "activity.hidden_by",
      "activity.hidden_at"
    ];

    let tasks = [
      {
        name: `Upserting collection: ${collectionDefinition.name}`,
        async task() {
          return self.query(upsert.collection(collectionDefinition));
        }
      }
    ];

    for (let searchableField of activitySearchableFields) {
      tasks.push({
        name: `Upserting searchable field: ${searchableField}`,
        async task() {
          return methods.searchable(searchableField);
        }
      });
    }

    return execute(tasks);
  };

  methods.import = async function importFunction(data, options = {}) {
    let { batchSize = 50, keepId = false } = options;
    let items = data;
    if (!Array.isArray(items)) items = [items];
    let batches = helpers.splitEvery(batchSize, items);
    let tasks = [];
    let createQuery: Fauna.Expr;
    if (!keepId) {
      createQuery = collectionFactory
        .collection(collectionDefinition.name)
        .create(q.Var("item"));
    } else {
      createQuery = collectionFactory
        .collection(collectionDefinition.name)
        .upsert(
          q.Select("id", q.Var("item"), null),
          q.Select("data", q.Var("item"), null)
        );
    }
    for (let [index, batch] of Object.entries(batches)) {
      tasks.push({
        name: `Importing batch n°${index + 1} on ${batches.length}`,
        task() {
          return self.query(q.Map(batch, q.Lambda("item", createQuery)));
        }
      });
    }
    return execute(tasks);
  };

  return methods;
}
