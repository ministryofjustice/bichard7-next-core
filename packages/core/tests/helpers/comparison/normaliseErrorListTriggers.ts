import orderBy from "lodash.orderby"

import type ErrorListTriggerRecord from "../../../types/ErrorListTriggerRecord"

const normaliseErrorListTriggers = (triggers: ErrorListTriggerRecord[]): ErrorListTriggerRecord[] =>
  orderBy(triggers, ["trigger_code", "trigger_item_identity"]).map(
    ({ resolved_by, resolved_ts, status, trigger_code, trigger_item_identity }) =>
      ({
        resolved_by,
        resolved_ts,
        status,
        trigger_code,
        trigger_item_identity
      }) as ErrorListTriggerRecord
  )

export default normaliseErrorListTriggers
