import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import putFileToS3 from "@moj-bichard7/common/s3/putFileToS3"
import logger from "@moj-bichard7/common/utils/logger"
import Workflow from "@moj-bichard7/conductor/src/workflow"
import parseAhoXml from "@moj-bichard7/core/phase1/parse/parseAhoXml/parseAhoXml"
import type { Client } from "@stomp/stompjs"
import { randomUUID } from "crypto"
import { isError, type PromiseResult } from "./Result"
import {
  completeWaitingTask,
  getWaitingTaskForWorkflow,
  getWorkflowByCorrelationId,
  startWorkflow
} from "./conductor-api"
import createConductorConfig from "./createConductorConfig"

const s3Config = createS3Config()
const conductorConfig = createConductorConfig()

const destinationType = process.env.DESTINATION_TYPE ?? "auto"
const destination = process.env.DESTINATION ?? "HEARING_OUTCOME_INPUT_QUEUE"

const taskDataBucket = process.env.TASK_DATA_BUCKET_NAME
if (!taskDataBucket) {
  throw Error("TASK_DATA_BUCKET_NAME environment variable is required")
}

const forwardMessage = async (message: string, client: Client): PromiseResult<void> => {
  // Extract the correlation ID
  const aho = parseAhoXml(message)
  if (isError(aho)) {
    throw aho
  }
  const correlationId = aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID
  const workflow = await getWorkflowByCorrelationId(correlationId, conductorConfig)
  const workflowExists = workflow && "workflowId" in workflow

  if (destinationType === "mq" || (destinationType === "auto" && !workflowExists)) {
    client.publish({ destination: destination, body: message, skipContentLengthHeader: true })
    logger.info(`Sent message to MQ (${correlationId})`)
  } else {
    // Check to see if there's already a workflow with that ID
    if (workflowExists) {
      // COMPLETE the HUMAN task
      const workflowId = workflow.workflowId as string
      const task = await getWaitingTaskForWorkflow(workflowId, conductorConfig)
      if (!task) {
        throw new Error("Task not found")
      }

      await completeWaitingTask(workflowId, task.taskId, conductorConfig)
      logger.info(`Completed task in Conductor (${correlationId})`)
    } else {
      // Start a new workflow
      const s3TaskDataPath = `${randomUUID()}.json`
      const putResult = await putFileToS3(JSON.stringify(aho), s3TaskDataPath, taskDataBucket, s3Config)
      if (isError(putResult)) {
        throw putResult
      }

      await startWorkflow(Workflow.BICHARD_PROCESS, { s3TaskDataPath }, correlationId, conductorConfig)
      logger.info(`Started new workflow in Conductor (${correlationId})`)
    }
  }
}

export default forwardMessage
