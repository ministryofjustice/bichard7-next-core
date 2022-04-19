jest.setTimeout(30000)

import generateMessage from "tests/helpers/generateMessage"
import PostgresHelper from "tests/helpers/PostgresHelper"
import processMessage from "tests/helpers/processMessage"

describe("HO100239", () => {
  afterAll(() => {
    PostgresHelper.closeConnection()
  })

  // legacy bichard throws runtime exception Caused by: uk.gov.ocjr.mtu.br7.common.xmlconverter.UnmarshalFailedException: javax.xml.bind.UnmarshalException: the value is out of the range (minInclusive specifies 0).\n - with linked exception:
  it.ifNewBichard("should not throw an exception for a valid CourtOffenceSequenceNumber", async () => {
    const inputMessage = generateMessage({
      offences: [{ results: [{ code: 4584 }], offenceSequenceNumber: 1 }]
    })

    const { exceptions } = await processMessage(inputMessage, {
      expectTriggers: false
    })

    expect(exceptions).toHaveLength(0)
  })

  it.ifNewBichard(
    "should create an exception if the CourtOffenceSequenceNumber is less than the min length",
    async () => {
      // Generate a mock message
      const inputMessage = generateMessage({
        offences: [{ results: [{ code: 1015 }], offenceSequenceNumber: -1 }]
      })

      // Process the mock message
      const { exceptions } = await processMessage(inputMessage, {
        expectTriggers: false
      })

      // Check the right triggers are generated
      expect(exceptions).toStrictEqual([
        {
          code: "HO100239",
          path: [
            "AnnotatedHearingOutcome",
            "HearingOutcome",
            "Case",
            "HearingDefendant",
            "Offence",
            0,
            "CourtOffenceSequenceNumber"
          ]
        }
      ])
    }
  )

  it.ifNewBichard(
    "should create an exception if the CourtOffenceSequenceNumber is greater than the max length",
    async () => {
      // Generate a mock message
      const inputMessage = generateMessage({
        offences: [{ results: [{ code: 1015 }], offenceSequenceNumber: 1000 }]
      })

      // Process the mock message
      const { exceptions } = await processMessage(inputMessage, {
        expectTriggers: false
      })

      // Check the right triggers are generated
      expect(exceptions).toStrictEqual([
        {
          code: "HO100239",
          path: [
            "AnnotatedHearingOutcome",
            "HearingOutcome",
            "Case",
            "HearingDefendant",
            "Offence",
            0,
            "CourtOffenceSequenceNumber"
          ]
        }
      ])
    }
  )
})
