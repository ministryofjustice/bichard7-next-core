import differenceWith from "lodash.differencewith"
import isEqual from "lodash.isequal"
import CoreAuditLogger from "src/lib/CoreAuditLogger"
import parseSpiResult from "src/parse/parseSpiResult"
import transformSpiToAho from "src/parse/transformSpiToAho"
import stompit from "stompit"
import logger from "../src/lib/logging"
import CoreHandler from "../src/phase1"
import type Exception from "../src/types/Exception"
import type Phase1Result from "../src/types/Phase1Result"
import { Phase1ResultType } from "../src/types/Phase1Result"
import type { Trigger } from "../src/types/Trigger"
import MockPncGateway from "../tests/helpers/MockPncGateway"
import generateMockPncQueryResult from "../tests/helpers/generateMockPncQueryResult"

interface BichardResult {
  incomingMessage: string
  annotatedHearingOutcome: string
  triggers?: Trigger[]
  exceptions?: Exception[]
}

const CONNECTION_CONFIG = {
  host: process.env.MQ_HOST || "localhost",
  port: parseInt(process.env.MQ_PORT ?? "") || 61613,
  connectHeaders: {
    host: process.env.MQ_CONNECTION_HOST || "/",
    login: process.env.MQ_CONNECTION_LOGIN || "admin",
    passcode: process.env.MQ_CONNECTION_PASSCODE || "admin"
  }
}

const SUBSCRIPTION_CONFIG = {
  destination: process.env.MQ_QUEUE_NAME || "/queue/PROCESSING_VALIDATION_QUEUE",
  ack: "client-individual"
}

let needToPrintStats = true
const results = { passed: 0, failed: 0, skipped: 0, total: 0 }

const exitHandler = (client: stompit.Client): void => {
  if (needToPrintStats) {
    logger.info(results)
    needToPrintStats = false
  }

  client.disconnect()
  process.exit(results.failed || results.skipped ? 1 : 0)
}

const registerExitHandler = (client: stompit.Client): void => {
  process.on("exit", exitHandler.bind(null, client))
  process.on("SIGINT", exitHandler.bind(null, client))
  process.on("SIGUSR1", exitHandler.bind(null, client))
  process.on("SIGUSR2", exitHandler.bind(null, client))
}

const parseBichardResult = (message: string): BichardResult | undefined => {
  try {
    const bichardResult: BichardResult = JSON.parse(message)
    return bichardResult
  } catch (e) {
    results.failed++
    logger.warn(`Failed parsing message: ${e}`)
    return undefined
  }
}

const getTriggerOrExceptionCodes = (a: Trigger[] | Exception[]): string[] =>
  a.map((obj: Trigger | Exception) => obj.code)

const areTriggerOrExceptionArraysEqual = (
  received: Trigger[] | Exception[],
  expected: Trigger[] | Exception[]
): boolean => {
  const receivedCodes = getTriggerOrExceptionCodes(received)
  const expectedCodes = getTriggerOrExceptionCodes(expected)

  const extraReceived = differenceWith(receivedCodes, expectedCodes, isEqual)
  const extraExpected = differenceWith(expectedCodes, receivedCodes, isEqual)

  if (extraExpected.length > 0) {
    logger.warn(`Expected extra codes from Bichard: ${extraExpected}`)
  }
  if (extraReceived.length > 0) {
    logger.warn(`Received extra codes from Bichard: ${extraReceived}`)
  }
  return extraExpected.length === 0 && extraReceived.length === 0
}

const processResultCore = (incomingMessage: string): Promise<Phase1Result | undefined> => {
  try {
    const response = generateMockPncQueryResult(incomingMessage)
    const pncGateway = new MockPncGateway(response)
    const auditLogger = new CoreAuditLogger()
    const incomingSpi = parseSpiResult(incomingMessage)
    const incomingAho = transformSpiToAho(incomingSpi)
    return CoreHandler(incomingAho, pncGateway, auditLogger)
  } catch (e) {
    results.failed++
    logger.warn(`Application failed to process message: ${e}`)
    return Promise.resolve(undefined)
  }
}

const processMessage = async (message: string): Promise<void> => {
  const bichardResult = parseBichardResult(message)
  if (!bichardResult) {
    return
  }

  const coreResult = await processResultCore(bichardResult.incomingMessage)
  if (coreResult?.resultType !== Phase1ResultType.success) {
    return
  }

  if (
    areTriggerOrExceptionArraysEqual(coreResult.triggers, bichardResult.triggers || []) &&
    areTriggerOrExceptionArraysEqual(coreResult.hearingOutcome.Exceptions, bichardResult.exceptions || [])
  ) {
    results.passed++
    logger.info(`Result ${results.total} passed`)
  } else {
    results.failed++
    logger.warn(`Result ${results.total} failed`)
  }
}

const onMessage = (readError: Error | null, body?: string): void => {
  results.total++

  if (readError) {
    results.skipped++
    logger.warn(`Message read error: ${readError.message}`)
    return
  }

  if (body) {
    processMessage(body)
  } else {
    results.skipped++
    logger.warn("Message body empty, skipping")
  }
}

const compareResultsFromMQ = (): void => {
  stompit.connect(CONNECTION_CONFIG, (connectError: Error | null, client: stompit.Client) => {
    registerExitHandler(client)

    if (connectError) {
      logger.error(`MQ connection error: ${connectError.message}`)
      return
    }

    client.on("error", (e) => logger.error(`MQ client error: ${e}`))

    client.subscribe(SUBSCRIPTION_CONFIG, (subscribeError: Error | null, message: stompit.Client.Message) => {
      if (subscribeError) {
        logger.error(`MQ subscription error: ${subscribeError.message}`)
        return
      }

      message.readString("utf-8", (readError: Error | null, body?: string) => {
        onMessage(readError, body)
        client.ack(message)
      })
    })
  })
}

compareResultsFromMQ()
