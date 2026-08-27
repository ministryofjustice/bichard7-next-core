import type { WorkflowExecutor } from "@io-orkes/conductor-javascript"
import parsePncUpdateDataSetXml from "@moj-bichard7/common/aho/parse/parsePncUpdateDataSetXml/parsePncUpdateDataSetXml"
import parseAhoXml from "@moj-bichard7/common/aho/parseAhoXml/parseAhoXml"
import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"
import Phase from "@moj-bichard7/core/types/Phase"
import type { Client } from "@stomp/stompjs"
import type { Sql } from "postgres"
import fetchPoliceQuery from "./fetchPoliceQuery"
import { sendToResubmissionQueue } from "./sendToResubmissionQueue/sendToResubmissionQueue"
import { startBichardProcess } from "./startBichardProcess/startBichardProcess"

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
  workflowExecutor: WorkflowExecutor,
  database: Sql
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

  const workflows = await workflowExecutor
    .search(0, 10, `workflowType = '${conductorWorkflow}' AND correlationId = '${correlationId}'`, "*")
    .catch((e) => e as Error)
  if (isError(workflows)) {
    return workflows
  }

  const workflowExists = (workflows.results?.length ?? 0) > 0
  if (destinationType === DestinationType.AUTO && !workflowExists) {
    return sendToResubmissionQueue(stompClient, message, correlationId, phase)
  }

  const policeQuery = await fetchPoliceQuery(database, correlationId)
  if (isError(policeQuery)) {
    return policeQuery
  }

  if (policeQuery) {
    ahoOrPncUpdateDataset.PncQuery = policeQuery
  }

  return startBichardProcess(conductorWorkflow, ahoOrPncUpdateDataset, correlationId, workflowExecutor, phase)
}

export default forwardMessage
