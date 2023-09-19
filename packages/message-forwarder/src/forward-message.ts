import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import putFileToS3 from "@moj-bichard7/common/s3/putFileToS3"
import Workflow from "@moj-bichard7/conductor/src/workflow"
import parseAhoXml from "@moj-bichard7/core/phase1/parse/parseAhoXml/parseAhoXml"
import type { Client } from "@stomp/stompjs"
import { randomUUID } from "crypto"
import {
  completeWaitingTask,
  getWaitingTaskForWorkflow,
  getWorkflowByCorrelationId,
  startWorkflow
} from "./conductor-api"
import createConductorConfig from "./createConductorConfig"
import { isError, type PromiseResult } from "./Result"

const s3Config = createS3Config()
const conductorConfig = createConductorConfig()

const destinationType = process.env.DESTINATION_TYPE ?? "mq"
const destination = process.env.DESTINATION ?? "HEARING_OUTCOME_INPUT_QUEUE"

const taskDataBucket = process.env.TASK_DATA_BUCKET_NAME
if (!taskDataBucket) {
  throw Error("TASK_DATA_BUCKET_NAME environment variable is required")
}

const forwardMessage = async (message: string, client: Client): PromiseResult<void> => {
  if (destinationType === "mq") {
    client.publish({ destination: destination, body: message })
    console.log("Sent to MQ")
  } else if (destinationType === "conductor") {
    // Extract the correlation ID
    const aho = parseAhoXml(message)
    if (isError(aho)) {
      throw aho
    }

    const correlationId = aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID

    // Check to see if there's already a workflow with that ID
    const workflow = await getWorkflowByCorrelationId(correlationId, conductorConfig)
    if (workflow && "workflowId" in workflow) {
      // COMPLETE the HUMAN task
      const workflowId = workflow.workflowId as string
      const task = await getWaitingTaskForWorkflow(workflowId, conductorConfig)
      if (!task) {
        throw new Error("Task not found")
      }

      await completeWaitingTask(workflowId, task.taskId, conductorConfig)
      console.log("Completed task in Conductor")
    } else {
      // Start a new workflow
      const s3TaskDataPath = `${randomUUID()}.json`
      const putResult = await putFileToS3(JSON.stringify(aho), s3TaskDataPath, taskDataBucket, s3Config)
      if (isError(putResult)) {
        throw putResult
      }

      await startWorkflow(Workflow.BICHARD_PROCESS, { s3TaskDataPath }, correlationId, conductorConfig)
    }
  }
}

export default forwardMessage
