import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { repsert as repsertFQLUDF } from "~/factory/api/fql/udf/repsert";

export const RepsertKey = UDFunction({
  name: udfunctionNameNormalized("RepsertKey"),
  body: q.Query(q.Lambda(["identity", "private_key", "id", "options"], repsertFQLUDF.key(q.Var("id") as any, q.Var("options") as any))),
});