import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"

import { asnPath } from "../helpers/errorPaths"
import generateSpiMessage from "../helpers/generateSpiMessage"
import { processPhase1Message } from "../helpers/processMessage"

describe("HO100302", () => {
  const legacyBichard = process.env.USE_BICHARD === "true"

  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it("creates a HO100302 exception when PNC query returns a communication/access/timeout error", async () => {
    const inputMessage = generateSpiMessage({ offences: [{ results: [{ code: 4597 }], recordable: true }] })
    const pncErrorMessage = "PNCAM - TIMEOUT AFTER 10 ATTEMPTS"

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage, { pncErrorMessage })

    expect(exceptions).toStrictEqual([
      {
        code: "HO100302",
        ...(legacyBichard ? {} : { message: pncErrorMessage }),
        path: asnPath
      }
    ])
  })
})
