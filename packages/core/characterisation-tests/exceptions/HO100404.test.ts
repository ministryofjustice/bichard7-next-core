import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"

import type Phase3Result from "../../phase3/types/Phase3Result"

import { asnPath } from "../helpers/errorPaths"
import generatePhase3Message from "../helpers/generatePhase3Message"
import { processPhase3Message } from "../helpers/processMessage"

describe.ifPhase3("HO100404", () => {
  const legacyBichard = process.env.USE_BICHARD === "true"

  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it("creates a HO100404 exception when PNC update returns a communication/access/timeout error", async () => {
    const pncUpdateDataset = generatePhase3Message()
    const pncErrorMessage = "PNCAM - SOME PNC COMMUNICATION/ACCESS/TIMEOUT ERROR"

    const {
      outputMessage: { Exceptions: exceptions }
    } = (await processPhase3Message(pncUpdateDataset, { pncErrorMessage })) as Phase3Result

    expect(exceptions).toStrictEqual([
      {
        code: "HO100404",
        ...(legacyBichard ? {} : { message: pncErrorMessage }),
        path: asnPath
      }
    ])
  })
})
