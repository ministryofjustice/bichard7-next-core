import type { FastifyInstance } from "fastify"

import { expect } from "@jest/globals"
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { ResolutionStatusNumber } from "@moj-bichard7/common/types/ResolutionStatus"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { set, subDays } from "date-fns"

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

describe("warrants report e2e", () => {
  const endpoint = V1.CasesReportsWarrants
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance

  const stubDate = set(new Date(), {
    hours: 13,
    milliseconds: 0,
    minutes: 20,
    seconds: 0
  })
  const courtDate = subDays(stubDate, 5)

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

  it("will receive a 200 and data", async () => {
    const [encodedJwt, user] = await createUserAndJwtToken(helper.postgres, [UserGroup.Supervisor])

    const [caseObj] = await createCases(helper.postgres, 3, {
      0: { courtDate: courtDate, messageReceivedAt: stubDate }
    })

    await createTriggers(helper.postgres, caseObj.errorId, [
      {
        resolvedAt: new Date(),
        resolvedBy: user.username,
        status: ResolutionStatusNumber.Resolved,
        triggerCode: TriggerCode.TRPR0002
      },
      {
        resolvedAt: new Date(),
        resolvedBy: user.username,
        status: ResolutionStatusNumber.Resolved,
        triggerCode: TriggerCode.TRPR0012
      }
    ])

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 7).toISOString())
    query.append("toDate", new Date().toISOString())

    const response = await fetch(`${helper.address}${endpoint}?${query}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(200)

    const json = await streamToJson(response)

    expect(json).toHaveLength(1)
  })
})
