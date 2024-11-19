import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import { offenceResultClassPath } from "../helpers/errorPaths"
import generateSpiMessage from "../helpers/generateSpiMessage"
import { processPhase1Message } from "../helpers/processMessage"

describe.ifPhase1("HO100324", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it("should create an exception when there is no verdict, the case is adjourned and there is an adjudication", async () => {
    const inputMessage = generateSpiMessage({
      offences: [
        {
          finding: null,
          convictionDate: null,
          results: [{ code: 4001, nextHearing: { nextHearingDetails: {} } }],
          recordable: true
        }
      ]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage, {
      recordable: true,
      pncAdjudication: true
    })

    expect(exceptions).toStrictEqual([
      {
        code: "HO100324",
        path: offenceResultClassPath(0, 0)
      }
    ])
  })

  it("should not create an exception when the offence was added by the court", async () => {
    const inputMessage = generateSpiMessage({
      offences: [
        {
          finding: null,
          convictionDate: null,
          results: [{ code: 4001, nextHearing: { nextHearingDetails: {} } }],
          recordable: true,
          offenceSequenceNumber: 1
        },
        {
          finding: null,
          convictionDate: null,
          results: [{ code: 4001, nextHearing: { nextHearingDetails: {} } }],
          recordable: true,
          offenceSequenceNumber: 2
        }
      ]
    })

    const pncMessage = generateSpiMessage({
      offences: [
        {
          finding: null,
          convictionDate: null,
          results: [{ code: 4001, nextHearing: { nextHearingDetails: {} } }],
          recordable: true,
          offenceSequenceNumber: 1
        }
      ]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage, {
      recordable: true,
      pncAdjudication: true,
      pncMessage
    })

    expect(exceptions).toStrictEqual([
      {
        code: "HO100324",
        path: offenceResultClassPath(0, 0)
      }
    ])
  })
})
