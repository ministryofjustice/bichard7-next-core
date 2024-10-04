import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import generateSpiMessage from "../helpers/generateSpiMessage"
import { processPhase1Message } from "../helpers/processMessage"

const trigger5ResultCode = 4012

describe.ifPhase1("TRPR0027", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it("should generate a TRPR0027 trigger if the force and court don't match and a trigger would be ignored", async () => {
    // TRPR0005 is not allowed by force 02
    const inputMessage = generateSpiMessage({
      PTIURN: "02ZD0303908",
      offences: [{ results: [{ code: trigger5ResultCode }] }]
    })

    const { triggers } = await processPhase1Message(inputMessage)

    expect(triggers).toStrictEqual([{ code: TriggerCode.TRPR0027 }])
  })

  it("should not generate a TRPR0027 trigger if the force and court don't match but the original trigger is generated", async () => {
    // TRPR0005 is allowed by force 03
    const inputMessage = generateSpiMessage({
      PTIURN: "03ZD0303908",
      offences: [{ results: [{ code: trigger5ResultCode }] }]
    })

    const { triggers } = await processPhase1Message(inputMessage)

    expect(triggers).toStrictEqual([{ code: TriggerCode.TRPR0005 }])
  })
})
