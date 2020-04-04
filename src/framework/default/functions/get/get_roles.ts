import { query as q } from "faunadb";
import { get as getFQLUDF } from "~/factory/api/fql/udf/get";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";

export const GetRoles = UDFunction({
  name: udfunctionNameNormalized("GetRoles"),
  body: q.Query((userRef) => getFQLUDF.roles()),
});
