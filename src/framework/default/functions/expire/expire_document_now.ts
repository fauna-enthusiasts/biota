import { query as q } from "faunadb";
import { expire as expireFQLUDF } from "~/factory/api/fql/udf/expire";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";

export const ExpireDocumentNow = UDFunction({
  name: udfunctionNameNormalized("ExpireDocumentNow"),
  body: q.Query((identity, collection, id) => expireFQLUDF.documentNow(collection, id)),
});