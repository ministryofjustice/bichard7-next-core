import "../test/setup/setEnvironmentVariables"
process.env.DESTINATION_TYPE = "auto"

import { Client } from "@stomp/stompjs"
import { randomUUID } from "crypto"
import fs from "fs"

import * as conductor from "@moj-bichard7/common/conductor/conductorApi"

import createStompClient from "../createStompClient"
import forwardMessage from "./forwardMessage"

const stomp = createStompClient()

describe("forwardMessage", () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it("throws an exception if aho is invalid", async () => {
    await expect(forwardMessage("<>", expect.any(Client))).rejects.toThrow("Could not parse AHO XML")
  })

  it("throws an exception if getWorkflowByCorrelationId returns an error", async () => {
    jest.spyOn(conductor, "getWorkflowByCorrelationId").mockReturnValue(Promise.resolve(new Error("Mock error")))

    const incomingMessage = String(fs.readFileSync("src/test/fixtures/success-exceptions-aho-resubmitted.xml")).replace(
      "CORRELATION_ID",
      randomUUID()
    )

    await expect(forwardMessage(incomingMessage, stomp)).rejects.toThrow("Mock error")
  })
})
