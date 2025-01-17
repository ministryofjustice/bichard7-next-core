import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"

import { asnPath } from "../helpers/errorPaths"
import generateSpiMessage from "../helpers/generateSpiMessage"
import { processPhase1Message } from "../helpers/processMessage"

describe.ifPhase1("HO100314", () => {
  const legacyBichard = process.env.USE_BICHARD === "true"

  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it("creates a HO100314 exception when PNC query returns a system fault error", async () => {
    const inputMessage = generateSpiMessage({ offences: [{ results: [{ code: 4597 }], recordable: true }] })
    const pncErrorMessage = "I0007 - SOME PNC SYSTEM FAULT ERROR"

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage, { pncErrorMessage })

    expect(exceptions).toStrictEqual([
      {
        code: "HO100314",
        ...(legacyBichard ? {} : { message: pncErrorMessage }),
        path: asnPath
      }
    ])
  })
})
