import type { CaseForBailsReportDto } from "@moj-bichard7/common/types/reports/Bails"
import type { FastifyInstance } from "fastify"

import { expect } from "@jest/globals"
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { isError } from "@moj-bichard7/common/types/Result"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import getShortAsn from "@moj-bichard7/common/utils/getShortAsn"
import { addDays, format, subDays } from "date-fns"
import { BAD_REQUEST, FORBIDDEN, OK } from "http-status"

import build from "../../../../app"
import { AuditLogDynamoGateway } from "../../../../services/gateways/dynamo"
import { getAuditLogUserEvents } from "../../../../tests/helpers/auditLogHelper"
import { createCases } from "../../../../tests/helpers/caseHelper"
import auditLogDynamoConfig from "../../../../tests/helpers/dynamoDbConfig"
import { createTriggers } from "../../../../tests/helpers/triggerHelper"
import { createUserAndJwtToken } from "../../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../../tests/testGateways/e2ePostgres"
import TestDynamoGateway from "../../../../tests/testGateways/TestDynamoGateway/TestDynamoGateway"

describe("bails report", () => {
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
      url: V1.CasesReportsBails
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
      url: `${V1.CasesReportsBails}?${query.toString()}`
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
      url: `${V1.CasesReportsBails}?${query.toString()}`
    })

    expect(statusCode).toBe(FORBIDDEN)
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
      url: `${V1.CasesReportsBails}?${query.toString()}`
    })

    expect(statusCode).toBe(BAD_REQUEST)
  })

  it("returns 0 cases when case doesn't have triggers", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])
    await createCases(testDatabaseGateway, 3, {
      0: { courtDate: subDays(new Date(), 2), messageReceivedAt: subDays(new Date(), 2) },
      1: { courtDate: subDays(new Date(), 2), messageReceivedAt: subDays(new Date(), 2) },
      2: { courtDate: subDays(new Date(), 2), messageReceivedAt: subDays(new Date(), 2) }
    })

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 7).toISOString())
    query.append("toDate", new Date().toISOString())
    query.append("exceptions", "true")
    query.append("triggers", "true")

    const response = await app.inject({
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsBails}?${query.toString()}`
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toHaveLength(0)
  })

  it("returns 0 cases when case does have a trigger but not a bail", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])
    const [caseObj] = await createCases(testDatabaseGateway, 3, {
      0: { courtDate: subDays(new Date(), 2), messageReceivedAt: subDays(new Date(), 2) },
      1: { courtDate: subDays(new Date(), 2), messageReceivedAt: subDays(new Date(), 2) },
      2: { courtDate: subDays(new Date(), 2), messageReceivedAt: subDays(new Date(), 2) }
    })
    await createTriggers(testDatabaseGateway, caseObj.errorId, [{ triggerCode: TriggerCode.TRPR0001 }])

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 7).toISOString())
    query.append("toDate", new Date().toISOString())
    query.append("exceptions", "true")
    query.append("triggers", "true")

    const response = await app.inject({
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsBails}?${query.toString()}`
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toHaveLength(0)
  })

  it("returns 1 cases when case does have a bail trigger", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])
    const [caseObj] = await createCases(testDatabaseGateway, 3, {
      0: { courtDate: subDays(new Date(), 2), messageReceivedAt: subDays(new Date(), 2) },
      1: { courtDate: subDays(new Date(), 2), messageReceivedAt: subDays(new Date(), 2) },
      2: { courtDate: subDays(new Date(), 2), messageReceivedAt: subDays(new Date(), 2) }
    })
    await createTriggers(testDatabaseGateway, caseObj.errorId, [{ triggerCode: TriggerCode.TRPR0010 }])

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 7).toISOString())
    query.append("toDate", new Date().toISOString())
    query.append("exceptions", "true")
    query.append("triggers", "true")

    const response = await app.inject({
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsBails}?${query.toString()}`
    })

    expect(response.statusCode).toBe(200)

    const json = response.json() as CaseForBailsReportDto[]

    expect(json).toHaveLength(1)
  })

  it("returns correct information", async () => {
    const courtDate = subDays(new Date(), 3)
    const messageReceivedAt = subDays(new Date(), 2)

    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])
    const [caseObj] = await createCases(testDatabaseGateway, 3, {
      0: { courtDate, messageReceivedAt },
      1: { courtDate, messageReceivedAt },
      2: { courtDate, messageReceivedAt }
    })
    await createTriggers(testDatabaseGateway, caseObj.errorId, [{ triggerCode: TriggerCode.TRPR0010 }])

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 7).toISOString())
    query.append("toDate", new Date().toISOString())
    query.append("exceptions", "true")
    query.append("triggers", "true")

    const response = await app.inject({
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsBails}?${query.toString()}`
    })

    expect(response.statusCode).toBe(200)

    const json = response.json() as CaseForBailsReportDto[]
    const reportItem = json[0]

    expect(reportItem).toEqual(
      expect.objectContaining({
        asn: getShortAsn(caseObj.asn),
        automatedToPNC: "No",
        bailConditions: "No bail conditions found",
        courtName: caseObj.courtName,
        dateOfBirth: "11/11/1948",
        daysToEnterPortal: 1,
        defendantAddress: "Scenario1 Address Line 1, Scenario1 Address Line 2, Scenario1 Address Line 3",
        defendantName: caseObj.defendantName,
        errorId: caseObj.errorId,
        hearingDate: format(caseObj.courtDate!, "dd/MM/yyyy"),
        hearingTime: "10:00",
        nextAppearanceCourt: "",
        nextAppearanceDate: "",
        nextAppearanceTime: "",
        offenceTitles:
          "Aid and abet theft.\n\n" +
          "Sell a tobacco product without a license.\n\n" +
          "Use a motor vehicle on a road / public place without third party insurance.",
        ptiurn: caseObj.ptiurn,
        receivedDate: format(caseObj.messageReceivedAt, "dd/MM/yyyy HH:mm"),
        triggerResolvedDate: "",
        triggerStatus: "Unresolved"
      })
    )
  })

  it("returns correct information with resolved trigger", async () => {
    const courtDate = subDays(new Date(), 5)
    const messageReceivedAt = subDays(new Date(), 1)

    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])
    const [caseObj] = await createCases(testDatabaseGateway, 3, {
      0: { courtDate, messageReceivedAt },
      1: { courtDate, messageReceivedAt },
      2: { courtDate, messageReceivedAt }
    })
    await createTriggers(testDatabaseGateway, caseObj.errorId, [{ status: 2, triggerCode: TriggerCode.TRPR0010 }])

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 7).toISOString())
    query.append("toDate", new Date().toISOString())
    query.append("exceptions", "true")
    query.append("triggers", "true")

    const response = await app.inject({
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsBails}?${query.toString()}`
    })

    expect(response.statusCode).toBe(200)

    const json = response.json() as CaseForBailsReportDto[]
    const reportItem = json[0]

    expect(reportItem).toEqual(
      expect.objectContaining({
        asn: getShortAsn(caseObj.asn),
        automatedToPNC: "No",
        bailConditions: "No bail conditions found",
        courtName: caseObj.courtName,
        dateOfBirth: "11/11/1948",
        daysToEnterPortal: 4,
        defendantAddress: "Scenario1 Address Line 1, Scenario1 Address Line 2, Scenario1 Address Line 3",
        defendantName: caseObj.defendantName,
        errorId: caseObj.errorId,
        hearingDate: format(caseObj.courtDate!, "dd/MM/yyyy"),
        hearingTime: "10:00",
        nextAppearanceCourt: "",
        nextAppearanceDate: "",
        nextAppearanceTime: "",
        offenceTitles:
          "Aid and abet theft.\n\n" +
          "Sell a tobacco product without a license.\n\n" +
          "Use a motor vehicle on a road / public place without third party insurance.",
        ptiurn: caseObj.ptiurn,
        receivedDate: format(caseObj.messageReceivedAt, "dd/MM/yyyy HH:mm"),
        triggerResolvedDate: format(new Date(), "dd/MM/yyyy"),
        triggerStatus: "Resolved"
      })
    )
  })

  it("creates an Audit Log User Event", async () => {
    const [jwt, user] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])
    const [caseObj] = await createCases(testDatabaseGateway, 3, {
      0: { courtDate: subDays(new Date(), 2), messageReceivedAt: subDays(new Date(), 2) },
      1: { courtDate: subDays(new Date(), 2), messageReceivedAt: subDays(new Date(), 2) },
      2: { courtDate: subDays(new Date(), 2), messageReceivedAt: subDays(new Date(), 2) }
    })
    await createTriggers(testDatabaseGateway, caseObj.errorId, [{ triggerCode: TriggerCode.TRPR0010 }])

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 7).toISOString())
    query.append("toDate", new Date().toISOString())
    query.append("exceptions", "true")
    query.append("triggers", "true")

    const response = await app.inject({
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsBails}?${query.toString()}`
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
    expect(event.attributes?.["Number of Records Returned"]).toBe(1)
    expect(event.attributes?.["Report ID"]).toBe("Bail Conditions")
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
      url: `${V1.CasesReportsBails}?${query.toString()}`
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
    expect(event.attributes?.["Report ID"]).toBe("Bail Conditions")
    expect(event.attributes?.["Output Format"]).toBe("Viewed in UI")
  })
})
