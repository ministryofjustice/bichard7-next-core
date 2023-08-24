import promisePoller from "promise-poller"
import { v4 as uuid } from "uuid"
import CoreAuditLogger from "../../../lib/CoreAuditLogger"
import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"
import extractExceptionsFromAho from "../../parse/parseAhoXml/extractExceptionsFromAho"
import parseSpiResult from "../../parse/parseSpiResult"
import transformSpiToAho from "../../parse/transformSpiToAho"
import phase1Handler from "../../phase1"
import ActiveMqHelper from "../../tests/helpers/ActiveMqHelper"
import MockPncGateway from "../../tests/helpers/MockPncGateway"
import PostgresHelper from "../../tests/helpers/PostgresHelper"
import defaults from "../../tests/helpers/defaults"
import generateMockPncQueryResult from "../../tests/helpers/generateMockPncQueryResult"
import { mockEnquiryErrorInPnc, mockRecordInPnc } from "../../tests/helpers/mockRecordInPnc"
import type Phase1Result from "../../types/Phase1Result"
import { Phase1ResultType } from "../../types/Phase1Result"
import type { ResultedCaseMessageParsedXml } from "../../types/SpiResult"

const pgHelper = new PostgresHelper({
  host: defaults.postgresHost,
  port: defaults.postgresPort,
  database: "bichard",
  user: defaults.postgresUser,
  password: defaults.postgresPassword,
  ssl: false
})

const realPnc = process.env.REAL_PNC === "true"

const processMessageCore = (
  messageXml: string,
  {
    recordable = true,
    pncOverrides = {},
    pncCaseType = "court",
    pncMessage,
    pncAdjudication = false
  }: ProcessMessageOptions
): Promise<Phase1Result> => {
  const response = recordable
    ? generateMockPncQueryResult(pncMessage ? pncMessage : messageXml, pncOverrides, pncCaseType, pncAdjudication)
    : undefined
  const pncGateway = new MockPncGateway(response)
  const auditLogger = new CoreAuditLogger()
  const inputSpi = parseSpiResult(messageXml)
  const inputAho = transformSpiToAho(inputSpi)
  return phase1Handler(inputAho, pncGateway, auditLogger)
}

type ProcessMessageOptions = {
  expectRecord?: boolean
  expectTriggers?: boolean
  recordable?: boolean
  pncCaseType?: string
  pncOverrides?: Partial<ResultedCaseMessageParsedXml>
  pncMessage?: string
  pncAdjudication?: boolean
}

const processMessageBichard = async (
  messageXml: string,
  {
    expectRecord = true,
    expectTriggers = true,
    recordable = true,
    pncOverrides = {},
    pncCaseType = "court",
    pncMessage,
    pncAdjudication = false
  }: ProcessMessageOptions
): Promise<Phase1Result> => {
  const correlationId = uuid()
  const messageXmlWithUuid = messageXml.replace("EXTERNAL_CORRELATION_ID", correlationId)
  if (expectTriggers && !expectRecord) {
    throw new Error("You can't expect triggers without a record.")
  }

  if (!realPnc) {
    if (recordable) {
      // Insert matching record in PNC
      await mockRecordInPnc(pncMessage ? pncMessage : messageXml, pncOverrides, pncCaseType, pncAdjudication)
    } else {
      await mockEnquiryErrorInPnc()
    }
  }

  // Push the message to MQ
  const mq = new ActiveMqHelper({
    url: process.env.MQ_URL || defaults.mqUrl,
    login: process.env.MQ_USER || defaults.mqUser,
    password: process.env.MQ_PASSWORD || defaults.mqPassword
  })
  await mq.sendMessage("COURT_RESULT_INPUT_QUEUE", messageXmlWithUuid)

  // Wait for the record to appear in Postgres
  const recordQuery = `SELECT annotated_msg FROM br7own.error_list WHERE message_id = '${correlationId}'`

  const fetchRecords = () => (expectRecord ? pgHelper.pg.one(recordQuery) : pgHelper.pg.none(recordQuery))

  const recordResult = await promisePoller({
    taskFn: fetchRecords,
    interval: 20,
    retries: 1000
  })

  const exceptions = recordResult ? extractExceptionsFromAho(recordResult.annotated_msg) : []

  // Wait for the record to appear in Postgres
  const triggerQuery = `SELECT t.trigger_code, t.trigger_item_identity FROM br7own.error_list AS e
    INNER JOIN br7own.error_list_triggers AS t ON t.error_id = e.error_id
    WHERE message_id = '${correlationId}'
    ORDER BY t.trigger_item_identity ASC`

  if (!expectTriggers && !(expectRecord && recordResult)) {
    await new Promise((resolve) => setTimeout(resolve, 3_000))
  }

  const fetchTriggers = () => (expectTriggers ? pgHelper.pg.many(triggerQuery) : pgHelper.pg.none(triggerQuery))

  const triggerResult =
    (await promisePoller({
      taskFn: fetchTriggers,
      interval: 20,
      retries: 1000
    }).catch(() => [])) ?? []

  const triggers = triggerResult.map((record) => ({
    code: record.trigger_code,
    ...(record.trigger_item_identity ? { offenceSequenceNumber: parseInt(record.trigger_item_identity, 10) } : {})
  }))

  const hearingOutcome = { Exceptions: exceptions } as AnnotatedHearingOutcome

  return { correlationId, triggers, hearingOutcome, auditLogEvents: [], resultType: Phase1ResultType.success }
}

export default (messageXml: string, options: ProcessMessageOptions = {}): Promise<Phase1Result> => {
  if (process.env.USE_BICHARD === "true") {
    return processMessageBichard(messageXml, options)
  }

  return Promise.resolve(processMessageCore(messageXml, options))
}
