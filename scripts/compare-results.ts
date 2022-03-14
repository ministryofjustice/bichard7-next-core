import stompit from "stompit"
import generateMockPncQueryResult from "../tests/helpers/generateMockPncQueryResult"
import MockPncGateway from "../tests/helpers/MockPncGateway"
import CoreHandler from "../src/index"

interface BichardResult {
  incomingMessage: string
  annotatedHearingOutcome: string
  triggers?: object[]
  exceptions?: object[]
}

const connectOptions = {
  host: "localhost",
  port: 61613,
  connectHeaders: {
    host: "/",
    login: "admin",
    passcode: "admin",
    "heart-beat": "5000,5000"
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

const handleMessage = (message: string): void => {
  const bichardResult: BichardResult = JSON.parse(message)

  //TODO: Implement
  const recordable = true

  const response = generateMockPncQueryResult(bichardResult.incomingMessage)
  const pncGateway = new MockPncGateway(response)
  const { triggers, exceptions } = CoreHandler(bichardResult.incomingMessage, recordable, pncGateway)

  results.total++

  const expectedTriggers = bichardResult.triggers || []
  const expectedExceptions = bichardResult.exceptions || []

  if (triggers.length !== expectedTriggers.length || exceptions.length !== expectedExceptions.length) {
    results.failed++
    return
  } else {
    //TODO: Check all triggers/exceptions are present

    results.passed++
  }
}

stompit.connect(connectOptions, (connectError: Error | null, client: stompit.Client) => {
  process.on("exit", exitHandler.bind(null, client))
  process.on("SIGINT", exitHandler.bind(null, client))
  process.on("SIGUSR1", exitHandler.bind(null, client))
  process.on("SIGUSR2", exitHandler.bind(null, client))
  process.on("uncaughtException", exitHandler.bind(null, client))

  if (connectError) {
    console.log("connect error " + connectError.message)
    return
  }

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
        console.log("new message " + body)
        try {
          handleMessage(body)
        } catch (e) {
          console.error("handleMessage err " + e)
        }
      }

      console.log("before ack " + message)

      client.ack(message)
    })
  })
})
