import { getWorkflowsByCorrelationId } from "@moj-bichard7/common/conductor/conductorApi"
import createConductorConfig from "@moj-bichard7/common/conductor/createConductorConfig"
import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"
import parseAhoXml from "@moj-bichard7/core/phase1/parse/parseAhoXml/parseAhoXml"
import type { Client } from "@stomp/stompjs"
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

  const maybeWorkflows = await getWorkflowsByCorrelationId("bichard_phase_1", correlationId, conductorConfig)
  if (isError(maybeWorkflows)) {
    throw maybeWorkflows
  }

  const workflowExists = maybeWorkflows && maybeWorkflows.length > 0
  if (destinationType === DestinationType.AUTO && !workflowExists) {
    return sendToResubmissionQueue(client, message, correlationId)
  }

  // start a new phase 1 workflow
  return startBichardProcess("bichard_phase_1", maybeAHO, correlationId, conductorConfig)
}

export default forwardMessage
