import type BichardResultType from "../../src/types/BichardResultType"
import CoreHandler from "../../src"
// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuid } from "uuid"
import ActiveMqHelper from "./ActiveMqHelper"
import defaults from "./defaults"
import { mockRecordInPnc, mockEnquiryErrorInPnc } from "./mockRecordInPnc"
import PostgresHelper from "./PostgresHelper"
// eslint-disable-next-line import/no-extraneous-dependencies
import promisePoller from "promise-poller"

const pgHelper = new PostgresHelper({
  host: defaults.postgresHost,
  port: defaults.postgresPort,
  database: "bichard",
  user: defaults.postgresUser,
  password: defaults.postgresPassword,
  ssl: false
})

const processMessageCore = (messageXml: string): BichardResultType => {
  return CoreHandler(messageXml)
}

const processMessageBichard = async (messageXml: string, recordable: boolean): Promise<BichardResultType> => {
  const correlationId = uuid()
  const messageXmlWithUuid = messageXml.replace("EXTERNAL_CORRELATION_ID", correlationId)
  if (recordable) {
    // Insert matching record in PNC
    await mockRecordInPnc(messageXml)
  } else {
    await mockEnquiryErrorInPnc()
  }

  // Push the message to MQ
  const mq = new ActiveMqHelper({
    url: process.env.MQ_URL || defaults.mqUrl,
    login: process.env.MQ_USER || defaults.mqUser,
    password: process.env.MQ_PASSWORD || defaults.mqPassword
  })
  await mq.sendMessage("COURT_RESULT_INPUT_QUEUE", messageXmlWithUuid)

  // Wait for the record to appear in Postgres
  const query = `SELECT t.trigger_code, t.trigger_item_identity FROM br7own.error_list AS e
    INNER JOIN br7own.error_list_triggers AS t ON t.error_id = e.error_id
    WHERE message_id = '${correlationId}'
    ORDER BY t.trigger_item_identity ASC`

  const fetchRecord = () => pgHelper.pg.many(query)

  const queryResult = await promisePoller({
    taskFn: fetchRecord,
    interval: 100,
    retries: 200
  })

  // Return record data
  const triggers = queryResult.map((record) => ({
    code: record.trigger_code,
    offenceSequenceNumber: parseInt(record.trigger_item_identity, 10)
  }))

  return { triggers, exceptions: [] }
}

export default (messageXml: string, recordable = true): Promise<BichardResultType> => {
  if (process.env.USE_BICHARD === "true") {
    return processMessageBichard(messageXml, recordable)
  }

  return Promise.resolve(processMessageCore(messageXml))
}
