import type { ConductorClient } from "@io-orkes/conductor-javascript"
import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"
import parseAhoXml from "@moj-bichard7/core/phase1/parse/parseAhoXml/parseAhoXml"
import type { Client } from "@stomp/stompjs"
import { sendToResubmissionQueue } from "./sendToResubmissionQueue/sendToResubmissionQueue"
import { startBichardProcess } from "./startBichardProcess/startBichardProcess"

enum DestinationType {
  MQ = "mq",
  AUTO = "auto",
  CONDUCTOR = "conductor"
}

const forwardMessage = async (
  message: string,
  stompClient: Client,
  conductorClient: ConductorClient
): PromiseResult<void> => {
  const destinationType: DestinationType = (process.env.DESTINATION_TYPE ?? "auto") as DestinationType
  if (!Object.values(DestinationType).includes(destinationType)) {
    return new Error(`Unsupported destination type: "${destinationType}"`)
  }

  const aho = parseAhoXml(message)
  if (isError(aho)) {
    return aho
  }
  const correlationId = aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID

  if (destinationType === DestinationType.MQ) {
    return sendToResubmissionQueue(stompClient, message, correlationId)
  }

  const workflows = await conductorClient.workflowResource
    .getWorkflows1("bichard_phase_1", correlationId, true, false)
    .catch((e) => e as Error)
  if (isError(workflows)) {
    return workflows
  }

  const workflowExists = workflows && workflows.length > 0
  if (destinationType === DestinationType.AUTO && !workflowExists) {
    return sendToResubmissionQueue(stompClient, message, correlationId)
  }

  // start a new phase 1 workflow
  return startBichardProcess("bichard_phase_1", aho, correlationId, conductorClient)
}

export default forwardMessage
