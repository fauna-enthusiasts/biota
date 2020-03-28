// types
// external
import { query as q } from "faunadb";
// biota
import { UDFunction } from "~/factory/api/udfunction";
import { WrapActionToLog } from "~/framework/helpers/wrapActionToLog";
import { logData } from "~/framework/helpers/logData";

export const UpdateRights = UDFunction({
  name: "UpdateRights",
  body: q.Query(
    q.Lambda(
      ["user", "ref", "data"],
      WrapActionToLog(
        "update",
        q.Update(q.Var("ref"), { data: logData.update() })
      )
    )
  ),
  role: q.Role("augmented_user")
});
