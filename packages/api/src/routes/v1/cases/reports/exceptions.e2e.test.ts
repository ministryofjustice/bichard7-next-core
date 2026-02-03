import type { CaseForReport } from "@moj-bichard7/common/types/Case"
import type { FastifyInstance } from "fastify"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { ResolutionStatusNumber } from "@moj-bichard7/common/types/ResolutionStatus"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { subDays } from "date-fns"

import { createCases } from "../../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../../tests/helpers/setupAppEnd2EndHelper"
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

const streamToJson = async (response: Response) => {
  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  let result = ""

  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }

    result += decoder.decode(value, { stream: true })
  }

  result += decoder.decode()

  return JSON.parse(result)
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

    const cases = await createCases(helper.postgres, 3, {
      0: { errorResolvedAt: subDays(new Date(), 1), errorStatus: ResolutionStatusNumber.Resolved },
      1: { errorStatus: ResolutionStatusNumber.Unresolved },
      2: { errorStatus: ResolutionStatusNumber.Submitted }
    })

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 7).toISOString())
    query.append("toDate", new Date().toISOString())
    query.append("exceptions", "true")
    query.append("triggers", "true")

    const response = await fetch(`${helper.address}${endpoint}?${query}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(200)

    const json = await streamToJson(response)

    expect(json).toHaveLength(1)

    const reportItem = json[0] as CaseForReport
    const caseObj = cases[0]

    expect(reportItem.resolver).toBe(caseObj.errorResolvedBy)
    expect(reportItem.resolvedAt).toBe(caseObj.errorResolvedAt!.toISOString())
    expect(reportItem.hearingDate).toBe(caseObj.courtDate!.toISOString())
    expect(reportItem.type).toBe("Exception")
  })

  it("gets triggers that are resolved", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.Supervisor])

    const cases = await createCases(helper.postgres, 3, {
      0: { triggerResolvedAt: subDays(new Date(), 1), triggerStatus: ResolutionStatusNumber.Resolved },
      1: { triggerStatus: ResolutionStatusNumber.Unresolved },
      2: { triggerStatus: ResolutionStatusNumber.Submitted }
    })

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 7).toISOString())
    query.append("toDate", new Date().toISOString())
    query.append("exceptions", "true")
    query.append("triggers", "true")

    const response = await fetch(`${helper.address}${endpoint}?${query}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(200)

    const json = await streamToJson(response)

    expect(json).toHaveLength(1)

    const reportItem = json[0] as CaseForReport
    const caseObj = cases[0]

    expect(reportItem.resolver).toBe(caseObj.triggerResolvedBy)
    expect(reportItem.resolvedAt).toBe(caseObj.triggerResolvedAt!.toISOString())
    expect(reportItem.hearingDate).toBe(caseObj.courtDate!.toISOString())
    expect(reportItem.type).toBe("Trigger")
  })

  it("gets exceptions and triggers that are resolved", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.Supervisor])

    const cases = await createCases(helper.postgres, 3, {
      0: {
        triggerResolvedAt: subDays(new Date(), 1),
        triggerResolvedBy: "User 2",
        triggerStatus: ResolutionStatusNumber.Resolved
      },
      1: {
        errorResolvedAt: subDays(new Date(), 2),
        errorResolvedBy: "User 1",
        errorStatus: ResolutionStatusNumber.Resolved
      },
      2: { triggerStatus: ResolutionStatusNumber.Submitted }
    })

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 7).toISOString())
    query.append("toDate", new Date().toISOString())
    query.append("exceptions", "true")
    query.append("triggers", "true")

    const response = await fetch(`${helper.address}${endpoint}?${query}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(200)

    const json = await streamToJson(response)

    expect(json).toHaveLength(2)

    const reportItemEx = json[0] as CaseForReport
    const caseObjEx = cases[1]

    expect(reportItemEx.resolver).toBe(caseObjEx.errorResolvedBy)
    expect(reportItemEx.resolvedAt).toBe(caseObjEx.errorResolvedAt!.toISOString())
    expect(reportItemEx.hearingDate).toBe(caseObjEx.courtDate!.toISOString())
    expect(reportItemEx.type).toBe("Exception")

    const reportItemTr = json[1] as CaseForReport
    const caseObjTr = cases[0]

    expect(reportItemTr.resolver).toBe(caseObjTr.triggerResolvedBy)
    expect(reportItemTr.resolvedAt).toBe(caseObjTr.triggerResolvedAt!.toISOString())
    expect(reportItemTr.hearingDate).toBe(caseObjTr.courtDate!.toISOString())
    expect(reportItemTr.type).toBe("Trigger")
  })

  it("gets exceptions and triggers that are resolved on one case", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.Supervisor])

    await createCases(helper.postgres, 3, {
      0: {
        errorResolvedAt: subDays(new Date(), 1),
        errorStatus: ResolutionStatusNumber.Resolved,
        triggerResolvedAt: subDays(new Date(), 1),
        triggerStatus: ResolutionStatusNumber.Resolved
      },
      1: { errorStatus: ResolutionStatusNumber.Unresolved },
      2: { triggerStatus: ResolutionStatusNumber.Submitted }
    })

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 7).toISOString())
    query.append("toDate", new Date().toISOString())
    query.append("exceptions", "true")
    query.append("triggers", "true")

    const response = await fetch(`${helper.address}${endpoint}?${query}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(200)

    const json = await streamToJson(response)

    expect(json).toHaveLength(2)
  })

  it("gets triggers when exceptions are filtered", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.Supervisor])

    await createCases(helper.postgres, 3, {
      0: { triggerResolvedAt: subDays(new Date(), 1), triggerStatus: ResolutionStatusNumber.Resolved },
      1: { errorResolvedAt: subDays(new Date(), 1), errorStatus: ResolutionStatusNumber.Resolved },
      2: { triggerStatus: ResolutionStatusNumber.Submitted }
    })

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 7).toISOString())
    query.append("toDate", new Date().toISOString())
    query.append("exceptions", "false")
    query.append("triggers", "true")

    const response = await fetch(`${helper.address}${endpoint}?${query}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(200)

    const json = await streamToJson(response)

    expect(json).toHaveLength(1)
  })

  it("gets exceptions when triggers are filtered", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [UserGroup.Supervisor])

    await createCases(helper.postgres, 3, {
      0: { triggerResolvedAt: subDays(new Date(), 1), triggerStatus: ResolutionStatusNumber.Resolved },
      1: { errorResolvedAt: subDays(new Date(), 1), errorStatus: ResolutionStatusNumber.Resolved },
      2: { triggerStatus: ResolutionStatusNumber.Submitted }
    })

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 7).toISOString())
    query.append("toDate", new Date().toISOString())
    query.append("exceptions", "true")
    query.append("triggers", "false")

    const response = await fetch(`${helper.address}${endpoint}?${query}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(200)

    const json = await streamToJson(response)

    expect(json).toHaveLength(1)
  })
})
