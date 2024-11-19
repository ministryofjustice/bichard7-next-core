import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import { lookupOffenceByCjsCode } from "../../lib/dataLookup"
import generateSpiMessage from "../helpers/generateSpiMessage"
import { processPhase1Message } from "../helpers/processMessage"

jest.mock("../../lib/dataLookup", () => ({
  ...jest.requireActual("../../lib/dataLookup"),
  lookupOffenceByCjsCode: jest.fn()
}))

describe.ifPhase1("HO100236", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  // It's impossible to test this as it relies on the standing data being incorrect
  it.skip("should not throw an exception for a valid home Office Classification", async () => {
    ;(lookupOffenceByCjsCode as jest.MockedFunction<typeof lookupOffenceByCjsCode>).mockReturnValue({
      cjsCode: "MC8080524",
      offenceCategory: "CB",
      offenceTitle: "Application to reopen case",
      recordableOnPnc: false,
      description: "blah",
      homeOfficeClassification: "123/45",
      notifiableToHo: true
    })

    const inputMessage = generateSpiMessage({
      offences: [{ results: [{ code: 4584 }] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toHaveLength(0)
    expect(lookupOffenceByCjsCode).toHaveBeenCalled()
  })

  // It's impossible to test this as it relies on the standing data being incorrect
  it.skip("should create an exception if the home office classifcation is an empty string", async () => {
    ;(lookupOffenceByCjsCode as jest.MockedFunction<typeof lookupOffenceByCjsCode>).mockReturnValue({
      cjsCode: "MC8080524",
      offenceCategory: "CB",
      offenceTitle: "valid",
      recordableOnPnc: false,
      description: "blah",
      homeOfficeClassification: "",
      notifiableToHo: true
    })

    const inputMessage = generateSpiMessage({
      offences: [{ results: [{ code: 1015 }] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

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

  // It's impossible to test this as it relies on the standing data being incorrect
  it.skip("should create an exception if the home office classification doesn't match the specified regex", async () => {
    ;(lookupOffenceByCjsCode as jest.MockedFunction<typeof lookupOffenceByCjsCode>).mockImplementation(() => ({
      cjsCode: "MC8080524",
      offenceCategory: "CB",
      offenceTitle: "valid",
      recordableOnPnc: false,
      description: "blah",
      homeOfficeClassification: "467/123",
      notifiableToHo: true
    }))

    const inputMessage = generateSpiMessage({
      offences: [{ results: [{ code: 1015 }] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

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
})
