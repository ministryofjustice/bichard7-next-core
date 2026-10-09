import type { CaseForBailsReportDto } from "@moj-bichard7/common/types/reports/Bails"
import type { CommunitySentenceReportDto } from "@moj-bichard7/common/types/reports/CommunitySentence"
import type { FastifyInstance } from "fastify"

import { expect } from "@jest/globals"
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { addDays, subDays } from "date-fns"
import { formatInTimeZone } from "date-fns-tz"
import { BAD_REQUEST, FORBIDDEN, OK } from "http-status"

import build from "../../../../app"
import { AuditLogDynamoGateway } from "../../../../services/gateways/dynamo"
import { createCases } from "../../../../tests/helpers/caseHelper"
import auditLogDynamoConfig from "../../../../tests/helpers/dynamoDbConfig"
import { createTriggers } from "../../../../tests/helpers/triggerHelper"
import { createUserAndJwtToken } from "../../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../../tests/testGateways/e2ePostgres"
import TestDynamoGateway from "../../../../tests/testGateways/TestDynamoGateway/TestDynamoGateway"

describe("community sentence report", () => {
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
      url: V1.CasesReportsCommunitySentence
    })

    expect(statusCode).toBe(BAD_REQUEST)
  })

  it("succeeds with params", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])

    const query = new URLSearchParams()
    query.append("fromDate", new Date().toISOString())
    query.append("toDate", new Date().toISOString())

    const { statusCode } = await app.inject({
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsCommunitySentence}?${query.toString()}`
    })

    expect(statusCode).toBe(OK)
  })

  it("fails with the wrong permissions", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.GeneralHandler])

    const query = new URLSearchParams()
    query.append("fromDate", new Date().toISOString())
    query.append("toDate", new Date().toISOString())

    const { statusCode } = await app.inject({
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsCommunitySentence}?${query.toString()}`
    })

    expect(statusCode).toBe(FORBIDDEN)
  })

  it("fails if the fromDate is before the toDate", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])

    const query = new URLSearchParams()
    query.append("fromDate", addDays(new Date(), 1).toISOString())
    query.append("toDate", new Date().toISOString())

    const { statusCode } = await app.inject({
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsCommunitySentence}?${query.toString()}`
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

    const response = await app.inject({
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsCommunitySentence}?${query.toString()}`
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toHaveLength(0)
  })

  it("returns 0 cases when case does have a trigger but not a trigger 31", async () => {
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

    const response = await app.inject({
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsCommunitySentence}?${query.toString()}`
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toHaveLength(0)
  })

  it("returns 0 cases when case does have a trigger 23 but not a trigger 31", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])
    const [caseObj] = await createCases(testDatabaseGateway, 3, {
      0: { courtDate: subDays(new Date(), 2), messageReceivedAt: subDays(new Date(), 2) },
      1: { courtDate: subDays(new Date(), 2), messageReceivedAt: subDays(new Date(), 2) },
      2: { courtDate: subDays(new Date(), 2), messageReceivedAt: subDays(new Date(), 2) }
    })
    await createTriggers(testDatabaseGateway, caseObj.errorId, [{ triggerCode: TriggerCode.TRPR0023 }])

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 7).toISOString())
    query.append("toDate", new Date().toISOString())

    const response = await app.inject({
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsCommunitySentence}?${query.toString()}`
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toHaveLength(0)
  })

  it("returns 1 case when case does have a trigger 31", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])
    const [caseObj] = await createCases(testDatabaseGateway, 3, {
      0: { courtDate: subDays(new Date(), 2), messageReceivedAt: subDays(new Date(), 2) },
      1: { courtDate: subDays(new Date(), 2), messageReceivedAt: subDays(new Date(), 2) },
      2: { courtDate: subDays(new Date(), 2), messageReceivedAt: subDays(new Date(), 2) }
    })
    await createTriggers(testDatabaseGateway, caseObj.errorId, [{ triggerCode: TriggerCode.TRPR0031 }])

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 7).toISOString())
    query.append("toDate", new Date().toISOString())

    const response = await app.inject({
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsCommunitySentence}?${query.toString()}`
    })

    expect(response.statusCode).toBe(200)

    const json = response.json() as CaseForBailsReportDto[]

    expect(json).toHaveLength(1)
  })

  it("returns correct information when only trigger 31 present", async () => {
    const courtDate = subDays(new Date(), 3)
    const messageReceivedAt = subDays(new Date(), 2)

    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])
    const [caseObj] = await createCases(testDatabaseGateway, 3, {
      0: { courtDate, messageReceivedAt },
      1: { courtDate, messageReceivedAt },
      2: { courtDate, messageReceivedAt }
    })
    await createTriggers(testDatabaseGateway, caseObj.errorId, [{ triggerCode: TriggerCode.TRPR0031 }])

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 7).toISOString())
    query.append("toDate", new Date().toISOString())

    const response = await app.inject({
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsCommunitySentence}?${query.toString()}`
    })

    expect(response.statusCode).toBe(200)

    const json = response.json() as CommunitySentenceReportDto[]
    const reportItem = json[0]

    expect(reportItem).toEqual(
      expect.objectContaining({
        dateOfBirth: "11/11/1948",
        defendantName: caseObj.defendantName,
        domesticViolenceFlag: false,
        pncId: "2000/0448754K",
        receivedDate: formatInTimeZone(caseObj.messageReceivedAt, "Europe/London", "dd/MM/yyyy HH:mm")
      })
    )
  })

  it("returns correct information when trigger 31 and trigger 23 and 24 present", async () => {
    const courtDate = subDays(new Date(), 3)
    const messageReceivedAt = subDays(new Date(), 2)

    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])
    const [caseObj] = await createCases(testDatabaseGateway, 3, {
      0: { courtDate, messageReceivedAt },
      1: { courtDate, messageReceivedAt },
      2: { courtDate, messageReceivedAt }
    })
    await createTriggers(testDatabaseGateway, caseObj.errorId, [
      { triggerCode: TriggerCode.TRPR0031 },
      { triggerCode: TriggerCode.TRPR0023 },
      { triggerCode: TriggerCode.TRPR0024 }
    ])

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 7).toISOString())
    query.append("toDate", new Date().toISOString())

    const response = await app.inject({
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsCommunitySentence}?${query.toString()}`
    })

    expect(response.statusCode).toBe(200)

    const json = response.json() as CommunitySentenceReportDto[]
    const reportItem = json[0]

    expect(reportItem).toEqual(
      expect.objectContaining({
        dateOfBirth: "11/11/1948",
        defendantName: caseObj.defendantName,
        domesticViolenceFlag: true,
        pncId: "2000/0448754K",
        receivedDate: formatInTimeZone(caseObj.messageReceivedAt, "Europe/London", "dd/MM/yyyy HH:mm")
      })
    )
  })

  it("validate domestic violence flags", async () => {
    const courtDate = subDays(new Date(), 3)
    const messageReceivedAt = subDays(new Date(), 2)

    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])
    const [caseObj1, caseObj2, caseObj3, caseObj4] = await createCases(testDatabaseGateway, 4, {
      0: { courtDate, messageReceivedAt },
      1: { courtDate, messageReceivedAt },
      2: { courtDate, messageReceivedAt },
      3: { courtDate, messageReceivedAt }
    })
    await createTriggers(testDatabaseGateway, caseObj1.errorId, [{ triggerCode: TriggerCode.TRPR0031 }])

    await createTriggers(testDatabaseGateway, caseObj2.errorId, [
      { triggerCode: TriggerCode.TRPR0031 },
      { triggerCode: TriggerCode.TRPR0023 }
    ])

    await createTriggers(testDatabaseGateway, caseObj3.errorId, [
      { triggerCode: TriggerCode.TRPR0031 },
      { triggerCode: TriggerCode.TRPR0024 }
    ])

    await createTriggers(testDatabaseGateway, caseObj4.errorId, [
      { triggerCode: TriggerCode.TRPR0031 },
      { triggerCode: TriggerCode.TRPR0023 },
      { triggerCode: TriggerCode.TRPR0024 }
    ])

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 7).toISOString())
    query.append("toDate", new Date().toISOString())

    const response = await app.inject({
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsCommunitySentence}?${query.toString()}`
    })

    expect(response.statusCode).toBe(200)

    const json = response.json() as CommunitySentenceReportDto[]
    expect(json).toHaveLength(4)

    expect(json[0].domesticViolenceFlag).toBe(false)
    expect(json[1].domesticViolenceFlag).toBe(true)
    expect(json[2].domesticViolenceFlag).toBe(true)
    expect(json[3].domesticViolenceFlag).toBe(true)
  })
})
