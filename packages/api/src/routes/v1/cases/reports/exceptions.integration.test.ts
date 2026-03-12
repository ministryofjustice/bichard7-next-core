import type { ExceptionReportDto } from "@moj-bichard7/common/types/reports/Exceptions"
import type { FastifyInstance } from "fastify"

import { expect } from "@jest/globals"
import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { ResolutionStatusNumber } from "@moj-bichard7/common/types/ResolutionStatus"
import { isError } from "@moj-bichard7/common/types/Result"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { addDays, format, subDays } from "date-fns"
import { BAD_REQUEST, FORBIDDEN, OK } from "http-status"

import build from "../../../../app"
import { AuditLogDynamoGateway } from "../../../../services/gateways/dynamo"
import { getAuditLogUserEvents } from "../../../../tests/helpers/auditLogHelper"
import { createCases } from "../../../../tests/helpers/caseHelper"
import auditLogDynamoConfig from "../../../../tests/helpers/dynamoDbConfig"
import { createUserAndJwtToken } from "../../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../../tests/testGateways/e2ePostgres"
import TestDynamoGateway from "../../../../tests/testGateways/TestDynamoGateway/TestDynamoGateway"

const formatDateDto = "dd/MM/yyyy" as const
const formatTimeDto = "HH:mm" as const

describe("exceptions report", () => {
  let app: FastifyInstance
  const testDatabaseGateway = new End2EndPostgres()
  const testDynamoGateway = new TestDynamoGateway(auditLogDynamoConfig)
  const auditLogGateway = new AuditLogDynamoGateway(auditLogDynamoConfig)

  beforeAll(async () => {
    app = await build({ auditLogGateway, database: testDatabaseGateway })
    await app.ready()
  })

  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
    await testDynamoGateway.clearDynamo()
  })

  afterAll(async () => {
    await testDatabaseGateway.close()
    await app.close()
  })

  it("gives 400 error with no params", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])

    const { statusCode } = await app.inject({
      headers: { authorization: `Bearer ${jwt}` },
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
      headers: { authorization: `Bearer ${jwt}` },
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
      headers: { authorization: `Bearer ${jwt}` },
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
      headers: { authorization: `Bearer ${jwt}` },
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
      headers: { authorization: `Bearer ${jwt}` },
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
      headers: { authorization: `Bearer ${jwt}` },
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
    expect(reportItem.resolvedAt).toBe(format(caseObj.errorResolvedAt!, `${formatDateDto} ${formatTimeDto}`))
    expect(reportItem.hearingDate).toBe(format(caseObj.courtDate!, formatDateDto))
    expect(reportItem.type).toBe("Ex")
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
      headers: { authorization: `Bearer ${jwt}` },
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
    expect(reportItem.resolvedAt).toBe(format(caseObj.triggerResolvedAt!, `${formatDateDto} ${formatTimeDto}`))
    expect(reportItem.hearingDate).toBe(format(caseObj.courtDate!, formatDateDto))
    expect(reportItem.type).toBe("Tr")
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
      headers: { authorization: `Bearer ${jwt}` },
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
    expect(reportItemEx.resolvedAt).toBe(format(caseObjEx.errorResolvedAt!, `${formatDateDto} ${formatTimeDto}`))
    expect(reportItemEx.hearingDate).toBe(format(caseObjEx.courtDate!, formatDateDto))
    expect(reportItemEx.type).toBe("Ex")

    const exceptionReportTr = json[1] as ExceptionReportDto
    const reportItemTr = exceptionReportTr.cases[0]
    const caseObjTr = cases[0]

    expect(reportItemTr.resolvedAt).toBe(format(caseObjTr.triggerResolvedAt!, `${formatDateDto} ${formatTimeDto}`))
    expect(reportItemTr.hearingDate).toBe(format(caseObjTr.courtDate!, formatDateDto))
    expect(reportItemTr.type).toBe("Tr")
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
      headers: { authorization: `Bearer ${jwt}` },
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
      headers: { authorization: `Bearer ${jwt}` },
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
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsExceptions}?${query.toString()}`
    })

    expect(response.statusCode).toBe(200)

    const json = response.json()

    expect(json).toHaveLength(1)
  })
  it("creates an Audit Log User Event", async () => {
    const [jwt, user] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])
    await createCases(testDatabaseGateway, 3, {
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
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsExceptions}?${query.toString()}`
    })

    expect(response.statusCode).toBe(200)

    const auditLogResults = await getAuditLogUserEvents(auditLogGateway, EventCode.ReportRun)

    if (isError(auditLogResults)) {
      throw new Error("Audit log event failed")
    }

    expect(auditLogResults).toHaveLength(1)

    const event = auditLogResults[0]

    expect(event.user).toBe(user.username)
    expect(event.eventCode).toBe(EventCode.ReportRun)
    expect(event.eventSource).toBe("Bichard New UI")
    expect(event.category).toBe("information")
    expect(event.attributes?.["Number of Records Returned"]).toBe(2)
    expect(event.attributes?.["Report ID"]).toBe("Resolved Exceptions/Triggers")
    expect(event.attributes?.["Output Format"]).toBe("Viewed in UI")
  })

  it("still creates an Audit Log User Event if there is not a case", async () => {
    const [jwt, user] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 7).toISOString())
    query.append("toDate", new Date().toISOString())
    query.append("exceptions", "true")
    query.append("triggers", "true")

    const response = await app.inject({
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsExceptions}?${query.toString()}`
    })

    expect(response.statusCode).toBe(200)

    const auditLogResults = await getAuditLogUserEvents(auditLogGateway, EventCode.ReportRun)

    if (isError(auditLogResults)) {
      throw new Error("Audit log event failed")
    }

    expect(auditLogResults).toHaveLength(1)

    const event = auditLogResults[0]

    expect(event.user).toBe(user.username)
    expect(event.eventCode).toBe(EventCode.ReportRun)
    expect(event.eventSource).toBe("Bichard New UI")
    expect(event.category).toBe("information")
    expect(event.attributes?.["Number of Records Returned"]).toBe(0)
    expect(event.attributes?.["Report ID"]).toBe("Resolved Exceptions/Triggers")
    expect(event.attributes?.["Output Format"]).toBe("Viewed in UI")
  })
})
