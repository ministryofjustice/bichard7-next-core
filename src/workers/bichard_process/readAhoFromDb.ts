import type { ConductorWorker } from "@io-orkes/conductor-typescript"
import getTaskConcurrency from "conductor/src/getTaskConcurrency"
import type { Task } from "conductor/src/types/Task"
import { conductorLog } from "conductor/src/utils"
import postgres from "postgres"
import { isError } from "src/comparison/types"
import createDbConfig from "src/lib/createDbConfig"
import { parseAhoXml } from "src/parse/parseAhoXml"
import type ErrorListRecord from "src/types/ErrorListRecord"

const taskDefName = "read_aho_from_db"
const dbConfig = createDbConfig()
const db = postgres(dbConfig)

const readAhoFromDb: ConductorWorker = {
  taskDefName,
  concurrency: getTaskConcurrency(taskDefName),
  execute: async (task: Task) => {
    const correlationId = task.inputData?.correlationId

    const dbResult = await db<
      ErrorListRecord[]
    >`SELECT updated_msg from br7own.error_list WHERE message_id = ${correlationId}`

    const ahoXml = dbResult[0].updated_msg
    if (!ahoXml) {
      return {
        status: "FAILED"
      }
    }

    const aho = parseAhoXml(ahoXml)

    if (isError(aho)) {
      return {
        status: "FAILED"
      }
    }

    return {
      logs: [conductorLog("Audit logs written to API")],
      outputData: { aho },
      status: "COMPLETED"
    }
  }
}

export default readAhoFromDb
