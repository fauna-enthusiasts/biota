"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faunadb_1 = require("faunadb");
const tasks_1 = require("~/tasks");
const create_1 = require("~/factory/api/create");
const upsert_1 = require("~/factory/api/upsert");
const repsert_1 = require("~/factory/api/repsert");
const defaultFunctions = require("~/framework/api/default/functions");
const defaultRoles = require("~/framework/api/default/roles");
const defaultCollections = require("~/framework/api/default/collections");
const defaultIndexes = require("~/framework/api/default/indexes");
async function foundation(options) {
    const self = this;
    options = { roles: true, functions: true, collections: true, indexes: true, ...options };
    let tasks = [];
    /**
     *  Roles (base)
     */
    if (options.roles) {
        for (let defaultRole of Object.values(defaultRoles)) {
            tasks.push({
                name: `Creating (base) role: ${defaultRole.name}`,
                task() {
                    return self.query(faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Role(defaultRole.name)), null, create_1.create.role(defaultRole.name)));
                }
            });
        }
    }
    /**
     *  Functions
     */
    if (options.functions) {
        for (let UDFunction of Object.values(defaultFunctions)) {
            tasks.push({
                name: `Upserting function: ${UDFunction.name}`,
                task() {
                    return self.query(repsert_1.repsert.function(UDFunction));
                },
                fullError: true
            });
        }
    }
    /**
     *  Collections
     */
    if (options.collections) {
        tasks.push({
            name: `Scaffold collection: ${defaultCollections.users.name}`,
            task() {
                return self.collection(defaultCollections.users).scaffold();
            }
        });
        tasks.push({
            name: `Scaffold collection: ${defaultCollections.actions.name}`,
            task() {
                return self.collection(defaultCollections.actions).scaffold({
                    index: [
                        "document",
                        "ts",
                        "user",
                        "name",
                        {
                            field: "at",
                            binding: faunadb_1.query.Query(faunadb_1.query.Lambda("doc", faunadb_1.query.Let({
                                ts: faunadb_1.query.Select("ts", faunadb_1.query.Var("doc"), null)
                            }, faunadb_1.query.If(faunadb_1.query.IsTimestamp(faunadb_1.query.Var("ts")), faunadb_1.query.ToTime(faunadb_1.query.Var("ts")), null))))
                        }
                    ]
                });
            }
        });
        tasks.push({
            name: `Scaffold collection: ${defaultCollections.relations.name}`,
            task() {
                return self.collection(defaultCollections.relations).scaffold({
                    index: ["name", "parts.relation", "parts.collection", "parts.path"],
                    field: [
                        {
                            field: "uniqueness_check",
                            unique: true,
                            outputs: [
                                {
                                    field: "data.parts.0.relation"
                                },
                                {
                                    field: "data.parts.0.collection"
                                },
                                {
                                    field: "data.parts.0.path"
                                },
                                {
                                    field: "data.parts.1.relation"
                                },
                                {
                                    field: "data.parts.1.collection"
                                },
                                {
                                    field: "data.parts.1.path"
                                }
                            ]
                        }
                    ]
                });
            },
            fullError: true
        });
    }
    /**
     *  Indexes
     */
    if (options.indexes) {
        for (let defaultIndex of Object.values(defaultIndexes)) {
            tasks.push({
                name: `Upserting index: ${defaultIndex.name}`,
                task() {
                    return self.query(upsert_1.upsert.index(defaultIndex));
                }
            });
        }
    }
    /**
     *  Roles
     */
    if (options.roles) {
        for (let defaultRole of Object.values(defaultRoles)) {
            tasks.push({
                name: `Upserting role: ${defaultRole.name}`,
                task() {
                    return self.query(upsert_1.upsert.role(defaultRole));
                },
                fullError: true
            });
        }
    }
    return tasks_1.execute(tasks, {
        domain: "DB.foundation"
    });
}
exports.foundation = foundation;
//# sourceMappingURL=foundation.js.map