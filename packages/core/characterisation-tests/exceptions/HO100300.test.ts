import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import generateSpiMessage from "../helpers/generateSpiMessage"
import { processPhase1Message } from "../helpers/processMessage"

describe.ifPhase1("HO100300", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it("should create an exception if it cannot get the organisation unit from ASN", async () => {
    const inputMessage = generateSpiMessage({
      ASN: "1101HZ0100000376274C",
      offences: [{ results: [{ code: 1015 }] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toStrictEqual([
      {
        code: "HO100300",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"]
      }
    ])
  })

  it("should create an exception if the Court Hearing Location is not found", async () => {
    const inputMessage = generateSpiMessage({
      courtHearingLocation: "B99EF01",
      offences: [{ results: [{ code: 1015 }] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toStrictEqual([
      {
        code: "HO100300",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Hearing", "CourtHearingLocation", "OrganisationUnitCode"]
      }
    ])
  })

  it("should create an exception if the Next Source Organisation is not found", async () => {
    const inputMessage = generateSpiMessage({
      offences: [
        {
          results: [
            {
              code: 1015,
              text: "Dummy result text",
              nextHearing: {
                nextHearingDetails: {
                  courtHearingLocation: "B01NI01",
                  dateOfHearing: "2011-10-08",
                  timeOfHearing: "14:00:00"
                },
                nextHearingReason: "Dummy reason",
                bailStatusOffence: "U"
              }
            }
          ]
        }
      ]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toStrictEqual([
      {
        code: "HO100300",
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
      }
    ])
  })
})
