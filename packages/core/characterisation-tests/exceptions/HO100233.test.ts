import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import { lookupOffenceByCjsCode } from "../../lib/dataLookup"
import generateSpiMessage from "../helpers/generateSpiMessage"
import { processPhase1Message } from "../helpers/processMessage"

describe.ifPhase1("HO100233", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  // It's impossible to test this as it relies on the standing data being incorrect
  it.skip("should not throw an exception for a valid offence title", async () => {
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
  it.skip("should create an exception if the offence title is less than the min length", async () => {
    ;(lookupOffenceByCjsCode as jest.MockedFunction<typeof lookupOffenceByCjsCode>).mockReturnValue({
      cjsCode: "MC8080524",
      offenceCategory: "CB",
      offenceTitle: "",
      recordableOnPnc: false,
      description: "blah",
      homeOfficeClassification: "123/45",
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
        code: "HO100233",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "Offence", 0, "OffenceTitle"]
      }
    ])
  })

  // It's impossible to test this as it relies on the standing data being incorrect
  it.skip("should create an exception if the offence title is greater than the max length", async () => {
    ;(lookupOffenceByCjsCode as jest.MockedFunction<typeof lookupOffenceByCjsCode>).mockImplementation(() => ({
      cjsCode: "MC8080524",
      offenceCategory: "CB",
      offenceTitle: "x".repeat(121),
      recordableOnPnc: false,
      description: "blah",
      homeOfficeClassification: "123/45",
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
        code: "HO100233",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "Offence", 0, "OffenceTitle"]
      }
    ])
  })
})
