jest.setTimeout(30000)

import isOffenceIgnored from "src/use-cases/isOffenceIgnored"
import getAreaCode from "src/utils/offence/getAreaCode"
import generateMessage from "tests/helpers/generateMessage"
import PostgresHelper from "tests/helpers/PostgresHelper"
import processMessage from "tests/helpers/processMessage"

jest.mock("src/use-cases/isOffenceIgnored", () => ({
  ...jest.requireActual("src/use-cases/isOffenceIgnored"),
  __esModule: true,
  default: jest.fn().mockReturnValue(false)
}))

jest.mock("src/utils/offence/getAreaCode", () => ({
  ...jest.requireActual("src/utils/offence/getAreaCode"),
  __esModule: true,
  default: jest.fn().mockReturnValue("01")
}))

describe("HO100306", () => {
  afterAll(() => {
    PostgresHelper.closeConnection()
  })

  it("should not create an exception for a valid offence code", async () => {
    const inputMessage = generateMessage({
      offences: [{ code: "MC80524", results: [{ code: 4584 }] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processMessage(inputMessage, {
      expectTriggers: false
    })

    expect(exceptions).toHaveLength(0)
  })

  it("should create an exception if the offence code lookup fails and offence is not ignored", async () => {
    ;(getAreaCode as jest.MockedFunction<typeof getAreaCode>).mockReturnValue("01")
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [{ results: [{ code: 1015 }], code: "BLAHHHHH" }]
    })

    // Process the mock message
    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processMessage(inputMessage, {
      expectTriggers: false
    })

    // Check the right exceptions are generated
    expect(exceptions).toStrictEqual([
      {
        code: "HO100306",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          0,
          "CriminalProsecutionReference",
          "OffenceReason",
          "LocalOffenceCode",
          "OffenceCode"
        ]
      }
    ])
  })

  it.ifNewBichard(
    "should not create an exception if the offence code lookup fails and the offence is ignored",
    async () => {
      ;(isOffenceIgnored as jest.MockedFunction<typeof isOffenceIgnored>).mockReturnValueOnce(true)

      // Generate a mock message
      const inputMessage = generateMessage({
        offences: [{ results: [{ code: 0 }], code: "BLAHHHH" }]
      })

      // Process the mock message

      const {
        hearingOutcome: { Exceptions: exceptions }
      } = await processMessage(inputMessage, {
        expectTriggers: false
      })

      // Check the right exceptions are generated
      expect(exceptions).toHaveLength(0)
    }
  )

  it.ifNewBichard("should not create an exception if the offence code is ignored", async () => {
    ;(isOffenceIgnored as jest.MockedFunction<typeof isOffenceIgnored>).mockReturnValueOnce(true)
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [{ results: [{ code: 0 }], code: "05MC001" }]
    })

    // Process the mock message

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processMessage(inputMessage, {
      expectTriggers: false
    })

    // Check the right exceptions are generated
    expect(exceptions).toHaveLength(0)
  })
})
