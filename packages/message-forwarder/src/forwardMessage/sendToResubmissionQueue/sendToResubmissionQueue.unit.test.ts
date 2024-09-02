import "../../test/setup/setEnvironmentVariables"

import { type Client } from "@stomp/stompjs"
import { randomUUID } from "crypto"

import logger from "@moj-bichard7/common/utils/logger"

import { sendToResubmissionQueue } from "./sendToResubmissionQueue"

describe("sendToResubmissionQueue", () => {
  const stomp: { publish: jest.Func } = { publish: jest.fn() }

  afterEach(() => {
    jest.resetAllMocks()
  })

  it("publishes the message to the destination queue", () => {
    sendToResubmissionQueue(stomp as Client, "message", "correlationId")

    expect(stomp.publish).toHaveBeenLastCalledWith(
      expect.objectContaining({
        destination: "TEST_HEARING_OUTCOME_INPUT_QUEUE",
        body: "message"
      })
    )
  })

  it("logs event with correlationId", () => {
    jest.spyOn(logger, "info")

    const correlationId = randomUUID()
    sendToResubmissionQueue(stomp as Client, "", correlationId)

    expect(logger.info).toHaveBeenCalledWith({ event: "message-forwarder:sent-to-mq", correlationId })
  })
})
