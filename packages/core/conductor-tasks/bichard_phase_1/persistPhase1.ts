import type { ConductorWorker } from "@io-orkes/conductor-javascript"

import completed from "@moj-bichard7/common/conductor/helpers/completed"
import failed from "@moj-bichard7/common/conductor/helpers/failed"
import s3TaskDataFetcher from "@moj-bichard7/common/conductor/middleware/s3TaskDataFetcher"
import createDbConfig from "@moj-bichard7/common/db/createDbConfig"
import { isError } from "@moj-bichard7/common/types/Result"
import postgres from "postgres"

import type Phase1Result from "../../phase1/types/Phase1Result"

import saveErrorListRecord from "../../lib/database/saveErrorListRecord"
import { phase1ResultSchema } from "../../phase1/schemas/phase1Result"

const dbConfig = createDbConfig()

const persistPhase1: ConductorWorker = {
  execute: s3TaskDataFetcher<Phase1Result>(phase1ResultSchema, async (task) => {
    const { s3TaskData } = task.inputData
    const db = postgres(dbConfig)

    const dbResult = await saveErrorListRecord(db, s3TaskData)
    if (isError(dbResult)) {
      return failed("Error saving to the database", dbResult.message)
    }

    return completed("Phase 1 result persisted successfully")
  }),
  taskDefName: "persist_phase1"
}

export default persistPhase1
