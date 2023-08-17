import type MqConfig from "common/mq/MqConfig"
import MqGateway from "common/mq/MqGateway"
import TestMqGateway from "common/mq/TestMqGateway"
import { isError } from "core/phase1/comparison/types"

jest.setTimeout(30000)

const queueName = "mq-gateway-integration-testing"
const config: MqConfig = {
  url: "failover:(stomp://localhost:61613)",
  username: "admin",
  password: "admin"
}

const gateway = new MqGateway(config)
const testGateway = new TestMqGateway(config)

describe("MqGateway", () => {
  afterAll(async () => {
    await gateway.dispose()
    await testGateway.dispose()
  })

  it("should create the queue and send the message", async () => {
    const expectedMessage = '<?xml version="1.0" ?><root><element>value</element></root>'

    const result = await gateway.sendMessage(expectedMessage, queueName)

    expect(isError(result)).toBeFalsy()

    const actualMessage = await testGateway.getMessage(queueName)
    expect(actualMessage).toBeDefined()
    expect(isError(actualMessage)).toBeFalsy()
    expect(actualMessage).toBe(expectedMessage)
  })
})
