jest.setTimeout(30000)

import generateMessage from "tests/helpers/generateMessage"
import PostgresHelper from "tests/helpers/PostgresHelper"
import processMessage from "tests/helpers/processMessage"

describe("HO100300", () => {
  afterAll(() => {
    PostgresHelper.closeConnection()
  })

  it("should create an exception if it cannot get the organisation unit from ASN", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      ASN: "1101HZ0100000376274C",
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
        code: "HO100300",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"]
      }
    ])
  })

  it("should create an exception if the Court Hearing Location is not found", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      courtHearingLocation: "B99EF01",
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
        code: "HO100300",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Hearing", "CourtHearingLocation", "OrganisationUnitCode"]
      }
    ])
  })

  it("should create an exception if the Next Source Organisation is not found", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
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

    // Process the mock message
    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processMessage(inputMessage, {
      expectTriggers: false
    })

    // Check the right triggers are generated
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

  it("shouldn't create an exception if a HO100200 (OU invalid) exception has been raised for this OU", async () => {
    const inputMessage = generateMessage({
      courtHearingLocation: "inval!d",
      offences: [{ results: [{ code: 1015 }] }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processMessage(inputMessage, {
      expectTriggers: false
    })

    expect(exceptions).toContainEqual({
      code: "HO100200",
      path: ["AnnotatedHearingOutcome", "HearingOutcome", "Hearing", "CourtHearingLocation", "OrganisationUnitCode"]
    })
  })

  it("should create an exception if a HO100200 (OU invalid) exception has been raised for a different OU", async () => {
    const inputMessage = generateMessage({
      courtHearingLocation: "inval!d",
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
    } = await processMessage(inputMessage, {
      expectTriggers: false
    })

    expect(exceptions).toStrictEqual([
      {
        code: "HO100200",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Hearing", "CourtHearingLocation", "OrganisationUnitCode"]
      },
      {
        code: "HO100200",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          0,
          "Result",
          0,
          "SourceOrganisation",
          "OrganisationUnitCode"
        ]
      },
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
