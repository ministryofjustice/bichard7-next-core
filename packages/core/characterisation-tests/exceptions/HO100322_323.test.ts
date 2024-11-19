import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import generateSpiMessage from "../helpers/generateSpiMessage"
import { processPhase1Message } from "../helpers/processMessage"

describe.ifPhase1("HO100322", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it("should create HO100322 and HO100323 exceptions when there is a recordable offence and adjourned result but no next result source organisation and hearing date", async () => {
    const inputMessage = generateSpiMessage({
      offences: [
        {
          results: [{ code: 4009 }],
          recordable: true
        }
      ]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage, {
      recordable: true
    })

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

    const inputMessage = generateSpiMessage({
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
    } = await processPhase1Message(inputMessage, {
      recordable: false
    })

    expect(exceptions).toHaveLength(0)
  })
})
