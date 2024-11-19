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
          convictionDate: null,
          finding: null,
          recordable: true,
          results: [{ code: 4001, nextHearing: { nextHearingDetails: {} } }]
        }
      ]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage, {
      pncAdjudication: true,
      recordable: true
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
          convictionDate: null,
          finding: null,
          offenceSequenceNumber: 1,
          recordable: true,
          results: [{ code: 4001, nextHearing: { nextHearingDetails: {} } }]
        },
        {
          convictionDate: null,
          finding: null,
          offenceSequenceNumber: 2,
          recordable: true,
          results: [{ code: 4001, nextHearing: { nextHearingDetails: {} } }]
        }
      ]
    })

    const pncMessage = generateSpiMessage({
      offences: [
        {
          convictionDate: null,
          finding: null,
          offenceSequenceNumber: 1,
          recordable: true,
          results: [{ code: 4001, nextHearing: { nextHearingDetails: {} } }]
        }
      ]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage, {
      pncAdjudication: true,
      pncMessage,
      recordable: true
    })

    expect(exceptions).toStrictEqual([
      {
        code: "HO100324",
        path: offenceResultClassPath(0, 0)
      }
    ])
  })
})
