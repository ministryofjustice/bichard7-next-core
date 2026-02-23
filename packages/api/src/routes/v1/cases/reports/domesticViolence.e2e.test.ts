import type { CaseForDomesticViolenceReportDto } from "@moj-bichard7/common/types/reports/DomesticViolence"
import type { FastifyInstance } from "fastify"

import { expect } from "@jest/globals"
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { subDays } from "date-fns"
import { uniq } from "lodash"

import { createCases } from "../../../../tests/helpers/caseHelper"
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

describe("domestic violence report e2e", () => {
  const endpoint = V1.CasesReportsDomesticViolence
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

  it("gets domestic violence that are the correct code", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.Supervisor])
    const [caseObj] = await createCases(helper.postgres, 3, {
      0: { courtDate: subDays(new Date(), 2), messageReceivedAt: subDays(new Date(), 2) },
      1: { courtDate: subDays(new Date(), 2), messageReceivedAt: subDays(new Date(), 2) },
      2: { courtDate: subDays(new Date(), 2), messageReceivedAt: subDays(new Date(), 2) }
    })

    await createTriggers(helper.postgres, caseObj.errorId, [{ triggerCode: TriggerCode.TRPR0024 }])

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 7).toISOString())
    query.append("toDate", new Date().toISOString())
    query.append("exceptions", "true")
    query.append("triggers", "true")

    const response = await fetch(`${helper.address}${endpoint}?${query}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(200)

    const json = (await streamToJson(response)) as CaseForDomesticViolenceReportDto[]

    // 3 Offences
    expect(json).toHaveLength(3)
    // 1 Case
    expect(uniq(json.map((caseReportItem) => caseReportItem.asn))).toHaveLength(1)
  })
})
