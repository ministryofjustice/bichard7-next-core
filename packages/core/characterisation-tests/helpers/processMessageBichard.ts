import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import ActiveMqHelper from "@moj-bichard7/common/mq/ActiveMqHelper"
import type TriggerCode from "bichard7-next-data-latest/types/TriggerCode"
import promisePoller from "promise-poller"
import { v4 as uuid } from "uuid"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type AnnotatedPncUpdateDataset from "../../types/AnnotatedPncUpdateDataset"
import Phase from "../../types/Phase"
import type { Trigger } from "../../types/Trigger"
import extractExceptionsFromAho from "./extractExceptionsFromAho"
import { mockEnquiryErrorInPnc, mockRecordInPnc } from "./mockRecordInPnc"
import type { ProcessMessageOptions } from "./processMessage"

type TriggerEntity = { trigger_code: TriggerCode; trigger_item_identity?: string }

const pg = new PostgresHelper().db
const mq = new ActiveMqHelper({
  url: process.env.MQ_URL || "failover:(stomp://localhost:61613)",
  login: process.env.MQ_USER || "bichard",
  password: process.env.MQ_PASSWORD || "password"
})
const realPnc = process.env.REAL_PNC === "true"

const processMessageBichard = async <BichardResultType>(
  messageXml: string,
  {
    expectRecord = true,
    recordable = true,
    pncOverrides = {},
    pncCaseType = "court",
    pncMessage,
    pncAdjudication = false,
    phase = Phase.HEARING_OUTCOME
  }: ProcessMessageOptions
): Promise<BichardResultType> => {
  const correlationId = uuid()
  const messageXmlWithUuid = messageXml.replace("EXTERNAL_CORRELATION_ID", correlationId)

  if (phase === Phase.HEARING_OUTCOME && !realPnc) {
    if (recordable) {
      // Insert matching record in PNC
      await mockRecordInPnc(pncMessage ? pncMessage : messageXml, pncOverrides, pncCaseType, pncAdjudication)
    } else {
      await mockEnquiryErrorInPnc()
    }
  }

  // Push the message to MQ
  const queue =
    phase === Phase.HEARING_OUTCOME
      ? "COURT_RESULT_INPUT_QUEUE"
      : messageXml.includes("PNCUpdateDataset")
        ? "DATA_SET_PNC_UPDATE_QUEUE"
        : "HEARING_OUTCOME_PNC_UPDATE_QUEUE"
  await mq.sendMessage(queue, messageXmlWithUuid)

  // Wait for the record to appear in Postgres
  const recordQuery = `SELECT annotated_msg FROM br7own.error_list WHERE message_id = '${correlationId}'`

  const fetchRecords = () => (expectRecord ? pg.one(recordQuery) : pg.none(recordQuery))

  const recordResult = await promisePoller({
    taskFn: fetchRecords,
    interval: 20,
    retries: 1000
  }).catch((e: Error) => e)

  if (recordResult && !("annotated_msg" in recordResult)) {
    throw new Error("No Error records found in DB")
  }

  const exceptions = recordResult
    ? phase === Phase.HEARING_OUTCOME
      ? extractExceptionsFromAho<AnnotatedHearingOutcome>(recordResult.annotated_msg)
      : extractExceptionsFromAho<AnnotatedPncUpdateDataset>(recordResult.annotated_msg)
    : []

  let triggers: Trigger[] = []
  if (expectRecord) {
    // Wait for the record to appear in Postgres
    const triggerQuery = `SELECT t.trigger_code, t.trigger_item_identity FROM br7own.error_list AS e
    INNER JOIN br7own.error_list_triggers AS t ON t.error_id = e.error_id
    WHERE message_id = '${correlationId}'
    ORDER BY t.trigger_item_identity ASC`

    if (!(expectRecord && recordResult)) {
      await new Promise((resolve) => setTimeout(resolve, 3_000))
    }

    const fetchTriggers = () => pg.manyOrNone(triggerQuery)

    const triggerResult =
      (await promisePoller<TriggerEntity[]>({
        taskFn: fetchTriggers,
        interval: 20,
        retries: 1000
      }).catch(() => [])) ?? []

    triggers = triggerResult.map((record) => ({
      code: record.trigger_code,
      ...(record.trigger_item_identity ? { offenceSequenceNumber: parseInt(record.trigger_item_identity, 10) } : {})
    }))
  }

  if (phase === Phase.HEARING_OUTCOME) {
    return { triggers, hearingOutcome: { Exceptions: exceptions } as AnnotatedHearingOutcome } as BichardResultType
  }

  return { triggers, outputMessage: { Exceptions: exceptions } as AnnotatedHearingOutcome } as BichardResultType
}

export default processMessageBichard
