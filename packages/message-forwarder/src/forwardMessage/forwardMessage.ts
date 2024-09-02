import type { ConductorClient } from "@io-orkes/conductor-javascript"
import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"
import parseAhoXml from "@moj-bichard7/core/lib/parse/parseAhoXml/parseAhoXml"
import parsePncUpdateDataSetXml from "@moj-bichard7/core/phase2/parse/parsePncUpdateDataSetXml/parsePncUpdateDataSetXml"
import type { Client } from "@stomp/stompjs"
import { sendToResubmissionQueue } from "./sendToResubmissionQueue/sendToResubmissionQueue"
import { startBichardProcess } from "./startBichardProcess/startBichardProcess"
import Phase from "@moj-bichard7/core/types/Phase"

enum DestinationType {
  MQ = "mq",
  AUTO = "auto",
  CONDUCTOR = "conductor"
}

const conductorWorkflows: Record<string, Phase> = {
  bichard_phase_1: Phase.HEARING_OUTCOME,
  bichard_phase_2: Phase.PNC_UPDATE
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

  const conductorWorkflow = process.env.CONDUCTOR_WORKFLOW ?? "bichard_phase_1"
  if (!Object.keys(conductorWorkflows).includes(conductorWorkflow)) {
    return new Error(`Unsupported Conductor workflow: "${conductorWorkflow}"`)
  }

  const phase = conductorWorkflows[conductorWorkflow]

  const ahoOrPncUpdateDataset =
    phase === Phase.HEARING_OUTCOME ? parseAhoXml(message) : parsePncUpdateDataSetXml(message)
  if (isError(ahoOrPncUpdateDataset)) {
    return ahoOrPncUpdateDataset
  }

  const correlationId = ahoOrPncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID

  if (destinationType === DestinationType.MQ) {
    return sendToResubmissionQueue(stompClient, message, correlationId, phase)
  }

  const workflows = await conductorClient.workflowResource
    .getWorkflows1(conductorWorkflow, correlationId, true, false)
    .catch((e) => e as Error)
  if (isError(workflows)) {
    return workflows
  }

  const workflowExists = workflows && workflows.length > 0
  if (destinationType === DestinationType.AUTO && !workflowExists) {
    return sendToResubmissionQueue(stompClient, message, correlationId, phase)
  }

  return startBichardProcess(conductorWorkflow, ahoOrPncUpdateDataset, correlationId, conductorClient)
}

export default forwardMessage
