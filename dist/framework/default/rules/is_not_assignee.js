"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const rule_1 = require("~/factory/rule");
exports.is_not_assignee = rule_1.Rule({
    name: "is_not_assignee",
    query: faunadb_1.query.Not(faunadb_1.query.Equals(faunadb_1.query.Select(["activity", "assignees"], faunadb_1.query.Var("doc"), null), faunadb_1.query.Identity()))
});
//# sourceMappingURL=is_not_assignee.js.map