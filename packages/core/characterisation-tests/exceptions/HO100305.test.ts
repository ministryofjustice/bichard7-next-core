import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import { offenceResultClassPath } from "../helpers/errorPaths"
import generateSpiMessage from "../helpers/generateSpiMessage"
import { processPhase1Message } from "../helpers/processMessage"

describe.ifPhase1("HO100305", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it("should create an exception if the case has no conviction date", async () => {
    const inputMessage = generateSpiMessage({
      offences: [{ results: [{}], convictionDate: null }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toStrictEqual([
      {
        code: "HO100305",
        path: offenceResultClassPath(0, 0)
      }
    ])
  })

  it("should create an exception if the case has no conviction date and is adjourned", async () => {
    const inputMessage = generateSpiMessage({
      offences: [
        { results: [{ code: 4001, nextHearing: { nextHearingDetails: {} } }, { code: 2050 }], convictionDate: null }
      ]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage)

    expect(exceptions).toStrictEqual([
      {
        code: "HO100305",
        path: offenceResultClassPath(0, 0)
      }
    ])
  })
})
