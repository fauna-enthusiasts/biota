// types
// external
import { query as q } from "faunadb";
// biota
import { Rule } from "~/factory/role/rule";

export const is_owner = Rule({
  name: "is_owner",
  query: q.Equals(q.Select(["data", "_activity", "owner"], q.Var("doc"), null), q.Identity()),
});
