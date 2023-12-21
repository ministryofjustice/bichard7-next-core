import "./test/setup/setEnvironmentVariables"
process.env.DESTINATION_TYPE = "mq"
const sourceQueue = "TEST_SOURCE_QUEUE"
process.env.SOURCE_QUEUE = sourceQueue
const destinationQueue = "TEST_DESTINATION_QUEUE"
process.env.DESTINATION = destinationQueue

import createMqConfig from "@moj-bichard7/common/mq/createMqConfig"
import MqListener from "@moj-bichard7/common/test/mq/listener"
import fs from "fs"
import createStompClient from "./createStompClient"
import { server } from "./server"

const client = createStompClient()
const mqConfig = createMqConfig()

const resubmittedAho = fs.readFileSync("src/test/fixtures/success-exceptions-aho-resubmitted.xml").toString()

server()

describe("Server in MQ mode", () => {
  beforeAll(async () => {
    await new Promise((resolve) => {
      client.onConnect = resolve
      client.activate()
    })
  })

  afterAll(async () => {
    await client.deactivate()
  })

  it("sends the message to the destination queue", async () => {
    const mqListener = new MqListener(mqConfig)
    mqListener.listen(destinationQueue)
    await client.publish({ destination: sourceQueue, body: resubmittedAho })
    const message = await mqListener.waitForMessage()
    expect(message).toEqual(resubmittedAho)
    mqListener.stop()
  })

  it("puts the message on a failure queue if there is an exception", async () => {
    const mqListener = new MqListener(mqConfig)
    mqListener.listen(`${sourceQueue}.FAILURE`)
    await client.publish({ destination: sourceQueue, body: "BAD DATA" })
    const message = await mqListener.waitForMessage()
    expect(message).toBe("BAD DATA")
    mqListener.stop()
  })
})
