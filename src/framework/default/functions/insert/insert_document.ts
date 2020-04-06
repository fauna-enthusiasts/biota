import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { insert as insertFQLUDF } from "~/factory/api/fql/udf/insert";

export const InsertDocument = UDFunction({
  name: udfunctionNameNormalized("InsertDocument"),
  body: q.Query((identity, collection, data, id) => insertFQLUDF.document(collection, data, id)),
});
