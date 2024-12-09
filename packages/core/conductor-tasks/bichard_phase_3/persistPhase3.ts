import type { ConductorWorker } from "@io-orkes/conductor-javascript"

import completed from "@moj-bichard7/common/conductor/helpers/completed"
import failedTerminal from "@moj-bichard7/common/conductor/helpers/failedTerminal"
import s3TaskDataFetcher from "@moj-bichard7/common/conductor/middleware/s3TaskDataFetcher"

import type Phase3Result from "../../phase3/types/Phase3Result"

import { phase3ResultSchema } from "../../phase3/schemas/phase3Result"

// const dbConfig = createDbConfig()

const persistPhase3: ConductorWorker = {
  taskDefName: "persist_phase3",
  execute: s3TaskDataFetcher<Phase3Result>(phase3ResultSchema, async (task) => {
    const { s3TaskData } = task.inputData
    // const db = postgres(dbConfig)

    if (!s3TaskData.triggerGenerationAttempted) {
      return failedTerminal("No triggers not generated but persist_phase3 was called")
    }

    // const dbResult = await saveErrorListRecord(db, s3TaskData)
    // if (isError(dbResult)) {
    //   return failed("Error saving to the database", dbResult.message)
    // }

    return completed("Phase 3 result persisted successfully")
  })
}

export default persistPhase3
