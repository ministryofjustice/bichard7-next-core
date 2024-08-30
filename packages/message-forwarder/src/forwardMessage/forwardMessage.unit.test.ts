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

const incomingMessage = String(fs.readFileSync("src/test/fixtures/success-exceptions-aho-resubmitted.xml")).replace(
  "CORRELATION_ID",
  randomUUID()
)

describe("forwardMessage", () => {
  beforeEach(() => {
    jest.resetModules()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it("returns an error if AHO is invalid", async () => {
    process.env.CONDUCTOR_WORKFLOW = "bichard_phase_1"

    const result = await forwardMessage("<>", expect.any(Client), expect.any(ConductorClient))

    expect(isError(result)).toBeTruthy()
    expect(result).toHaveProperty("message", "Could not parse AHO XML")
  })

  it("returns an error if PncUpdateDataset is invalid", async () => {
    process.env.CONDUCTOR_WORKFLOW = "bichard_phase_2"

    const result = await forwardMessage("<>", expect.any(Client), expect.any(ConductorClient))

    expect(isError(result)).toBeTruthy()
    expect(result).toHaveProperty("message", "Could not parse PNC update dataset XML")
  })

  it("returns an error if invalid Conductor workflow provided", async () => {
    process.env.CONDUCTOR_WORKFLOW = "invalid_conductor_workflow"

    const result = await forwardMessage(incomingMessage, stompClient, conductorClient)

    expect(isError(result)).toBeTruthy()
    expect(result).toHaveProperty("message", 'Unsupported Conductor workflow: "invalid_conductor_workflow"')
  })

  it("returns an error if getWorkflows1 returns an error", async () => {
    process.env.CONDUCTOR_WORKFLOW = "bichard_phase_1"

    jest.spyOn(conductorClient.workflowResource, "getWorkflows1").mockRejectedValue(new Error("Mock error"))

    const result = await forwardMessage(incomingMessage, stompClient, conductorClient)

    expect(isError(result)).toBeTruthy()
    expect(result).toHaveProperty("message", "Mock error")
  })
})
