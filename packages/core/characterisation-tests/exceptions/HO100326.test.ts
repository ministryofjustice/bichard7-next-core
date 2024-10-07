import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import { offenceResultClassPath } from "../helpers/errorPaths"
import generateSpiMessage from "../helpers/generateSpiMessage"
import { processPhase1Message } from "../helpers/processMessage"

describe.ifPhase1("HO100326", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it("should create an exception when the conviction date is before the date of hearing and there is no adjudication", async () => {
    const inputMessage = generateSpiMessage({
      offences: [{ convictionDate: "2011-09-25", results: [{}], recordable: true }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage, {
      recordable: true
    })

    expect(exceptions).toStrictEqual([
      {
        code: "HO100326",
        path: offenceResultClassPath(0, 0)
      }
    ])
  })

  it("should not create an exception when offence was added by the court", async () => {
    const inputMessage = generateSpiMessage({
      offences: [
        { convictionDate: "2011-09-25", results: [{}], recordable: true, offenceSequenceNumber: 1 },
        { convictionDate: "2011-09-25", results: [{}], recordable: true, offenceSequenceNumber: 2 }
      ]
    })

    const pncMessage = generateSpiMessage({
      offences: [{ convictionDate: "2011-09-25", results: [{}], recordable: true, offenceSequenceNumber: 1 }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage, {
      recordable: true,
      pncMessage
    })

    expect(exceptions).toStrictEqual([
      {
        code: "HO100326",
        path: offenceResultClassPath(0, 0)
      }
    ])
  })
})
