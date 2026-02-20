import type { CaseForDomesticViolenceReportDto } from "@moj-bichard7/common/contracts/DomesticViolenceReport"
import type { FastifyInstance } from "fastify"

import { expect } from "@jest/globals"
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { addDays, subDays } from "date-fns"
import { BAD_REQUEST, FORBIDDEN, OK } from "http-status"
import { uniq } from "lodash"

import type { AuditLogDynamoGateway } from "../../../../services/gateways/dynamo"

import build from "../../../../app"
import { createCases } from "../../../../tests/helpers/caseHelper"
import { createTriggers } from "../../../../tests/helpers/triggerHelper"
import { createUserAndJwtToken } from "../../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../../tests/testGateways/e2ePostgres"

describe("domestic violence report", () => {
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
      url: V1.CasesReportsDomesticViolence
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
      url: `${V1.CasesReportsDomesticViolence}?${query.toString()}`
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
      url: `${V1.CasesReportsDomesticViolence}?${query.toString()}`
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
      headers: { authorization: "Bearer {{ token }}".replace("{{ token }}", jwt) },
      method: "GET",
      url: `${V1.CasesReportsDomesticViolence}?${query.toString()}`
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
      headers: { authorization: "Bearer {{ token }}".replace("{{ token }}", jwt) },
      method: "GET",
      url: `${V1.CasesReportsDomesticViolence}?${query.toString()}`
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toHaveLength(0)
  })

  it("returns 0 cases when case does have a trigger but not a DV trigger", async () => {
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
      headers: { authorization: "Bearer {{ token }}".replace("{{ token }}", jwt) },
      method: "GET",
      url: `${V1.CasesReportsDomesticViolence}?${query.toString()}`
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toHaveLength(0)
  })

  it("returns 1 cases when case does have a DV trigger", async () => {
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
    query.append("exceptions", "true")
    query.append("triggers", "true")

    const response = await app.inject({
      headers: { authorization: "Bearer {{ token }}".replace("{{ token }}", jwt) },
      method: "GET",
      url: `${V1.CasesReportsDomesticViolence}?${query.toString()}`
    })

    expect(response.statusCode).toBe(200)

    const json = response.json() as CaseForDomesticViolenceReportDto[]

    expect(json).toHaveLength(3)
    expect(uniq(json.map((caseReportItem) => caseReportItem.asn))).toHaveLength(1)
  })

  it("returns correct type for PR23", async () => {
    const courtDate = subDays(new Date(), 3)
    const messageReceivedAt = subDays(new Date(), 2)

    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])
    const [caseObj] = await createCases(testDatabaseGateway, 3, {
      0: { courtDate, messageReceivedAt }
    })
    await createTriggers(testDatabaseGateway, caseObj.errorId, [{ triggerCode: TriggerCode.TRPR0023 }])

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 7).toISOString())
    query.append("toDate", new Date().toISOString())
    query.append("exceptions", "true")
    query.append("triggers", "true")

    const response = await app.inject({
      headers: { authorization: "Bearer {{ token }}".replace("{{ token }}", jwt) },
      method: "GET",
      url: `${V1.CasesReportsDomesticViolence}?${query.toString()}`
    })

    expect(response.statusCode).toBe(200)

    const reportItems = response.json() as CaseForDomesticViolenceReportDto[]

    expect(reportItems).toHaveLength(3)

    for (const reportItem of reportItems) {
      expect(reportItem.type).toBe("Domestic Violence")
    }
  })

  it("returns correct type PR24", async () => {
    const courtDate = subDays(new Date(), 3)
    const messageReceivedAt = subDays(new Date(), 2)

    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])
    const [caseObj] = await createCases(testDatabaseGateway, 3, {
      0: { courtDate, messageReceivedAt }
    })
    await createTriggers(testDatabaseGateway, caseObj.errorId, [{ triggerCode: TriggerCode.TRPR0024 }])

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 7).toISOString())
    query.append("toDate", new Date().toISOString())
    query.append("exceptions", "true")
    query.append("triggers", "true")

    const response = await app.inject({
      headers: { authorization: "Bearer {{ token }}".replace("{{ token }}", jwt) },
      method: "GET",
      url: `${V1.CasesReportsDomesticViolence}?${query.toString()}`
    })

    expect(response.statusCode).toBe(200)

    const reportItems = response.json() as CaseForDomesticViolenceReportDto[]

    expect(reportItems).toHaveLength(3)

    for (const reportItem of reportItems) {
      expect(reportItem.type).toBe("Vulnerable Victim")
    }
  })

  it("returns correct type for PR23 and PR24", async () => {
    const courtDate = subDays(new Date(), 3)
    const messageReceivedAt = subDays(new Date(), 2)

    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])
    const [caseObj] = await createCases(testDatabaseGateway, 3, {
      0: { courtDate, messageReceivedAt }
    })
    await createTriggers(testDatabaseGateway, caseObj.errorId, [
      { triggerCode: TriggerCode.TRPR0023 },
      { triggerCode: TriggerCode.TRPR0024 }
    ])

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 7).toISOString())
    query.append("toDate", new Date().toISOString())
    query.append("exceptions", "true")
    query.append("triggers", "true")

    const response = await app.inject({
      headers: { authorization: "Bearer {{ token }}".replace("{{ token }}", jwt) },
      method: "GET",
      url: `${V1.CasesReportsDomesticViolence}?${query.toString()}`
    })

    expect(response.statusCode).toBe(200)

    const reportItems = response.json() as CaseForDomesticViolenceReportDto[]

    expect(reportItems).toHaveLength(3)

    for (const reportItem of reportItems) {
      expect(reportItem.type).toBe("Domestic Violence")
    }
  })

  it("returns correct columns", async () => {
    const courtDate = subDays(new Date(), 3)
    const messageReceivedAt = subDays(new Date(), 2)

    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])
    const [caseObj] = await createCases(testDatabaseGateway, 3, {
      0: { courtDate, messageReceivedAt }
    })
    await createTriggers(testDatabaseGateway, caseObj.errorId, [{ triggerCode: TriggerCode.TRPR0024 }])

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 7).toISOString())
    query.append("toDate", new Date().toISOString())
    query.append("exceptions", "true")
    query.append("triggers", "true")

    const response = await app.inject({
      headers: { authorization: "Bearer {{ token }}".replace("{{ token }}", jwt) },
      method: "GET",
      url: `${V1.CasesReportsDomesticViolence}?${query.toString()}`
    })

    expect(response.statusCode).toBe(200)

    const reportItems = response.json() as CaseForDomesticViolenceReportDto[]

    expect(reportItems).toHaveLength(3)

    for (const reportItem of reportItems) {
      expect(Object.keys(reportItem)).toHaveLength(9)

      expect(reportItem).toHaveProperty("asn")
      expect(reportItem).toHaveProperty("courtName")
      expect(reportItem).toHaveProperty("dateOfBirth")
      expect(reportItem).toHaveProperty("defendantName")
      expect(reportItem).toHaveProperty("hearingDate")
      expect(reportItem).toHaveProperty("offenceTitle")
      expect(reportItem).toHaveProperty("outcome")
      expect(reportItem).toHaveProperty("ptiurn")
      expect(reportItem).toHaveProperty("type")
    }
  })
})
