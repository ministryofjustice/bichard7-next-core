jest.setTimeout(30000)

import { lookupNationalOffenceByCjsCode } from "src/use-cases/dataLookup"
import generateMessage from "tests/helpers/generateMessage"
import PostgresHelper from "tests/helpers/PostgresHelper"
import processMessage from "tests/helpers/processMessage"

jest.mock("../../src/use-cases/dataLookup", () => ({
  ...jest.requireActual("../../src/use-cases/dataLookup"),
  lookupNationalOffenceByCjsCode: jest.fn()
}))

describe("HO100233", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    PostgresHelper.closeConnection()
  })

  it.ifNewBichard("should not throw an exception for a valid offence title", async () => {
    ;(lookupNationalOffenceByCjsCode as jest.MockedFunction<typeof lookupNationalOffenceByCjsCode>).mockReturnValue({
      cjsCode: "MC8080524",
      offenceCategory: "CB",
      offenceTitle: "Application to reopen case",
      recordableOnPnc: false,
      description: "blah",
      homeOfficeClassification: "123/45",
      notifiableToHo: true,
      resultHalfLifeHours: null
    })

    const inputMessage = generateMessage({
      offences: [{ results: [{ code: 4584 }] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processMessage(inputMessage, {
      expectTriggers: false
    })

    expect(exceptions).toHaveLength(0)
    expect(lookupNationalOffenceByCjsCode).toHaveBeenCalled()
  })

  it.ifNewBichard("should create an exception if the offence title is less than the min length", async () => {
    ;(lookupNationalOffenceByCjsCode as jest.MockedFunction<typeof lookupNationalOffenceByCjsCode>).mockReturnValue({
      cjsCode: "MC8080524",
      offenceCategory: "CB",
      offenceTitle: "",
      recordableOnPnc: false,
      description: "blah",
      homeOfficeClassification: "123/45",
      notifiableToHo: true,
      resultHalfLifeHours: null
    })

    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [{ results: [{ code: 1015 }] }]
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
        code: "HO100233",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "Offence", 0, "OffenceTitle"]
      }
    ])
  })

  it.ifNewBichard("should create an exception if the offence title is greater than the max length", async () => {
    ;(lookupNationalOffenceByCjsCode as jest.MockedFunction<typeof lookupNationalOffenceByCjsCode>).mockImplementation(
      () => ({
        cjsCode: "MC8080524",
        offenceCategory: "CB",
        offenceTitle: "x".repeat(121),
        recordableOnPnc: false,
        description: "blah",
        homeOfficeClassification: "123/45",
        notifiableToHo: true,
        resultHalfLifeHours: null
      })
    )
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [{ results: [{ code: 1015 }] }]
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
        code: "HO100233",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "Offence", 0, "OffenceTitle"]
      }
    ])
  })
})
