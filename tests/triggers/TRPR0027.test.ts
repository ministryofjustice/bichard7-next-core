jest.setTimeout(30000)

import { TriggerCode } from "../../src/types/TriggerCode"
import generateMessage from "../helpers/generateMessage"
import PostgresHelper from "../helpers/PostgresHelper"
import processMessage from "../helpers/processMessage"

const trigger5ResultCode = 4012

describe("TRPR0002", () => {
  afterAll(() => {
    PostgresHelper.closeConnection()
  })

  it("should generate a TRPR0027 trigger if the force and court don't match and a trigger would be ignored", async () => {
    // TRPR0005 is not allowed by force 02
    const inputMessage = generateMessage({
      PTIURN: "02ZD0303908",
      offences: [{ results: [{ code: trigger5ResultCode }] }]
    })

    // Process the mock message
    const { triggers } = await processMessage(inputMessage)

    // Check the right triggers are generated
    expect(triggers).toStrictEqual([{ code: TriggerCode.TRPR0027 }])
  })

  it("should not generate a TRPR0027 trigger if the force and court don't match but the original trigger is generated", async () => {
    // TRPR0005 is allowed by force 03
    const inputMessage = generateMessage({
      PTIURN: "03ZD0303908",
      offences: [{ results: [{ code: trigger5ResultCode }] }]
    })

    // Process the mock message
    const { triggers } = await processMessage(inputMessage)

    // Check the right triggers are generated
    expect(triggers).toStrictEqual([{ code: TriggerCode.TRPR0005 }])
  })
})
