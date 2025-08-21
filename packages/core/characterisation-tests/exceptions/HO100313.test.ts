import { asnPath } from "@moj-bichard7/common/aho/asnPath"
import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"

import generateSpiMessage from "../helpers/generateSpiMessage"
import { processPhase1Message } from "../helpers/processMessage"

describe("HO100313", () => {
  const legacyBichard = process.env.USE_BICHARD === "true"

  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it("creates a HO100313 exception when PNC query returns a business error", async () => {
    const inputMessage = generateSpiMessage({ offences: [{ results: [{ code: 4597 }], recordable: true }] })
    const pncErrorMessage = "I0208 - SOME PNC BUSINESS ERROR"

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage, { pncErrorMessage })

    expect(exceptions).toStrictEqual([
      {
        code: "HO100313",
        ...(legacyBichard ? {} : { message: pncErrorMessage }),
        path: asnPath
      }
    ])
  })
})
