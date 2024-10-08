import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import generateSpiMessage from "../helpers/generateSpiMessage"
import { processPhase1Message } from "../helpers/processMessage"

const trigger1ResultCode = 3070
const trigger5ResultCode = 4012

describe.ifPhase1("Trigger force configuration", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it("should generate a trigger when only allowed by a force", async () => {
    // TRPR0005 is allowed force 01 but not by court B01DU
    const inputMessage = generateSpiMessage({
      offences: [{ results: [{ code: trigger5ResultCode }] }]
    })

    const { triggers } = await processPhase1Message(inputMessage)

    expect(triggers).toStrictEqual([{ code: TriggerCode.TRPR0005 }])
  })

  it("should generate a trigger when only allowed by a court", async () => {
    // TRPR0001 is allowed by the B01DU court but not by force 91
    const inputMessage = generateSpiMessage({
      PTIURN: "91EC0303908",
      courtHearingLocation: "B01DU00",
      offences: [{ results: [{ code: trigger1ResultCode }] }]
    })

    const { triggers } = await processPhase1Message(inputMessage)

    expect(triggers).toStrictEqual([{ code: TriggerCode.TRPR0001, offenceSequenceNumber: 1 }])
  })

  it("should generate a trigger when allowed by a force and a court", async () => {
    // TRPR0001 is allowed by both force 01 and court B01DU
    const inputMessage = generateSpiMessage({
      courtHearingLocation: "B01DU00",
      offences: [{ results: [{ code: trigger1ResultCode }] }]
    })

    const { triggers } = await processPhase1Message(inputMessage)

    expect(triggers).toStrictEqual([{ code: TriggerCode.TRPR0001, offenceSequenceNumber: 1 }])
  })

  it("should not generate a trigger when not allowed by a force and a court", async () => {
    // TRPR0005 is not allowed by either force 02 or court B01DU
    // Since the court and force don't match a TRPR0027 is generated since it is out of area
    const inputMessage = generateSpiMessage({
      PTIURN: "02ZD0303908",
      courtHearingLocation: "B01DU00",
      offences: [{ results: [{ code: trigger5ResultCode }] }]
    })

    const { triggers } = await processPhase1Message(inputMessage)

    expect(triggers).toStrictEqual([{ code: TriggerCode.TRPR0027 }])
  })
})
