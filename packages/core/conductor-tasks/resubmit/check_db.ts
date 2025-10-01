import type { ConductorWorker } from "@io-orkes/conductor-javascript"
import type Task from "@moj-bichard7/common/conductor/types/Task"
import type { CaseRow } from "@moj-bichard7/common/types/Case"

import { completed, failed } from "@moj-bichard7/common/conductor/helpers/index"
import inputDataValidator from "@moj-bichard7/common/conductor/middleware/inputDataValidator"
import createDbConfig from "@moj-bichard7/common/db/createDbConfig"
import postgres from "postgres"
import { z } from "zod"

import ResolutionStatus from "../../types/ResolutionStatus"

const dbConfig = createDbConfig()

const inputDataSchema = z.object({
  messageId: z.uuid()
})
type InputData = z.infer<typeof inputDataSchema>

const checkDb: ConductorWorker = {
  taskDefName: "check_db",
  execute: inputDataValidator(inputDataSchema, async (task: Task<InputData>) => {
    const { messageId } = task.inputData
    const db = postgres(dbConfig)

    const [caseRow] = (await db`SELECT * FROM br7own.error_list el WHERE el.message_id = ${messageId}`) as CaseRow[]

    if (!caseRow) {
      return failed(`Case not found: ${messageId}`)
    }

    if (caseRow.error_status === ResolutionStatus.SUBMITTED && caseRow.error_locked_by_id) {
      return completed({ messageId: messageId }, `Can be resubmitted ${messageId}`)
    }

    return failed("Case has wrong Error Status or has no lock")
  })
}

export default checkDb
