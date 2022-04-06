jest.setTimeout(30000)

import generateMessage from "tests/helpers/generateMessage"
import PostgresHelper from "tests/helpers/PostgresHelper"
import processMessage from "tests/helpers/processMessage"
import { lookupOffenceCodeByCjsCode } from "src/use-cases/dataLookup"

jest.mock("../../src/use-cases/dataLookup", () => ({
  ...jest.requireActual("../../src/use-cases/dataLookup"),
  lookupOffenceCodeByCjsCode: jest.fn()
}))

describe("HO100233", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    PostgresHelper.closeConnection()
  })

  it.ifNewBichard("should not throw an exception for a valid home Office Classification", async () => {
    ;(lookupOffenceCodeByCjsCode as jest.MockedFunction<typeof lookupOffenceCodeByCjsCode>).mockReturnValue({
      cjsCode: "MC8080524",
      offenceCategory: "CB",
      offenceTitle: "Application to reopen case",
      recordableOnPnc: "N",
      description: "blah",
      homeOfficeClassification: "123/45",
      notifiableToHo: "Y",
      resultHalfLifeHours: null
    })

    const inputMessage = generateMessage({
      offences: [{ results: [{ code: 4584 }] }]
    })

    const { exceptions } = await processMessage(inputMessage, {
      expectTriggers: false
    })

    expect(exceptions).toHaveLength(0)
    expect(lookupOffenceCodeByCjsCode).toHaveBeenCalledTimes(2)
  })

  it.ifNewBichard("should create an exception if the home office classifcation is an empty string", async () => {
    ;(lookupOffenceCodeByCjsCode as jest.MockedFunction<typeof lookupOffenceCodeByCjsCode>).mockReturnValue({
      cjsCode: "MC8080524",
      offenceCategory: "CB",
      offenceTitle: "valid",
      recordableOnPnc: "N",
      description: "blah",
      homeOfficeClassification: "",
      notifiableToHo: "Y",
      resultHalfLifeHours: null
    })

    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [{ results: [{ code: 1015 }] }]
    })

    // Process the mock message
    const { exceptions } = await processMessage(inputMessage, {
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
      ;(lookupOffenceCodeByCjsCode as jest.MockedFunction<typeof lookupOffenceCodeByCjsCode>).mockImplementation(
        () => ({
          cjsCode: "MC8080524",
          offenceCategory: "CB",
          offenceTitle: "valid",
          recordableOnPnc: "N",
          description: "blah",
          homeOfficeClassification: "467/123",
          notifiableToHo: "Y",
          resultHalfLifeHours: null
        })
      )
      // Generate a mock message
      const inputMessage = generateMessage({
        offences: [{ results: [{ code: 1015 }] }]
      })

      // Process the mock message
      const { exceptions } = await processMessage(inputMessage, {
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
