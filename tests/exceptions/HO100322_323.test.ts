jest.setTimeout(30000)

import generateMessage from "tests/helpers/generateMessage"
import PostgresHelper from "tests/helpers/PostgresHelper"
import processMessage from "tests/helpers/processMessage"

describe("HO100322", () => {
  afterAll(() => {
    PostgresHelper.closeConnection()
  })

  it("should create HO100322 and HO100323 exceptions when there is a recordable offence and adjourned result but no next result source organisation and hearing date", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [
        {
          results: [{ code: 4009 }],
          recordable: true
        }
      ]
    })

    // Process the mock message
    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processMessage(inputMessage, {
      expectTriggers: false,
      recordable: true
    })

    // Check the right exceptions are generated
    expect(exceptions).toStrictEqual([
      {
        code: "HO100322",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          0,
          "Result",
          0,
          "NextResultSourceOrganisation",
          "OrganisationUnitCode"
        ]
      },
      {
        code: "HO100323",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          0,
          "Result",
          0,
          "NextHearingDate"
        ]
      }
    ])
  })

  it("should not create an exception when there is no recordable offence", async () => {
    const nonRecordableOffenceCode = "BA76004"

    const inputMessage = generateMessage({
      offences: [
        {
          code: nonRecordableOffenceCode,
          results: [{ code: 4009 }],
          recordable: false
        }
      ]
    })
    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processMessage(inputMessage, {
      expectTriggers: false,
      recordable: false
    })

    expect(exceptions).toHaveLength(0)
  })
})
