import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type { FastifyInstance } from "fastify"

import { expect } from "@jest/globals"
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import parseAhoXml from "@moj-bichard7/common/aho/parseAhoXml/parseAhoXml"
import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { isError, type Result } from "@moj-bichard7/common/types/Result"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import serialiseToXml from "@moj-bichard7/core/lib/serialise/ahoXml/serialiseToXml"
import { subDays } from "date-fns"

import { testAhoXml } from "../../../../tests/helpers/ahoHelper"
import { createCase } from "../../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../../tests/helpers/setupAppEnd2EndHelper"
import { streamToJson } from "../../../../tests/helpers/streamToJson"
import { createTriggers } from "../../../../tests/helpers/triggerHelper"
import { createUserAndJwtToken } from "../../../../tests/helpers/userHelper"

const defaultRequest = (jwt: string) => {
  return {
    headers: {
      Authorization: `Bearer ${jwt}`,
      Connection: "close"
    },
    method: "GET"
  }
}

describe("community sentence report e2e", () => {
  const endpoint = V1.CasesReportsCommunitySentence
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app
  })

  beforeEach(async () => {
    await helper.postgres.clearDb()
  })

  afterAll(async () => {
    await app.close()
    await helper.postgres.close()
  })

  it("gets community sentence report", async () => {
    const parsedAho: Result<AnnotatedHearingOutcome> = parseAhoXml(testAhoXml)

    if (isError(parsedAho)) {
      console.log("Missing or invalid AHO")
      throw parsedAho
    }

    // Need to assign a community sentence result code
    const validResultCode = 1030
    parsedAho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].Result[0].CJSresultCode =
      validResultCode

    const aho = serialiseToXml(parsedAho)

    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.Supervisor])
    const caseObj = await createCase(helper.postgres, {
      aho,
      courtDate: subDays(new Date(), 2),
      messageReceivedAt: subDays(new Date(), 2)
    })

    await createTriggers(helper.postgres, caseObj.errorId, [
      { triggerCode: TriggerCode.TRPR0031 },
      { triggerCode: TriggerCode.TRPR0023 },
      { triggerCode: TriggerCode.TRPR0024 }
    ])

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 7).toISOString())
    query.append("toDate", new Date().toISOString())
    query.append("resultCodes", validResultCode.toString())

    const response = await fetch(`${helper.address}${endpoint}?${query}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(200)

    const json = await streamToJson(response)

    expect(json).toHaveLength(1)
  })
})
