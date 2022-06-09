jest.setTimeout(30000)

import { lookupOffenceByCjsCode } from "src/use-cases/dataLookup"
import generateMessage from "tests/helpers/generateMessage"
import PostgresHelper from "tests/helpers/PostgresHelper"
import processMessage from "tests/helpers/processMessage"

jest.mock("../../src/use-cases/dataLookup", () => ({
  ...jest.requireActual("../../src/use-cases/dataLookup"),
  lookupOffenceByCjsCode: jest.fn()
}))

describe("HO100233", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    PostgresHelper.closeConnection()
  })

  it.ifNewBichard("should not throw an exception for a valid home Office Classification", async () => {
    ;(lookupOffenceByCjsCode as jest.MockedFunction<typeof lookupOffenceByCjsCode>).mockReturnValue({
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
    expect(lookupOffenceByCjsCode).toHaveBeenCalled()
  })

  it.ifNewBichard("should create an exception if the home office classifcation is an empty string", async () => {
    ;(lookupOffenceByCjsCode as jest.MockedFunction<typeof lookupOffenceByCjsCode>).mockReturnValue({
      cjsCode: "MC8080524",
      offenceCategory: "CB",
      offenceTitle: "valid",
      recordableOnPnc: false,
      description: "blah",
      homeOfficeClassification: "",
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

    // Check the right triggers are generated
    expect(exceptions).toStrictEqual([
      {
        code: "HO100236",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          0,
          "HomeOfficeClassification"
        ]
      }
    ])
  })

  it.ifNewBichard(
    "should create an exception if the home office classification doesn't match the specified regex",
    async () => {
      ;(lookupOffenceByCjsCode as jest.MockedFunction<typeof lookupOffenceByCjsCode>).mockImplementation(() => ({
        cjsCode: "MC8080524",
        offenceCategory: "CB",
        offenceTitle: "valid",
        recordableOnPnc: false,
        description: "blah",
        homeOfficeClassification: "467/123",
        notifiableToHo: true,
        resultHalfLifeHours: null
      }))
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

      // Check the right triggers are generated
      expect(exceptions).toStrictEqual([
        {
          code: "HO100236",
          path: [
            "AnnotatedHearingOutcome",
            "HearingOutcome",
            "Case",
            "HearingDefendant",
            "Offence",
            0,
            "HomeOfficeClassification"
          ]
        }
      ])
    }
  )
})
