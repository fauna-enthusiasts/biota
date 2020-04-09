import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { insert as insertFQLUDF } from "~/factory/api/fql/udf/insert";

export const InsertIndex = UDFunction({
  name: udfunctionNameNormalized("InsertIndex"),
  body: q.Query(
    q.Lambda(["identity", "private_key", "name", "options"], insertFQLUDF.index(q.Var("name") as any, q.Var("options") as any))
  ),
});