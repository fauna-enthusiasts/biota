import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { assign as assignFQLUDF } from "~/factory/api/fql/udf/assign";

export const AssignDocument = UDFunction({
  name: udfunctionNameNormalized("AssignDocument"),
  body: q.Query((userRef, collection, id, newAssignee) => assignFQLUDF.document(collection, id, newAssignee)),
});
