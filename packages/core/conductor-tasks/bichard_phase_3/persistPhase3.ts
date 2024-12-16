import type { ConductorWorker } from "@io-orkes/conductor-javascript"

import completed from "@moj-bichard7/common/conductor/helpers/completed"
import failed from "@moj-bichard7/common/conductor/helpers/failed"
import s3TaskDataFetcher from "@moj-bichard7/common/conductor/middleware/s3TaskDataFetcher"
import createDbConfig from "@moj-bichard7/common/db/createDbConfig"
import { isError } from "@moj-bichard7/common/types/Result"
import postgres from "postgres"

import type Phase3Result from "../../phase3/types/Phase3Result"

import saveErrorListRecord from "../../lib/database/saveErrorListRecord"
import { phase3ResultSchema } from "../../phase3/schemas/phase3Result"

const dbConfig = createDbConfig()

const persistPhase3: ConductorWorker = {
  taskDefName: "persist_phase3",
  execute: s3TaskDataFetcher<Phase3Result>(phase3ResultSchema, async (task) => {
    const { s3TaskData } = task.inputData
    const db = postgres(dbConfig)

    const dbResult = await saveErrorListRecord(db, s3TaskData)
    if (isError(dbResult)) {
      return failed("Error saving to the database", dbResult.message)
    }

    return completed("Phase 3 result persisted successfully")
  })
}

export default persistPhase3
