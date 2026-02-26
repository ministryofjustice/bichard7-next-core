import type { CaseForWarrantsReportDto } from "@moj-bichard7/common/types/reports/Warrants"
import type { FastifyInstance } from "fastify"

import { expect } from "@jest/globals"
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { addDays, format, set, subDays } from "date-fns"
import { BAD_REQUEST, FORBIDDEN } from "http-status"

import type { AuditLogDynamoGateway } from "../../../../services/gateways/dynamo"

import build from "../../../../app"
import { createCases } from "../../../../tests/helpers/caseHelper"
import { createTriggers } from "../../../../tests/helpers/triggerHelper"
import { createUserAndJwtToken } from "../../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../../tests/testGateways/e2ePostgres"

describe("warrants report", () => {
  let app: FastifyInstance
  const testDatabaseGateway = new End2EndPostgres()

  const stubDate = set(new Date(), {
    hours: 13,
    milliseconds: 0,
    minutes: 20,
    seconds: 0
  })
  const courtDate = subDays(stubDate, 5)

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

  it("fails if the fromDate is before the toDate", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])

    const query = new URLSearchParams()
    query.append("fromDate", addDays(new Date(), 1).toISOString())
    query.append("toDate", new Date().toISOString())

    const { statusCode } = await app.inject({
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsWarrants}?${query.toString()}`
    })

    expect(statusCode).toBe(BAD_REQUEST)
  })

  it("fails if the user isn't in the correct group", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.GeneralHandler])

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 7).toISOString())
    query.append("toDate", new Date().toISOString())

    const { statusCode } = await app.inject({
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsWarrants}?${query.toString()}`
    })

    expect(statusCode).toBe(FORBIDDEN)
  })

  it("succeeds when there are no cases", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 7).toISOString())
    query.append("toDate", new Date().toISOString())

    const response = await app.inject({
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsWarrants}?${query.toString()}`
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toHaveLength(0)
  })

  it("returns no cases when there's no triggers", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])
    const [caseObj] = await createCases(testDatabaseGateway, 1, {
      0: { courtDate: courtDate, messageReceivedAt: stubDate }
    })

    expect(caseObj.triggers).toHaveLength(0)

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 7).toISOString())
    query.append("toDate", new Date().toISOString())

    const response = await app.inject({
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsWarrants}?${query.toString()}`
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toHaveLength(0)
  })

  it("returns no cases when there's no warrant triggers", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])
    const [caseObj] = await createCases(testDatabaseGateway, 1, {
      0: { courtDate: courtDate, messageReceivedAt: stubDate }
    })

    await createTriggers(testDatabaseGateway, caseObj.errorId, [{ triggerCode: TriggerCode.TRPR0001 }])

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 7).toISOString())
    query.append("toDate", new Date().toISOString())

    const response = await app.inject({
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsWarrants}?${query.toString()}`
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toHaveLength(0)
  })

  it("returns 1 case when there a warrant trigger (TRPR0002)", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])
    const [caseObj] = await createCases(testDatabaseGateway, 1, {
      0: { courtDate: courtDate, messageReceivedAt: stubDate }
    })

    await createTriggers(testDatabaseGateway, caseObj.errorId, [{ triggerCode: TriggerCode.TRPR0002 }])

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 7).toISOString())
    query.append("toDate", new Date().toISOString())

    const response = await app.inject({
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsWarrants}?${query.toString()}`
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toHaveLength(1)
  })

  it("returns 1 case when there a warrant trigger (TRPR0012)", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])
    const [caseObj] = await createCases(testDatabaseGateway, 1, {
      0: { courtDate: courtDate, messageReceivedAt: stubDate }
    })

    await createTriggers(testDatabaseGateway, caseObj.errorId, [{ triggerCode: TriggerCode.TRPR0012 }])

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 7).toISOString())
    query.append("toDate", new Date().toISOString())

    const response = await app.inject({
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsWarrants}?${query.toString()}`
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toHaveLength(1)
  })

  it("returns 1 case when there both warrant triggers", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])
    const [caseObj] = await createCases(testDatabaseGateway, 1, {
      0: { courtDate: courtDate, messageReceivedAt: stubDate }
    })

    await createTriggers(testDatabaseGateway, caseObj.errorId, [
      { triggerCode: TriggerCode.TRPR0002 },
      { triggerCode: TriggerCode.TRPR0012 }
    ])

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 7).toISOString())
    query.append("toDate", new Date().toISOString())

    const response = await app.inject({
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsWarrants}?${query.toString()}`
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toHaveLength(1)
  })

  it("returns 1 case when there both warrant triggers resolved", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])
    const [caseObj] = await createCases(testDatabaseGateway, 1, {
      0: { courtDate: courtDate, messageReceivedAt: stubDate }
    })

    await createTriggers(testDatabaseGateway, caseObj.errorId, [
      { resolvedAt: new Date(), resolvedBy: "user", status: 2, triggerCode: TriggerCode.TRPR0002 },
      { resolvedAt: new Date(), resolvedBy: "user", status: 2, triggerCode: TriggerCode.TRPR0012 }
    ])

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 7).toISOString())
    query.append("toDate", new Date().toISOString())

    const response = await app.inject({
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsWarrants}?${query.toString()}`
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toHaveLength(1)
  })

  it("returns 2 cases when there both warrant triggers are present", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])
    const [caseObj1, caseObj2] = await createCases(testDatabaseGateway, 2, {
      0: { courtDate: courtDate, messageReceivedAt: stubDate },
      1: { courtDate: courtDate, messageReceivedAt: stubDate }
    })

    await createTriggers(testDatabaseGateway, caseObj1.errorId, [
      { resolvedAt: new Date(), resolvedBy: "user", status: 2, triggerCode: TriggerCode.TRPR0002 }
    ])

    await createTriggers(testDatabaseGateway, caseObj2.errorId, [
      { resolvedAt: new Date(), resolvedBy: "user", status: 2, triggerCode: TriggerCode.TRPR0012 }
    ])

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 7).toISOString())
    query.append("toDate", new Date().toISOString())

    const response = await app.inject({
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsWarrants}?${query.toString()}`
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toHaveLength(2)
  })

  it("contains the correct fields", async () => {
    const courtDate = subDays(stubDate, 8)

    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])
    const [caseObj] = await createCases(testDatabaseGateway, 2, {
      0: { courtDate: courtDate, messageReceivedAt: stubDate }
    })

    await createTriggers(testDatabaseGateway, caseObj.errorId, [
      { resolvedAt: new Date(), resolvedBy: "user", status: 2, triggerCode: TriggerCode.TRPR0002 },
      { triggerCode: TriggerCode.TRPR0012 }
    ])

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 7).toISOString())
    query.append("toDate", new Date().toISOString())

    const response = await app.inject({
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsWarrants}?${query.toString()}`
    })

    expect(response.statusCode).toBe(200)

    const reportItems = response.json()

    expect(reportItems).toHaveLength(1)

    const reportItem = reportItems[0] as CaseForWarrantsReportDto

    expect(reportItem.asn).toBe("19/01ID/01/6148H")
    expect(reportItem.bailOrNoBail).toBe("No Bail")
    expect(reportItem.courtName).toBe("Kingston Crown Court")
    expect(reportItem.dateOfBirth).toBe("11/11/1948")
    expect(reportItem.dateTimeReceivedByCJSE).toBe(format(stubDate, "dd/MM/yyyy HH:mm"))
    expect(reportItem.defendantAddress).toBe(
      "Scenario1 Address Line 1, Scenario1 Address Line 2, Scenario1 Address Line 3"
    )
    expect(reportItem.defendantName).toBe("Defendant")
    expect(reportItem.gender).toBe("Male")
    expect(reportItem.hearingDate).toBe(format(courtDate, "dd/MM/yyyy"))
    expect(reportItem.hearingTime).toBe("10:00")
    expect(reportItem.nextCourtAppearance).toBe("")
    expect(reportItem.nextCourtAppearanceDate).toBe("")
    expect(reportItem.offencesTitle).toBe(
      "Aid and abet theft.\n\n" +
        "Sell a tobacco product without a license.\n\n" +
        "Use a motor vehicle on a road / public place without third party insurance."
    )
    expect(reportItem.offencesWording).toBe(
      "Aid and abet theft\n\n" +
        "Sell a tobacco product without a license\n\n" +
        "Use a motor vehicle without third party insurance."
    )
    expect(reportItem.pncId).toBe("2000/0448754K")
    expect(reportItem.ptiurn).toBe("00112233")
    expect(reportItem.warrantText).toBe("")
    expect(reportItem.warrantType).toBe("Withdrawn\n\nFTA")

    expect(reportItem.triggerResolvedDate).toBe("")
    expect(reportItem.triggerStatus).toBe("Unresolved")
    expect(reportItem.numberOfDaysTakenToEnterPortal).toBe(8)
  })

  it("with resolved triggers", async () => {
    const courtDate = subDays(stubDate, 5)

    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])
    const [caseObj] = await createCases(testDatabaseGateway, 2, {
      0: { courtDate: courtDate, messageReceivedAt: stubDate, triggerResolvedAt: subDays(stubDate, 2) }
    })

    await createTriggers(testDatabaseGateway, caseObj.errorId, [
      { resolvedAt: subDays(stubDate, 2), resolvedBy: "user", status: 2, triggerCode: TriggerCode.TRPR0002 },
      { resolvedAt: subDays(stubDate, 3), resolvedBy: "user", status: 2, triggerCode: TriggerCode.TRPR0012 }
    ])

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 7).toISOString())
    query.append("toDate", new Date().toISOString())

    const response = await app.inject({
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsWarrants}?${query.toString()}`
    })

    expect(response.statusCode).toBe(200)

    const reportItems = response.json()

    expect(reportItems).toHaveLength(1)

    const reportItem = reportItems[0] as CaseForWarrantsReportDto

    expect(reportItem.triggerResolvedDate).toBe(format(subDays(stubDate, 2), "dd/MM/yyyy"))
    expect(reportItem.triggerStatus).toBe("Resolved")
    expect(reportItem.numberOfDaysTakenToEnterPortal).toBe(5)
  })
})
