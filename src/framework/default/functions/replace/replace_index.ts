import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { replace as replaceFQLUDF } from "~/factory/api/fql/udf/replace";

export const ReplaceIndex = UDFunction({
  name: udfunctionNameNormalized("ReplaceIndex"),
  body: q.Query((userRef, name, options) => replaceFQLUDF.index(name, options)),
});
