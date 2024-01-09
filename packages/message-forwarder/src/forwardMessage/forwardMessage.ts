import { getWorkflowByCorrelationId } from "@moj-bichard7/common/conductor/conductorApi"
import createConductorConfig from "@moj-bichard7/common/conductor/createConductorConfig"
import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"
import parseAhoXml from "@moj-bichard7/core/phase1/parse/parseAhoXml/parseAhoXml"
import type { Client } from "@stomp/stompjs"
import { completeHumanTask } from "./completeHumanTask/completeHumanTask"
import { sendToResubmissionQueue } from "./sendToResubmissionQueue/sendToResubmissionQueue"
import { startBichardProcess } from "./startBichardProcess/startBichardProcess"

const conductorConfig = createConductorConfig()

enum DestinationType {
  MQ = "mq",
  AUTO = "auto",
  CONDUCTOR = "conductor"
}

const forwardMessage = async (message: string, client: Client): PromiseResult<void> => {
  const destinationType: DestinationType = (process.env.DESTINATION_TYPE ?? "auto") as DestinationType
  if (!Object.values(DestinationType).includes(destinationType)) {
    throw new Error(`Unsupported destination type: "${destinationType}"`)
  }

  const maybeAHO = parseAhoXml(message)
  if (isError(maybeAHO)) {
    throw maybeAHO
  }
  const correlationId = maybeAHO.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID

  if (destinationType === DestinationType.MQ) {
    return sendToResubmissionQueue(client, message, correlationId)
  }

  const maybeWorkflow = await getWorkflowByCorrelationId(correlationId, conductorConfig)
  if (isError(maybeWorkflow)) {
    throw maybeWorkflow
  }

  const workflowExists = maybeWorkflow && "workflowId" in maybeWorkflow
  if (destinationType === DestinationType.AUTO && !workflowExists) {
    return sendToResubmissionQueue(client, message, correlationId)
  }

  if (workflowExists) {
    return completeHumanTask(maybeWorkflow, correlationId, conductorConfig)
  }

  // this happens if a case was ingested originally by legacy phase 1
  // and is now being forced to resubmit to conductor.
  return startBichardProcess(maybeAHO, correlationId, conductorConfig)
}

export default forwardMessage
