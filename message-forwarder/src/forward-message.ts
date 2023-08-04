import { parseAhoXml } from "@moj-bichard7-developers/bichard7-next-core/dist/parse/parseAhoXml"
import type { Client } from "@stomp/stompjs"
import { completeWaitingTask, getWaitingTaskForWorkflow, getWorkflowByCorrelationId } from "./conductor-api"
import createConductorConfig from "./createConductorConfig"
import { isError, type PromiseResult } from "./Result"

const conductorConfig = createConductorConfig()

const destinationType = process.env.DESTINATION_TYPE ?? "mq"
const destination = process.env.DESTINATION ?? "HEARING_OUTCOME_INPUT_QUEUE"

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
      const taskId = task.taskId
      await completeWaitingTask(workflowId, taskId, conductorConfig)
      console.log("Completed task in Conductor")
    } else {
      // Start a new workflow with this aho as input
    }
  }
}

export default forwardMessage
