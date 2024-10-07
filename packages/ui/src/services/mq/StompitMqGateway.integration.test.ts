import MqConfig from "./types/MqConfig"
import StompitMqGateway from "./StompitMqGateway"
import TestStompitMqGateway from "./TestStompitMqGateway"
jest.retryTimes(10)

jest.setTimeout(30000)

const queueName = "mq-gateway-integration-testing"
const config: MqConfig = {
  url: "failover:(stomp://localhost:61613)",
  username: "admin",
  password: "admin"
}

const gateway = new StompitMqGateway(config)
const testGateway = new TestStompitMqGateway(config)

describe("StompitMqGateway", () => {
  afterAll(async () => {
    await gateway.dispose()
    await testGateway.dispose()
  })

  it("Should create the queue and send the message", async () => {
    const expectedMessage = '<?xml version="1.0" ?><root><element>value</element></root>'

    const result = await gateway.execute(expectedMessage, queueName)

    expect(result).not.toBeInstanceOf(Error)

    const actualMessage = await testGateway.getMessage(queueName)
    expect(actualMessage).toBeDefined()
    expect(actualMessage).not.toBeInstanceOf(Error)
    expect(actualMessage).toBe(expectedMessage)
  })
})
