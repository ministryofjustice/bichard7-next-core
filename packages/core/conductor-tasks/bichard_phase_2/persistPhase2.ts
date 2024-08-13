import type { ConductorWorker } from "@io-orkes/conductor-javascript"
import completed from "@moj-bichard7/common/conductor/helpers/completed"
import failed from "@moj-bichard7/common/conductor/helpers/failed"
import failedTerminal from "@moj-bichard7/common/conductor/helpers/failedTerminal"
import s3TaskDataFetcher from "@moj-bichard7/common/conductor/middleware/s3TaskDataFetcher"
import createDbConfig from "@moj-bichard7/common/db/createDbConfig"
import { isError } from "@moj-bichard7/common/types/Result"
import postgres from "postgres"
import saveErrorListRecord from "../../lib/database/saveErrorListRecord"
import { phase2ResultSchema } from "../../phase2/schemas/phase2Result"
import type Phase2Result from "../../phase2/types/Phase2Result"
import { Phase2ResultType } from "../../phase2/types/Phase2Result"

const dbConfig = createDbConfig()

const persistPhase2: ConductorWorker = {
  taskDefName: "persist_phase2",
  execute: s3TaskDataFetcher<Phase2Result>(phase2ResultSchema, async (task) => {
    const { s3TaskData } = task.inputData
    const db = postgres(dbConfig)

    if (
      !s3TaskData.triggersGenerated &&
      s3TaskData.outputMessage.Exceptions.length === 0 &&
      s3TaskData.resultType !== Phase2ResultType.ignored
    ) {
      return failedTerminal(
        "No exceptions present, triggers not generated, and case is not ignored but persist_phase2 was called"
      )
    }

    const dbResult = await saveErrorListRecord(db, s3TaskData)
    if (isError(dbResult)) {
      return failed("Error saving to the database", dbResult.message)
    }

    return completed("Phase 2 result persisted successfully")
  })
}

export default persistPhase2
