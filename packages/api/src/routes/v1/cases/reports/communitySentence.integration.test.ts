import type { CaseForBailsReportDto } from "@moj-bichard7/common/types/reports/Bails"
import type { CommunitySentenceReportDto } from "@moj-bichard7/common/types/reports/CommunitySentence"
import type { FastifyInstance } from "fastify"

import { expect } from "@jest/globals"
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { addDays, subDays } from "date-fns"
import { BAD_REQUEST, FORBIDDEN, OK } from "http-status"

import build from "../../../../app"
import { AuditLogDynamoGateway } from "../../../../services/gateways/dynamo"
import testCommunitySentenceOrderAhoXml from "../../../../tests/fixtures/AnnotatedHOCommunityOrder.json"
import testSuspendedSentenceOrderAhoXml from "../../../../tests/fixtures/AnnotatedHOSuspendedSentence.json"
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

  const buildQueryString = (
    overrides: { fromDate?: Date; policeForceAreaCodes?: string; resultCodes?: string[]; toDate?: Date } = {}
  ) => {
    const query = new URLSearchParams()
    query.append("fromDate", (overrides.fromDate ?? subDays(new Date(), 7)).toISOString())
    query.append("toDate", (overrides.toDate ?? new Date()).toISOString())
    query.append("policeForceAreaCodes", overrides.policeForceAreaCodes ?? "E23000001")

    if (overrides.resultCodes) {
      overrides.resultCodes.forEach((code) => query.append("resultCodes", code))
    }

    return query.toString()
  }

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

  it("succeeds with required params", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])
    const queryString = buildQueryString({ fromDate: new Date() })

    const { statusCode } = await app.inject({
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsCommunitySentence}?${queryString}`
    })

    expect(statusCode).toBe(OK)
  })

  it("succeeds with optional result code param", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])
    const queryString = buildQueryString({ fromDate: new Date(), resultCodes: ["1030"] })

    const { statusCode } = await app.inject({
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsCommunitySentence}?${queryString}`
    })

    expect(statusCode).toBe(OK)
  })

  it("succeeds with multiple result code params", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])
    const queryString = buildQueryString({ fromDate: new Date(), resultCodes: ["1030", "1032"] })

    const { statusCode } = await app.inject({
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsCommunitySentence}?${queryString}`
    })

    expect(statusCode).toBe(OK)
  })

  it("fails with a non trigger 31 result code param", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])
    const queryString = buildQueryString({ fromDate: new Date(), resultCodes: ["1234"] })

    const { statusCode } = await app.inject({
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsCommunitySentence}?${queryString}`
    })

    expect(statusCode).toBe(BAD_REQUEST)
  })

  it("fails with the wrong permissions", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.GeneralHandler])
    const queryString = buildQueryString({ fromDate: new Date() })

    const { statusCode } = await app.inject({
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsCommunitySentence}?${queryString}`
    })

    expect(statusCode).toBe(FORBIDDEN)
  })

  it("fails if the fromDate is before the toDate", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])
    const queryString = buildQueryString({ fromDate: addDays(new Date(), 1) })

    const { statusCode } = await app.inject({
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsCommunitySentence}?${queryString}`
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

    const queryString = buildQueryString()

    const response = await app.inject({
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsCommunitySentence}?${queryString}`
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

    const queryString = buildQueryString()

    const response = await app.inject({
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsCommunitySentence}?${queryString}`
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toHaveLength(0)
  })

  it("returns 0 cases when case does have a domestic violence trigger but not a trigger 31", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])
    const [caseObj] = await createCases(testDatabaseGateway, 3, {
      0: { courtDate: subDays(new Date(), 2), messageReceivedAt: subDays(new Date(), 2) },
      1: { courtDate: subDays(new Date(), 2), messageReceivedAt: subDays(new Date(), 2) },
      2: { courtDate: subDays(new Date(), 2), messageReceivedAt: subDays(new Date(), 2) }
    })
    await createTriggers(testDatabaseGateway, caseObj.errorId, [{ triggerCode: TriggerCode.TRPR0023 }])

    const queryString = buildQueryString()

    const response = await app.inject({
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsCommunitySentence}?${queryString}`
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toHaveLength(0)
  })

  it("returns 1 case when case does have a trigger 31, other result codes not included in report", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])
    const [caseObj] = await createCases(testDatabaseGateway, 3, {
      0: {
        aho: testSuspendedSentenceOrderAhoXml.hearingOutcomeXml,
        courtDate: subDays(new Date(), 2),
        messageReceivedAt: subDays(new Date(), 2),
        policeForceArea: "E23000001"
      },
      1: {
        courtDate: subDays(new Date(), 2),
        messageReceivedAt: subDays(new Date(), 2),
        policeForceArea: "E23000001"
      },
      2: {
        courtDate: subDays(new Date(), 2),
        messageReceivedAt: subDays(new Date(), 2),
        policeForceArea: "E23000001"
      }
    })
    await createTriggers(testDatabaseGateway, caseObj.errorId, [{ triggerCode: TriggerCode.TRPR0031 }])

    const queryString = buildQueryString()

    const response = await app.inject({
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsCommunitySentence}?${queryString}`
    })

    expect(response.statusCode).toBe(200)

    const json = response.json() as CaseForBailsReportDto[]

    expect(json).toHaveLength(1)
  })

  it("returns 1 case when matching result code is provided", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])
    const [caseObj] = await createCases(testDatabaseGateway, 3, {
      0: {
        aho: testSuspendedSentenceOrderAhoXml.hearingOutcomeXml,
        courtDate: subDays(new Date(), 2),
        messageReceivedAt: subDays(new Date(), 2),
        policeForceArea: "E23000001"
      }
    })
    await createTriggers(testDatabaseGateway, caseObj.errorId, [{ triggerCode: TriggerCode.TRPR0031 }])

    const queryString = buildQueryString({ resultCodes: ["1115"] })

    const response = await app.inject({
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsCommunitySentence}?${queryString}`
    })

    expect(response.statusCode).toBe(200)

    const json = response.json() as CaseForBailsReportDto[]

    expect(json).toHaveLength(1)
  })

  it("returns 0 cases when provided result code does not match", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])
    const [caseObj] = await createCases(testDatabaseGateway, 3, {
      0: {
        aho: testSuspendedSentenceOrderAhoXml.hearingOutcomeXml,
        courtDate: subDays(new Date(), 2),
        messageReceivedAt: subDays(new Date(), 2),
        policeForceArea: "E23000001"
      }
    })
    await createTriggers(testDatabaseGateway, caseObj.errorId, [{ triggerCode: TriggerCode.TRPR0031 }])

    const queryString = buildQueryString({ resultCodes: ["1030"] })

    const response = await app.inject({
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsCommunitySentence}?${queryString}`
    })

    expect(response.statusCode).toBe(200)

    const json = response.json() as CaseForBailsReportDto[]

    expect(json).toHaveLength(0)
  })

  it("returns correct information when only trigger 31 present, suspended sentence order codes not present", async () => {
    const courtDate = subDays(new Date(), 3)
    const messageReceivedAt = subDays(new Date(), 2)

    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])
    const [caseObj] = await createCases(testDatabaseGateway, 3, {
      0: {
        aho: testCommunitySentenceOrderAhoXml.hearingOutcomeXml,
        courtDate,
        messageReceivedAt,
        policeForceArea: "E23000001"
      },
      1: { courtDate, messageReceivedAt, policeForceArea: "E23000001" },
      2: { courtDate, messageReceivedAt, policeForceArea: "E23000001" }
    })
    await createTriggers(testDatabaseGateway, caseObj.errorId, [{ triggerCode: TriggerCode.TRPR0031 }])

    const queryString = buildQueryString()

    const response = await app.inject({
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsCommunitySentence}?${queryString}`
    })

    expect(response.statusCode).toBe(200)

    const json = response.json() as CommunitySentenceReportDto[]
    expect(json).toHaveLength(1)
    const reportItem = json[0]

    expect(reportItem).not.toHaveProperty("custodialSentenceDuration")
    expect(reportItem).not.toHaveProperty("expiryOfSentence")
    expect(reportItem).not.toHaveProperty("suspendedSentenceDuration")
  })

  it("returns correct domestic violence flags", async () => {
    const courtDate = subDays(new Date(), 3)
    const messageReceivedAt = subDays(new Date(), 2)

    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])
    const [caseObj1, caseObj2, caseObj3, caseObj4] = await createCases(testDatabaseGateway, 4, {
      0: {
        aho: testSuspendedSentenceOrderAhoXml.hearingOutcomeXml,
        courtDate,
        messageReceivedAt,
        policeForceArea: "E23000001"
      },
      1: {
        aho: testSuspendedSentenceOrderAhoXml.hearingOutcomeXml,
        courtDate,
        messageReceivedAt,
        policeForceArea: "E23000001"
      },
      2: {
        aho: testSuspendedSentenceOrderAhoXml.hearingOutcomeXml,
        courtDate,
        messageReceivedAt,
        policeForceArea: "E23000001"
      },
      3: {
        aho: testSuspendedSentenceOrderAhoXml.hearingOutcomeXml,
        courtDate,
        messageReceivedAt,
        policeForceArea: "E23000001"
      }
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

    const queryString = buildQueryString()

    const response = await app.inject({
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsCommunitySentence}?${queryString}`
    })

    expect(response.statusCode).toBe(200)

    const json = response.json() as CommunitySentenceReportDto[]
    expect(json).toHaveLength(4)

    expect(json[0].domesticViolenceFlag).toBe("No")
    expect(json[1].domesticViolenceFlag).toBe("Yes")
    expect(json[2].domesticViolenceFlag).toBe("Yes")
    expect(json[3].domesticViolenceFlag).toBe("Yes")
  })

  it("returns correct sentence duration and expiry date when result codes include suspended sentences", async () => {
    const courtDate = subDays(new Date(), 3)
    const messageReceivedAt = subDays(new Date(), 2)

    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])
    const [caseObj] = await createCases(testDatabaseGateway, 1, {
      0: {
        aho: testSuspendedSentenceOrderAhoXml.hearingOutcomeXml,
        courtDate,
        messageReceivedAt,
        policeForceArea: "E23000001"
      }
    })
    await createTriggers(testDatabaseGateway, caseObj.errorId, [{ triggerCode: TriggerCode.TRPR0031 }])

    const queryString = buildQueryString()

    const response = await app.inject({
      headers: { authorization: `Bearer ${jwt}` },
      method: "GET",
      url: `${V1.CasesReportsCommunitySentence}?${queryString}`
    })

    expect(response.statusCode).toBe(200)

    const json = response.json() as CommunitySentenceReportDto[]
    expect(json).toHaveLength(1)
    expect(json[0].custodialSentenceDurationMonths).toBe("2 months")
    expect(json[0].suspendedSentenceDurationMonths).toBe("18 months")
    expect(json[0].expiryOfSentence).toBe("08/06/2025")
  })
})
