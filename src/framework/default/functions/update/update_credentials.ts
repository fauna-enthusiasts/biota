import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { update as updateFQLUDF } from "~/factory/api/fql/udf/update";

export const UpdateDocumentCredentials = UDFunction({
  name: udfunctionNameNormalized("UpdateDocumentCredentials"),
  body: q.Query(
    q.Lambda(
      ["userRef", "collection", "id", "credentials"],
      updateFQLUDF.credentials(q.Var("collection") as string, q.Var("id"), q.Var("credentials"))
    )
  ),
});
