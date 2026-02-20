import type { ExceptionReportDto } from "@moj-bichard7/common/contracts/ExceptionReportDto"
import type { FastifyInstance } from "fastify"

import { expect } from "@jest/globals"
import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { ResolutionStatusNumber } from "@moj-bichard7/common/types/ResolutionStatus"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { subDays } from "date-fns"

import { createCases } from "../../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../../tests/helpers/setupAppEnd2EndHelper"
import { streamToJson } from "../../../../tests/helpers/streamToJson"
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

describe("exceptions report e2e", () => {
  const endpoint = V1.CasesReportsExceptions
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

  it("gets exceptions that are resolved", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.Supervisor])

    await createCases(helper.postgres, 3, {
      0: { errorResolvedAt: subDays(new Date(), 1), errorStatus: ResolutionStatusNumber.Resolved },
      1: { triggerResolvedAt: subDays(new Date(), 1), triggerStatus: ResolutionStatusNumber.Resolved },
      2: { errorStatus: ResolutionStatusNumber.Submitted }
    })

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 7).toISOString())
    query.append("toDate", new Date().toISOString())
    query.append("exceptions", "true")
    query.append("triggers", "true")

    const response = await fetch(`${helper.address}${endpoint}?${query}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(200)

    const [json] = (await streamToJson(response)) as ExceptionReportDto[]

    expect(json.cases).toHaveLength(2)
  })
})
