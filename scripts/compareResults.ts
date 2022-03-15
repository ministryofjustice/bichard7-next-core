import stompit from "stompit"
import generateMockPncQueryResult from "../tests/helpers/generateMockPncQueryResult"
import MockPncGateway from "../tests/helpers/MockPncGateway"
import CoreHandler from "../src/index"
import type { Trigger } from "../src/types/Trigger"
import type Exception from "../src/types/Exception"
import differenceWith from "lodash.differencewith"
import isEqual from "lodash.isEqual"
import Pino from "pino"
import type BichardResultType from "../src/types/BichardResultType"

interface BichardResult {
  incomingMessage: string
  annotatedHearingOutcome: string
  triggers?: Trigger[]
  exceptions?: Exception[]
}

const logger: Pino.Logger = Pino({
  level: process.env.PINO_LOG_LEVEL || "info",
  timestamp: false,
  messageKey: "message"
})

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

const exitHandler = (client: stompit.Client) => {
  if (needToPrintStats) {
    logger.info(results)
    needToPrintStats = false
  }

  client.disconnect()
  process.exit(results.failed ? 1 : 0)
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
    logger.info(`Expected extra codes from Bichard: ${extraExpected}`)
  }
  if (extraReceived.length > 0) {
    logger.info(`Received extra codes from Bichard: ${extraReceived}`)
  }
  return extraExpected.length === 0 && extraReceived.length === 0
}

const processResultCore = (incomingMessage: string): BichardResultType => {
  // This is hardcoded for now. This value is determined by comparing the disposalCode against the stopList in the standing data
  const recordable = true

  //TODO: Put a try/catch around this logic incase the app throws errors
  const response = generateMockPncQueryResult(incomingMessage)
  const pncGateway = new MockPncGateway(response)
  return CoreHandler(incomingMessage, recordable, pncGateway)
}

const processMessage = (message: string): void => {
  const bichardResult = parseBichardResult(message)
  if (!bichardResult) {
    return
  }

  const { triggers, exceptions } = processResultCore(bichardResult.incomingMessage)

  if (
    areTriggerOrExceptionArraysEqual(triggers, bichardResult.triggers || []) &&
    areTriggerOrExceptionArraysEqual(exceptions, bichardResult.exceptions || [])
  ) {
    results.passed++
    logger.info(`Result ${results.total} passed`)
  } else {
    results.failed++
    logger.warn(`Result ${results.total} failed`)
  }
}

const handleMessage = (readError: Error | null, body?: string): void => {
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
        handleMessage(readError, body)
        client.ack(message)
      })
    })
  })
}

compareResultsFromMQ()
