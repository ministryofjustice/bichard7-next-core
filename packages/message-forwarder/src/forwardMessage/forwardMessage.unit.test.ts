import "../test/setup/setEnvironmentVariables"
process.env.DESTINATION_TYPE = "auto"

import { ConductorClient } from "@io-orkes/conductor-javascript"
import createConductorClient from "@moj-bichard7/common/conductor/createConductorClient"
import { isError } from "@moj-bichard7/common/types/Result"
import { Client } from "@stomp/stompjs"
import { randomUUID } from "crypto"
import fs from "fs"
import createStompClient from "../createStompClient"
import forwardMessage from "./forwardMessage"

const stompClient = createStompClient()
const conductorClient = createConductorClient()

describe("forwardMessage", () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it("throws an exception if aho is invalid", async () => {
    const result = await forwardMessage("<>", expect.any(Client), expect.any(ConductorClient))

    expect(isError(result)).toBeTruthy()
    expect(result).toHaveProperty("message", "Could not parse AHO XML")
  })

  it("throws an exception if getWorkflows1 returns an error", async () => {
    jest.spyOn(conductorClient.workflowResource, "getWorkflows1").mockRejectedValue(new Error("Mock error"))

    const incomingMessage = String(fs.readFileSync("src/test/fixtures/success-exceptions-aho-resubmitted.xml")).replace(
      "CORRELATION_ID",
      randomUUID()
    )

    const forwardMessageResult = await forwardMessage(incomingMessage, stompClient, conductorClient)
    expect(isError(forwardMessageResult)).toBeTruthy()
    expect(forwardMessageResult).toHaveProperty("message", "Mock error")
  })
})
