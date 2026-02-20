import type { ExceptionReportDto } from "@moj-bichard7/common/contracts/ExceptionReport"
import type { FastifyInstance } from "fastify"

import { expect } from "@jest/globals"
import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { ResolutionStatusNumber } from "@moj-bichard7/common/types/ResolutionStatus"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { addDays, format, subDays } from "date-fns"
import { BAD_REQUEST, FORBIDDEN, OK } from "http-status"

import type { AuditLogDynamoGateway } from "../../../../services/gateways/dynamo"

import build from "../../../../app"
import { createCases } from "../../../../tests/helpers/caseHelper"
import { createUserAndJwtToken } from "../../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../../tests/testGateways/e2ePostgres"

const formatDate = "yyyy-MM-dd" as const
const formatDateTime = `${formatDate} HH:mm` as const

describe("exceptions report", () => {
  let app: FastifyInstance
  const testDatabaseGateway = new End2EndPostgres()

  beforeAll(async () => {
    app = await build({ auditLogGateway: {} as AuditLogDynamoGateway, database: testDatabaseGateway })
    await app.ready()
  })

  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
  })

  afterAll(async () => {
    await testDatabaseGateway.close()
    await app.close()
  })

  it("gives 400 error with no params", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])

    const { statusCode } = await app.inject({
      headers: { authorization: "Bearer {{ token }}".replace("{{ token }}", jwt) },
      method: "GET",
      url: V1.CasesReportsExceptions
    })

    expect(statusCode).toBe(BAD_REQUEST)
  })

  it("succeeds with params", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])

    const query = new URLSearchParams()
    query.append("fromDate", new Date().toISOString())
    query.append("toDate", new Date().toISOString())
    query.append("exceptions", "true")
    query.append("triggers", "true")

    const { statusCode } = await app.inject({
      headers: { authorization: "Bearer {{ token }}".replace("{{ token }}", jwt) },
      method: "GET",
      url: `${V1.CasesReportsExceptions}?${query.toString()}`
    })

    expect(statusCode).toBe(OK)
  })

  it("fails with the wrong permissions", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.GeneralHandler])

    const query = new URLSearchParams()
    query.append("fromDate", new Date().toISOString())
    query.append("toDate", new Date().toISOString())
    query.append("exceptions", "true")
    query.append("triggers", "true")

    const { statusCode } = await app.inject({
      headers: { authorization: "Bearer {{ token }}".replace("{{ token }}", jwt) },
      method: "GET",
      url: `${V1.CasesReportsExceptions}?${query.toString()}`
    })

    expect(statusCode).toBe(FORBIDDEN)
  })

  it("will fail with exceptions and triggers set to false", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])

    const query = new URLSearchParams()
    query.append("fromDate", new Date().toISOString())
    query.append("toDate", new Date().toISOString())
    query.append("exceptions", "false")
    query.append("triggers", "false")

    const { statusCode } = await app.inject({
      headers: { authorization: "Bearer {{ token }}".replace("{{ token }}", jwt) },
      method: "GET",
      url: `${V1.CasesReportsExceptions}?${query.toString()}`
    })

    expect(statusCode).toBe(BAD_REQUEST)
  })

  it("fails if the fromDate is before the toDate", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])

    const query = new URLSearchParams()
    query.append("fromDate", addDays(new Date(), 1).toISOString())
    query.append("toDate", new Date().toISOString())
    query.append("exceptions", "true")
    query.append("triggers", "true")

    const { statusCode } = await app.inject({
      headers: { authorization: "Bearer {{ token }}".replace("{{ token }}", jwt) },
      method: "GET",
      url: `${V1.CasesReportsExceptions}?${query.toString()}`
    })

    expect(statusCode).toBe(BAD_REQUEST)
  })

  it("gets exceptions that are resolved", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])

    const cases = await createCases(testDatabaseGateway, 3, {
      0: { errorResolvedAt: subDays(new Date(), 1), errorStatus: ResolutionStatusNumber.Resolved },
      1: { errorStatus: ResolutionStatusNumber.Unresolved },
      2: { errorStatus: ResolutionStatusNumber.Submitted }
    })

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 7).toISOString())
    query.append("toDate", new Date().toISOString())
    query.append("exceptions", "true")
    query.append("triggers", "true")

    const response = await app.inject({
      headers: { authorization: "Bearer {{ token }}".replace("{{ token }}", jwt) },
      method: "GET",
      url: `${V1.CasesReportsExceptions}?${query.toString()}`
    })

    expect(response.statusCode).toBe(200)

    const json = response.json()

    expect(json).toHaveLength(1)

    const exceptionReport = json[0] as ExceptionReportDto
    const reportItem = exceptionReport.cases[0]
    const caseObj = cases[0]

    expect(exceptionReport.username).toBe(caseObj.errorResolvedBy)
    expect(reportItem.resolver).toBe(caseObj.errorResolvedBy)
    expect(format(reportItem.resolvedAt, formatDateTime)).toBe(format(caseObj.errorResolvedAt!, formatDateTime))
    expect(format(reportItem.hearingDate, formatDate)).toBe(format(caseObj.courtDate!, formatDate))
    expect(reportItem.type).toBe("Exception")
  })

  it("gets triggers that are resolved", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])

    const cases = await createCases(testDatabaseGateway, 3, {
      0: { triggerResolvedAt: subDays(new Date(), 1), triggerStatus: ResolutionStatusNumber.Resolved },
      1: { triggerStatus: ResolutionStatusNumber.Unresolved },
      2: { triggerStatus: ResolutionStatusNumber.Submitted }
    })

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 7).toISOString())
    query.append("toDate", new Date().toISOString())
    query.append("exceptions", "true")
    query.append("triggers", "true")

    const response = await app.inject({
      headers: { authorization: "Bearer {{ token }}".replace("{{ token }}", jwt) },
      method: "GET",
      url: `${V1.CasesReportsExceptions}?${query.toString()}`
    })

    expect(response.statusCode).toBe(200)

    const json = response.json()

    expect(json).toHaveLength(1)

    const exceptionReport = json[0] as ExceptionReportDto
    const reportItem = exceptionReport.cases[0]
    const caseObj = cases[0]

    expect(reportItem.resolver).toBe(caseObj.triggerResolvedBy)
    expect(format(reportItem.resolvedAt, formatDateTime)).toBe(format(caseObj.triggerResolvedAt!, formatDateTime))
    expect(format(reportItem.hearingDate, formatDate)).toBe(format(caseObj.courtDate!, formatDate))
    expect(reportItem.type).toBe("Trigger")
  })

  it("gets exceptions and triggers that are resolved", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])

    const cases = await createCases(testDatabaseGateway, 3, {
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

    const response = await app.inject({
      headers: { authorization: "Bearer {{ token }}".replace("{{ token }}", jwt) },
      method: "GET",
      url: `${V1.CasesReportsExceptions}?${query.toString()}`
    })

    expect(response.statusCode).toBe(200)

    const json = response.json()

    expect(json).toHaveLength(2)

    const exceptionReportEx = json[0] as ExceptionReportDto
    const reportItemEx = exceptionReportEx.cases[0]
    const caseObjEx = cases[1]

    expect(reportItemEx.resolver).toBe(caseObjEx.errorResolvedBy)
    expect(format(reportItemEx.resolvedAt, formatDateTime)).toBe(format(caseObjEx.errorResolvedAt!, formatDateTime))
    expect(format(reportItemEx.hearingDate, formatDate)).toBe(format(caseObjEx.courtDate!, formatDate))
    expect(reportItemEx.type).toBe("Exception")

    const exceptionReportTr = json[1] as ExceptionReportDto
    const reportItemTr = exceptionReportTr.cases[0]
    const caseObjTr = cases[0]

    expect(reportItemTr.resolver).toBe(caseObjTr.triggerResolvedBy)
    expect(format(reportItemTr.resolvedAt, formatDateTime)).toBe(format(caseObjTr.triggerResolvedAt!, formatDateTime))
    expect(format(reportItemTr.hearingDate, formatDate)).toBe(format(caseObjTr.courtDate!, formatDate))
    expect(reportItemTr.type).toBe("Trigger")
  })

  it("gets exceptions and triggers that are resolved on one case", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])

    const [caseObj] = await createCases(testDatabaseGateway, 3, {
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

    const response = await app.inject({
      headers: { authorization: "Bearer {{ token }}".replace("{{ token }}", jwt) },
      method: "GET",
      url: `${V1.CasesReportsExceptions}?${query.toString()}`
    })

    expect(response.statusCode).toBe(200)

    const json = response.json() as ExceptionReportDto[]

    expect(json).toHaveLength(1)
    expect(json[0].username).toBe(caseObj.errorResolvedBy)
    expect(json[0].username).toBe(caseObj.triggerResolvedBy)
    expect(json[0].cases).toHaveLength(2)
  })

  it("gets triggers when exceptions are filtered", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])

    await createCases(testDatabaseGateway, 3, {
      0: { triggerResolvedAt: subDays(new Date(), 1), triggerStatus: ResolutionStatusNumber.Resolved },
      1: { errorResolvedAt: subDays(new Date(), 1), errorStatus: ResolutionStatusNumber.Resolved },
      2: { triggerStatus: ResolutionStatusNumber.Submitted }
    })

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 7).toISOString())
    query.append("toDate", new Date().toISOString())
    query.append("exceptions", "false")
    query.append("triggers", "true")

    const response = await app.inject({
      headers: { authorization: "Bearer {{ token }}".replace("{{ token }}", jwt) },
      method: "GET",
      url: `${V1.CasesReportsExceptions}?${query.toString()}`
    })

    expect(response.statusCode).toBe(200)

    const json = response.json()

    expect(json).toHaveLength(1)
  })

  it("gets exceptions when triggers are filtered", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])

    await createCases(testDatabaseGateway, 3, {
      0: { triggerResolvedAt: subDays(new Date(), 1), triggerStatus: ResolutionStatusNumber.Resolved },
      1: { errorResolvedAt: subDays(new Date(), 1), errorStatus: ResolutionStatusNumber.Resolved },
      2: { triggerStatus: ResolutionStatusNumber.Submitted }
    })

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 7).toISOString())
    query.append("toDate", new Date().toISOString())
    query.append("exceptions", "true")
    query.append("triggers", "false")

    const response = await app.inject({
      headers: { authorization: "Bearer {{ token }}".replace("{{ token }}", jwt) },
      method: "GET",
      url: `${V1.CasesReportsExceptions}?${query.toString()}`
    })

    expect(response.statusCode).toBe(200)

    const json = response.json()

    expect(json).toHaveLength(1)
  })
})
