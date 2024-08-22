import type { ConductorWorker } from "@io-orkes/conductor-javascript"
import completed from "@moj-bichard7/common/conductor/helpers/completed"
import s3TaskDataFetcher from "@moj-bichard7/common/conductor/middleware/s3TaskDataFetcher"
import { phase2ResultSchema } from "../../phase2/schemas/phase2Result"
import type Phase2Result from "../../phase2/types/Phase2Result"

const persistPhase2: ConductorWorker = {
  taskDefName: "persist_phase2",
  execute: s3TaskDataFetcher<Phase2Result>(phase2ResultSchema, (_task) => {
    return completed("Phase 2 result persisted successfully")
  })
}

export default persistPhase2
