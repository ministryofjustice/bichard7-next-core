import type { Case, CaseDto } from "@moj-bichard7/common/types/Case"
import type { FastifyInstance } from "fastify"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { auditLogEventLookup as AuditLogEventLookup } from "@moj-bichard7/common/types/AuditLogEvent"
import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { isError } from "@moj-bichard7/common/types/Result"
import { randomUUID } from "crypto"
import { OK } from "http-status"

import type { OutputApiAuditLog } from "../../../types/AuditLog"

import { testAhoJsonStr, testAhoXml } from "../../../tests/helpers/ahoHelper"
import { createCase } from "../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../tests/helpers/setupAppEnd2EndHelper"
import { createUser, createUserAndJwtToken, createUsers, generateJwtForUser } from "../../../tests/helpers/userHelper"
import { ResolutionStatusNumber } from "../../../useCases/dto/convertResolutionStatus"
import FetchById from "../../../useCases/fetchAuditLogs/FetchById"

describe("/v1/case e2e", () => {
  const endpoint = V1.Case
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app
  })

  beforeEach(async () => {
    await helper.postgres.clearDb()
    await helper.dynamo.clearDynamo()
  })

  afterAll(async () => {
    await app.close()
    await helper.postgres.close()
  })

  it("returns case data", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres)
    const dummyCase: Partial<Case> = {
      aho: testAhoXml,
      asn: "1901ID0100000006148H",
      courtCode: "ABC",
      courtDate: new Date(),
      courtName: "Kingston Crown Court",
      courtReference: "ABC",
      createdAt: new Date(2025, 1, 1),
      defendantName: "Defendant",
      errorCount: 0,
      errorId: 0,
      errorLockedById: "user1",
      errorReport: "HO100304||br7:ArrestSummonsNumber",
      errorStatus: ResolutionStatusNumber.Unresolved,
      isUrgent: 1,
      messageId: "ABC-DEF",
      messageReceivedAt: new Date(2025, 1, 1),
      orgForPoliceFilter: "",
      phase: 1,
      ptiurn: "00112233",
      resolutionAt: new Date(2025, 1, 2),
      triggerCount: 1,
      triggerLockedById: "user2",
      triggerStatus: ResolutionStatusNumber.Unresolved,
      updatedAho: testAhoXml
    }

    const testCase = await createCase(helper.postgres, dummyCase)

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", testCase.errorId.toString())}`, {
      headers: { Authorization: `Bearer ${encodedJwt}` },
      method: "GET"
    })

    expect(response.status).toBe(OK)
    const responseJson = (await response.json()) as CaseDto
    expect(responseJson.aho).toEqual(testAhoJsonStr)
    expect(responseJson.asn).toBe(testCase.asn)
    expect(responseJson.courtCode).toBe(testCase.courtCode)
    expect(responseJson.courtDate).toBe(testCase.courtDate?.toISOString())
    expect(responseJson.courtReference).toBe(testCase.courtReference)
    expect(responseJson.defendantName).toBe(testCase.defendantName)
    expect(responseJson.errorId).toBe(testCase.errorId)
    expect(responseJson.errorLockedByUsername).toBe(testCase.errorLockedById)
    expect(responseJson.errorReport).toBe(testCase.errorReport)
    expect(responseJson.errorStatus).toBe("Unresolved")
    expect(responseJson.isUrgent).toBe(testCase.isUrgent)
    expect(responseJson.orgForPoliceFilter).toEqual(testCase.orgForPoliceFilter)
    expect(responseJson.phase).toBe(testCase.phase)
    expect(responseJson.ptiurn).toBe(testCase.ptiurn)
    expect(responseJson.resolutionTimestamp).toBe(testCase.resolutionAt?.toISOString())
    expect(responseJson.triggerCount).toBe(testCase.triggerCount)
    expect(responseJson.triggerLockedByUsername).toBe(testCase.triggerLockedById)
    expect(responseJson.triggerStatus).toBe("Unresolved")
    expect(responseJson.updatedHearingOutcome).toEqual(testAhoJsonStr)
  })

  it("returns case data when user's visibleCourt matches and visibleForce doesn't match", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres)
    const dummyCase: Partial<Case> = {
      asn: "1901ID0100000006148H",
      courtCode: "ABZ01",
      orgForPoliceFilter: "05",
      updatedAho: testAhoXml
    }

    const testCase = await createCase(helper.postgres, dummyCase)

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", testCase.errorId.toString())}`, {
      headers: { Authorization: `Bearer ${encodedJwt}` },
      method: "GET"
    })

    expect(response.status).toBe(OK)
    const responseJson = (await response.json()) as CaseDto
    expect(responseJson.asn).toBe(testCase.asn)
    expect(responseJson.courtCode).toBe(testCase.courtCode)
  })

  it("returns errorLockedByUsername and errorLockedByUserFullName", async () => {
    const user = await createUser(helper.postgres)
    const expectedFullName = `${user.forenames} ${user.surname}`
    const jwtToken = generateJwtForUser(user)

    const testCase = await createCase(helper.postgres, { errorLockedById: user.username })

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", testCase.errorId.toString())}`, {
      headers: { Authorization: `Bearer ${jwtToken}` },
      method: "GET"
    })

    expect(response.status).toBe(OK)
    const responseJson: CaseDto = (await response.json()) as CaseDto
    expect(responseJson.errorLockedByUsername).toBe(user.username)
    expect(responseJson.errorLockedByUserFullName).toBe(expectedFullName)
  })

  it("returns triggerLockedByUsername and triggerLockedByUserFullName", async () => {
    const [user] = await createUsers(helper.postgres, 3)
    const expectedFullName = `${user.forenames} ${user.surname}`
    const jwtToken = generateJwtForUser(user)

    const testCase = await createCase(helper.postgres, { triggerLockedById: user.username })

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", testCase.errorId.toString())}`, {
      headers: { Authorization: `Bearer ${jwtToken}` },
      method: "GET"
    })

    expect(response.status).toBe(OK)
    const responseJson: CaseDto = (await response.json()) as CaseDto
    expect(responseJson.triggerLockedByUsername).toBe(user.username)
    expect(responseJson.triggerLockedByUserFullName).toBe(expectedFullName)
  })

  it("locks exception to the current-user when the case is unlocked, has exceptions, and has error status unresolved", async () => {
    const messageId = randomUUID()
    const [user] = await createUsers(helper.postgres, 3)
    const jwtToken = generateJwtForUser(user)

    const testCase = await createCase(helper.postgres, {
      errorCount: 1,
      errorLockedById: null,
      errorStatus: ResolutionStatusNumber.Unresolved,
      messageId: messageId,
      orgForPoliceFilter: "01"
    })

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", testCase.errorId.toString())}`, {
      headers: { Authorization: `Bearer ${jwtToken}` },
      method: "GET"
    })

    expect(response.status).toBe(OK)
    const responseJson: CaseDto = (await response.json()) as CaseDto
    expect(responseJson.errorLockedByUsername).toBe(user.username)
  })

  it("locks trigger to the current-user when the case is unlocked, has triggers, and has trigger status unresolved", async () => {
    const messageId = randomUUID()
    const [user] = await createUsers(helper.postgres, 3)
    const jwtToken = generateJwtForUser(user)

    const testCase = await createCase(helper.postgres, {
      messageId: messageId,
      orgForPoliceFilter: "01",
      triggerCount: 1,
      triggerLockedById: null,
      triggerStatus: ResolutionStatusNumber.Unresolved
    })

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", testCase.errorId.toString())}`, {
      headers: { Authorization: `Bearer ${jwtToken}` },
      method: "GET"
    })

    expect(response.status).toBe(OK)
    const responseJson: CaseDto = (await response.json()) as CaseDto
    expect(responseJson.triggerLockedByUsername).toBe(user.username)
  })

  const testCases = [
    {
      caseData: { errorCount: 1, errorLockedById: "another_user", errorStatus: ResolutionStatusNumber.Unresolved },
      description: "doesn't lock exception to the current-user when the case is locked to another user",
      expectedErrorLockedByUsername: "another_user"
    },
    {
      caseData: { errorCount: 0, errorLockedById: null, errorStatus: null },
      description: "doesn't lock exception when case does not have any exception",
      expectedErrorLockedByUsername: null
    },
    {
      caseData: { errorCount: 1, errorLockedById: null, errorStatus: ResolutionStatusNumber.Resolved },
      description: "doesn't lock exception when error status is resolved",
      expectedErrorLockedByUsername: null
    },
    {
      caseData: { errorCount: 1, errorLockedById: null, errorStatus: ResolutionStatusNumber.Submitted },
      description: "doesn't lock exception and trigger when error status is submitted",
      expectedErrorLockedByUsername: null
    },
    {
      caseData: {
        triggerCount: 1,
        triggerLockedById: "another_user",
        triggerStatus: ResolutionStatusNumber.Unresolved
      },
      description: "doesn't lock trigger to the current-user when the case is locked to another user",
      expectedTriggerLockedByUsername: "another_user"
    },
    {
      caseData: { triggerCount: 0, triggerLockedById: null, triggerStatus: null },
      description: "doesn't lock exception when case does not have any exception",
      expectedTriggerLockedByUsername: null
    },
    {
      caseData: { triggerCount: 1, triggerLockedById: null, triggerStatus: ResolutionStatusNumber.Resolved },
      description: "doesn't lock exception when error status is resolved",
      expectedTriggerLockedByUsername: null
    },
    {
      caseData: { triggerCount: 1, triggerLockedById: null, triggerStatus: ResolutionStatusNumber.Submitted },
      description: "doesn't lock exception when error status is submitted",
      expectedTriggerLockedByUsername: null
    }
  ]

  it.each(testCases)(
    "$description",
    async ({ caseData, expectedErrorLockedByUsername = "User1", expectedTriggerLockedByUsername = "User1" }) => {
      const user = await createUser(helper.postgres, { username: "User1" })
      const jwtToken = generateJwtForUser(user)

      const testCase = await createCase(helper.postgres, caseData)

      const response = await fetch(`${helper.address}${endpoint.replace(":caseId", testCase.errorId.toString())}`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
        method: "GET"
      })

      expect(response.status).toBe(OK)
      const responseJson: CaseDto = (await response.json()) as CaseDto

      expect(responseJson.errorLockedByUsername).toBe(expectedErrorLockedByUsername)
      expect(responseJson.triggerLockedByUsername).toBe(expectedTriggerLockedByUsername)
    }
  )

  it("should create new audit log events when locking a case", async () => {
    const messageId = randomUUID()

    const [user] = await createUsers(helper.postgres, 3)
    const jwtToken = generateJwtForUser(user)

    const testCase = await createCase(helper.postgres, {
      errorCount: 1,
      errorLockedById: null,
      errorStatus: ResolutionStatusNumber.Unresolved,
      messageId: messageId,
      orgForPoliceFilter: "01"
    })

    const caseResult = await fetch(`${helper.address}${endpoint.replace(":caseId", testCase.errorId.toString())}`, {
      headers: { Authorization: `Bearer ${jwtToken}` },
      method: "GET"
    })

    expect(caseResult.status).toBe(OK)

    const auditLogJson = await new FetchById(helper.dynamo, messageId).fetch()

    expect(isError(auditLogJson)).toBe(false)
    expect(auditLogJson).toBeDefined()

    const auditLogObj = auditLogJson as OutputApiAuditLog

    expect(auditLogObj.events).toHaveLength(2)

    const [exceptionAuditLogEvent, triggerAuditLogEvent] = auditLogObj.events!

    expect(exceptionAuditLogEvent).toHaveProperty("eventCode", EventCode.ExceptionsLocked)
    expect(exceptionAuditLogEvent).toHaveProperty("category", EventCategory.information)
    expect(exceptionAuditLogEvent).toHaveProperty("eventSource", "Bichard New UI")
    expect(exceptionAuditLogEvent).toHaveProperty("eventType", AuditLogEventLookup[EventCode.ExceptionsLocked])
    expect(exceptionAuditLogEvent).toHaveProperty("user", user.username)

    expect(triggerAuditLogEvent).toHaveProperty("eventCode", EventCode.TriggersLocked)
    expect(triggerAuditLogEvent).toHaveProperty("category", EventCategory.information)
    expect(triggerAuditLogEvent).toHaveProperty("eventSource", "Bichard New UI")
    expect(triggerAuditLogEvent).toHaveProperty("eventType", AuditLogEventLookup[EventCode.TriggersLocked])
    expect(triggerAuditLogEvent).toHaveProperty("user", user.username)
  })
})
