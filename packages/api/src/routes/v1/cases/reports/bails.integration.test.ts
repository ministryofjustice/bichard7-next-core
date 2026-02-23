import type { CaseForBailsReportDto } from "@moj-bichard7/common/types/reports/Bails"
import type { FastifyInstance } from "fastify"

import { expect } from "@jest/globals"
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import getShortAsn from "@moj-bichard7/common/utils/getShortAsn"
import { addDays, format, subDays } from "date-fns"
import { BAD_REQUEST, FORBIDDEN, OK } from "http-status"

import type { AuditLogDynamoGateway } from "../../../../services/gateways/dynamo"

import build from "../../../../app"
import { createCases } from "../../../../tests/helpers/caseHelper"
import { createTriggers } from "../../../../tests/helpers/triggerHelper"
import { createUserAndJwtToken } from "../../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../../tests/testGateways/e2ePostgres"

describe("bails report", () => {
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
        bailConditions: "noBailConditionsText",
        courtName: caseObj.courtName,
        dateOfBirth: "11/11/1948",
        daysToEnterPortal: 1,
        defendantAddress: "Scenario1 Address Line 1, Scenario1 Address Line 2, Scenario1 Address Line 3",
        defendantName: caseObj.defendantName,
        hearingDate: format(caseObj.courtDate!, "dd/MM/yyyy"),
        hearingTime: "10:00",
        nextAppearanceCourt: "",
        nextAppearanceDate: "",
        nextAppearanceTime: "",
        offenceTitles:
          "Aid and abet theft.\n" +
          "Sell a tobacco product without a license.\n" +
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
        bailConditions: "noBailConditionsText",
        courtName: caseObj.courtName,
        dateOfBirth: "11/11/1948",
        daysToEnterPortal: 4,
        defendantAddress: "Scenario1 Address Line 1, Scenario1 Address Line 2, Scenario1 Address Line 3",
        defendantName: caseObj.defendantName,
        hearingDate: format(caseObj.courtDate!, "dd/MM/yyyy"),
        hearingTime: "10:00",
        nextAppearanceCourt: "",
        nextAppearanceDate: "",
        nextAppearanceTime: "",
        offenceTitles:
          "Aid and abet theft.\n" +
          "Sell a tobacco product without a license.\n" +
          "Use a motor vehicle on a road / public place without third party insurance.",
        ptiurn: caseObj.ptiurn,
        receivedDate: format(caseObj.messageReceivedAt, "dd/MM/yyyy HH:mm"),
        triggerResolvedDate: format(new Date(), "dd/MM/yyyy"),
        triggerStatus: "Resolved"
      })
    )
  })
})
