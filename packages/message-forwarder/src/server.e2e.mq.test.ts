import "./test/setup/setEnvironmentVariables"
process.env.DESTINATION_TYPE = "mq"
const sourceQueue = "TEST_SOURCE_QUEUE"
process.env.SOURCE_QUEUE = sourceQueue
const destinationQueue = "TEST_DESTINATION_QUEUE"
process.env.DESTINATION = destinationQueue

import createConductorClient from "@moj-bichard7/common/conductor/createConductorClient"
import createMqConfig from "@moj-bichard7/common/mq/createMqConfig"
import MqListener from "@moj-bichard7/common/test/mq/listener"
import fs from "fs"
import MessageForwarder from "./MessageForwarder"
import createStompClient from "./createStompClient"

const stompClient = createStompClient()
const mqConfig = createMqConfig()
const conductorClient = createConductorClient()

const resubmittedAho = fs.readFileSync("src/test/fixtures/success-exceptions-aho-resubmitted.xml").toString()

describe("Server in MQ mode", () => {
  let messageForwarder: MessageForwarder

  beforeAll(async () => {
    messageForwarder = new MessageForwarder(stompClient, conductorClient)
    await messageForwarder.start()
  })

  afterAll(async () => {
    await messageForwarder.stop()
  })

  it("sends the message to the destination queue", async () => {
    const mqListener = new MqListener(mqConfig)
    mqListener.listen(destinationQueue)
    await stompClient.publish({ destination: sourceQueue, body: resubmittedAho })
    const message = await mqListener.waitForMessage()
    expect(message).toEqual(resubmittedAho)
    mqListener.stop()
  })

  it("puts the message on a failure queue if there is an exception", async () => {
    const mqListener = new MqListener(mqConfig)
    mqListener.listen(`${sourceQueue}.FAILURE`)
    await stompClient.publish({ destination: sourceQueue, body: "BAD DATA" })
    const message = await mqListener.waitForMessage()
    expect(message).toBe("BAD DATA")
    mqListener.stop()
  })
})
