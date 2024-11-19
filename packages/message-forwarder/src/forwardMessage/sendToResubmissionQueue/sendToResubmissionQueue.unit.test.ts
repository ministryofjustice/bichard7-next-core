import "../../test/setup/setEnvironmentVariables"

import logger from "@moj-bichard7/common/utils/logger"
import Phase from "@moj-bichard7/core/types/Phase"
import { type Client } from "@stomp/stompjs"
import { randomUUID } from "crypto"

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
        body: "message",
        destination: "TEST_HEARING_OUTCOME_INPUT_QUEUE"
      })
    )
  })

  it("logs event with correlationId for Phase 1", () => {
    jest.spyOn(logger, "info")

    const correlationId = randomUUID()
    sendToResubmissionQueue(stomp as Client, "", correlationId, Phase.HEARING_OUTCOME)

    expect(logger.info).toHaveBeenCalledWith({ correlationId, event: "message-forwarder:sent-to-mq:phase-1" })
  })

  it("logs event with correlationId for Phase 2", () => {
    jest.spyOn(logger, "info")

    const correlationId = randomUUID()
    sendToResubmissionQueue(stomp as Client, "", correlationId, Phase.PNC_UPDATE)

    expect(logger.info).toHaveBeenCalledWith({ correlationId, event: "message-forwarder:sent-to-mq:phase-2" })
  })
})
