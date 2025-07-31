import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"

import { asnPath } from "../helpers/errorPaths"
import generateSpiMessage from "../helpers/generateSpiMessage"
import { processPhase1Message } from "../helpers/processMessage"

describe("HO100301", () => {
  const legacyBichard = process.env.USE_BICHARD === "true"

  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it("creates a HO100301 exception when PNC query returns an ASN not found error", async () => {
    const inputMessage = generateSpiMessage({ offences: [{ results: [{ code: 4597 }], recordable: true }] })
    const pncErrorMessage = "I1008 - GWAY - ENQUIRY ERROR ARREST/SUMMONS REF (99/99XX/00/123456X) NOT FOUND"

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage, { pncErrorMessage })

    expect(exceptions).toStrictEqual([
      {
        code: "HO100301",
        ...(legacyBichard ? {} : { message: pncErrorMessage }),
        path: asnPath
      }
    ])
  })
})
