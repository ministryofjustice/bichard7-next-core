import { getWorkflowByCorrelationId } from "@moj-bichard7/common/conductor/conductorApi"
import createConductorConfig from "@moj-bichard7/common/conductor/createConductorConfig"
import parseAhoXml from "@moj-bichard7/core/phase1/parse/parseAhoXml/parseAhoXml"
import type { Client } from "@stomp/stompjs"
import { isError, type PromiseResult } from "../Result"
import { completeHumanTask } from "./completeHumanTask"
import { sendToResubmissionQueue } from "./sendToResubmissionQueue"
import { startBichardProcess } from "./startBichardProcess"

const conductorConfig = createConductorConfig()

const destinationType = process.env.DESTINATION_TYPE ?? "auto"

const forwardMessage = async (message: string, client: Client): PromiseResult<void> => {
  const aho = parseAhoXml(message)
  if (isError(aho)) {
    throw aho
  }
  const correlationId = aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID

  const maybeWorkflow = await getWorkflowByCorrelationId(correlationId, conductorConfig)
  if (isError(maybeWorkflow)) {
    throw maybeWorkflow
  }
  const workflowExists = maybeWorkflow && "workflowId" in maybeWorkflow

  if (destinationType === "mq" || (destinationType === "auto" && !workflowExists)) {
    return sendToResubmissionQueue(client, message, correlationId)
  }

  if (workflowExists) {
    return completeHumanTask(maybeWorkflow, correlationId, conductorConfig)
  }

  return startBichardProcess(aho, correlationId, conductorConfig)
}

export default forwardMessage
