import stompit from "stompit"
import generateMockPncQueryResult from "../tests/helpers/generateMockPncQueryResult"
import MockPncGateway from "../tests/helpers/MockPncGateway"
import CoreHandler from "../src/index"
import type { Trigger } from "../src/types/Trigger"
import type Exception from "../src/types/Exception"
import differenceWith from "lodash.differencewith"
import isEqual from "lodash.isEqual"

interface BichardResult {
  incomingMessage: string
  annotatedHearingOutcome: string
  triggers?: Trigger[]
  exceptions?: Exception[]
}

//TODO: Use envvars for these and sensible defaults
const connectOptions = {
  host: "localhost",
  port: 61613,
  connectHeaders: {
    host: "/",
    login: "admin",
    passcode: "admin",
    "heart-beat": "0,0"
  }
}

let needToPrintStats = true
const results = { passed: 0, failed: 0, total: 0 }

const exitHandler = (client: stompit.Client) => {
  if (needToPrintStats) {
    console.log(results)
    needToPrintStats = false
  }

  client.disconnect()
  process.exit()
}

const getCodes = (a: Trigger[] | Exception[]): string[] => a.map((obj: Trigger | Exception) => obj.code)

const areArraysEqual = (received: Trigger[] | Exception[], expected: Trigger[] | Exception[]): boolean => {
  const receivedCodes = getCodes(received)
  const expectedCodes = getCodes(expected)

  const extraReceived = differenceWith(receivedCodes, expectedCodes, isEqual)
  const extraExpected = differenceWith(expectedCodes, receivedCodes, isEqual)

  if (extraExpected.length > 0) {
    console.log("Expected extra codes from Bichard:")
    console.log(extraExpected)
  }
  if (extraReceived.length > 0) {
    console.log("Received extra codes from Bichard:")
    console.log(extraReceived)
  }
  return extraExpected.length === 0 && extraReceived.length === 0
}

const handleMessage = (message: string): void => {
  const bichardResult: BichardResult = JSON.parse(message)

  // This is hardcoded for now. This value is determined by comparing the disposalCode against the stopList in the standing data
  const recordable = true

  const response = generateMockPncQueryResult(bichardResult.incomingMessage)
  const pncGateway = new MockPncGateway(response)
  const { triggers, exceptions } = CoreHandler(bichardResult.incomingMessage, recordable, pncGateway)

  results.total++

  const expectedTriggers = bichardResult.triggers || []
  const expectedExceptions = bichardResult.exceptions || []

  if (areArraysEqual(triggers, expectedTriggers) && areArraysEqual(exceptions, expectedExceptions)) {
    results.passed++
    console.log("Result passed")
  } else {
    results.failed++
    console.log("Result failed")
  }
}

stompit.connect(connectOptions, (connectError: Error | null, client: stompit.Client) => {
  process.on("exit", exitHandler.bind(null, client))
  process.on("SIGINT", exitHandler.bind(null, client))
  process.on("SIGUSR1", exitHandler.bind(null, client))
  process.on("SIGUSR2", exitHandler.bind(null, client))

  if (connectError) {
    console.log("connect error " + connectError.message)
    return
  }

  client.on("error", function (error) {
    console.error(error)
  })

  const subscribeHeaders = {
    destination: "/queue/PROCESSING_VALIDATION_QUEUE",
    ack: "client-individual"
  }

  client.subscribe(subscribeHeaders, (subscribeError: Error | null, message: stompit.Client.Message) => {
    if (subscribeError) {
      console.log("subscribe error " + subscribeError.message)
      return
    }

    message.readString("utf-8", (readError: Error | null, body?: string) => {
      if (readError) {
        console.log("read message error " + readError.message)
        return
      }

      if (body) {
        try {
          handleMessage(body)
        } catch (e) {
          console.error("handleMessage err " + e)
        }
      } else {
        console.log("no message body, skipping")
      }

      client.ack(message)
    })
  })
})
