jest.setTimeout(30000)

import { TriggerCode } from "../../src/types/TriggerCode"
import generateMessage from "../helpers/generateMessage"
import PostgresHelper from "../helpers/PostgresHelper"
import processMessage from "../helpers/processMessage"

const trigger1ResultCode = 3070
const trigger5ResultCode = 4012

describe("Trigger force configuration", () => {
  afterAll(() => {
    PostgresHelper.closeConnection()
  })

  it("should generate trigger when only allowed by a force", async () => {
    // TRPR0005 is allowed force 01 but not by court B01DU
    const inputMessage = generateMessage({
      offences: [{ results: [{ code: trigger5ResultCode }] }]
    })

    // Process the mock message
    const { triggers } = await processMessage(inputMessage)

    // Check the right triggers are generated
    expect(triggers).toStrictEqual([{ code: TriggerCode.TRPR0005 }])
  })

  it("should generate trigger when only allowed by a court", async () => {
    // TRPR0001 is allowed by the B01DU court but not by force 91
    const inputMessage = generateMessage({
      PTIURN: "91EC0303908",
      courtHearingLocation: "B01DU00",
      offences: [{ results: [{ code: trigger1ResultCode }] }]
    })

    // Process the mock message
    const { triggers } = await processMessage(inputMessage)

    // Check the right triggers are generated
    expect(triggers).toStrictEqual([{ code: TriggerCode.TRPR0001, offenceSequenceNumber: 1 }])
  })

  it("should generate trigger when allowed by a force and a court", async () => {
    // TRPR0001 is allowed by both force 01 and court B01DU
    const inputMessage = generateMessage({
      courtHearingLocation: "B01DU00",
      offences: [{ results: [{ code: trigger1ResultCode }] }]
    })

    // Process the mock message
    const { triggers } = await processMessage(inputMessage)

    // Check the right triggers are generated
    expect(triggers).toStrictEqual([{ code: TriggerCode.TRPR0001, offenceSequenceNumber: 1 }])
  })

  it("should not generate trigger when not allowed by a force or a court", async () => {
    // TRPR0005 is not allowed by either force 02 or court B01DU
    // Since the court and force don't match a TRPR0027 is generated since it is out of area
    const inputMessage = generateMessage({
      PTIURN: "02ZD0303908",
      courtHearingLocation: "B01DU00",
      offences: [{ results: [{ code: trigger5ResultCode }] }]
    })

    // Process the mock message
    const { triggers } = await processMessage(inputMessage)

    // Check the right triggers are generated
    expect(triggers).toStrictEqual([{ code: TriggerCode.TRPR0027 }])
  })
})
