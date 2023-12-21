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

  it("calls client.publish", () => {
    sendToResubmissionQueue(stomp as Client, "", "")

    expect(stomp.publish).toHaveBeenCalled()
  })

  it("calls logger.info with the correlationId parameter", () => {
    jest.spyOn(logger, "info")

    const correlationId = randomUUID()
    sendToResubmissionQueue(stomp as Client, "", correlationId)

    expect(logger.info).toHaveBeenCalledWith({ event: "message-forwarder:sent-to-mq", correlationId })
  })
})
