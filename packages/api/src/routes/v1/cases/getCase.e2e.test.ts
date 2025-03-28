import type { CaseDto } from "@moj-bichard7/common/types/Case"
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
import { mockInputApiAuditLog } from "../../../tests/helpers/mockAuditLogs"
import { SetupAppEnd2EndHelper } from "../../../tests/helpers/setupAppEnd2EndHelper"
import { createUserAndJwtToken, createUsers, generateJwtForUser } from "../../../tests/helpers/userHelper"
import createAuditLog from "../../../useCases/createAuditLog"
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
    const dummyCase = {
      annotated_msg: testAhoXml,
      asn: "1901ID0100000006148H",
      court_code: "ABC",
      court_date: new Date(),
      court_name: "Kingston Crown Court",
      court_reference: "ABC",
      create_ts: new Date(2025, 1, 1),
      defendant_name: "Defendant",
      error_count: 0,
      error_id: 0,
      error_locked_by_id: "user1",
      error_report: "HO100304||br7:ArrestSummonsNumber",
      error_status: 1,
      is_urgent: 1,
      message_id: "ABC-DEF",
      msg_received_ts: new Date(2025, 1, 1),
      org_for_police_filter: "01",
      phase: 1,
      ptiurn: "00112233",
      resolution_ts: new Date(2025, 1, 2),
      trigger_count: 1,
      trigger_locked_by_id: "user2",
      trigger_status: 1,
      updated_msg: testAhoXml
    }

    const testCase = await createCase(helper.postgres, dummyCase)

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", testCase.error_id.toString())}`, {
      headers: { Authorization: `Bearer ${encodedJwt}` },
      method: "GET"
    })

    expect(response.status).toBe(OK)
    const responseJson = (await response.json()) as CaseDto
    expect(responseJson.aho).toEqual(testAhoJsonStr)
    expect(responseJson.asn).toBe(testCase.asn)
    expect(responseJson.courtCode).toBe(testCase.court_code)
    expect(responseJson.courtDate).toBe(testCase.court_date?.toISOString())
    expect(responseJson.courtReference).toBe(testCase.court_reference)
    expect(responseJson.defendantName).toBe(testCase.defendant_name)
    expect(responseJson.errorId).toBe(testCase.error_id)
    expect(responseJson.errorLockedByUsername).toBe(testCase.error_locked_by_id)
    expect(responseJson.errorReport).toBe(testCase.error_report)
    expect(responseJson.errorStatus).toBe("Unresolved")
    expect(responseJson.isUrgent).toBe(testCase.is_urgent)
    expect(responseJson.orgForPoliceFilter).toBe(testCase.org_for_police_filter)
    expect(responseJson.phase).toBe(testCase.phase)
    expect(responseJson.ptiurn).toBe(testCase.ptiurn)
    expect(responseJson.resolutionTimestamp).toBe(testCase.resolution_ts?.toISOString())
    expect(responseJson.triggerCount).toBe(testCase.trigger_count)
    expect(responseJson.triggerLockedByUsername).toBe(testCase.trigger_locked_by_id)
    expect(responseJson.triggerStatus).toBe("Unresolved")
    expect(responseJson.updatedHearingOutcome).toEqual(testAhoJsonStr)
  })

  it("returns case data when user's visibleCourt matches and visibleForce doesn't match", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres)
    const dummyCase = {
      asn: "1901ID0100000006148H",
      court_code: "ABZ01",
      org_for_police_filter: "05",
      updated_msg: testAhoXml
    }

    const testCase = await createCase(helper.postgres, dummyCase)

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", testCase.error_id.toString())}`, {
      headers: { Authorization: `Bearer ${encodedJwt}` },
      method: "GET"
    })

    expect(response.status).toBe(OK)
    const responseJson = (await response.json()) as CaseDto
    expect(responseJson.asn).toBe(testCase.asn)
    expect(responseJson.courtCode).toBe(testCase.court_code)
  })

  it("returns errorLockedByUsername and errorLockedByUserFullName", async () => {
    const [user] = await createUsers(helper.postgres, 3)
    const jwtToken = await generateJwtForUser(user)

    const testCase = await createCase(helper.postgres, { error_locked_by_id: user.username })

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", testCase.error_id.toString())}`, {
      headers: { Authorization: `Bearer ${jwtToken}` },
      method: "GET"
    })

    expect(response.status).toBe(OK)
    const responseJson: CaseDto = (await response.json()) as CaseDto
    expect(responseJson.errorLockedByUsername).toBe(user.username)
    expect(responseJson.errorLockedByUserFullName).toBe("Forename1 Surname1")
  })

  it("returns triggerLockedByUsername and triggerLockedByUserFullName", async () => {
    const [user] = await createUsers(helper.postgres, 3)
    const jwtToken = await generateJwtForUser(user)

    const testCase = await createCase(helper.postgres, { trigger_locked_by_id: user.username })

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", testCase.error_id.toString())}`, {
      headers: { Authorization: `Bearer ${jwtToken}` },
      method: "GET"
    })

    expect(response.status).toBe(OK)
    const responseJson: CaseDto = (await response.json()) as CaseDto
    expect(responseJson.triggerLockedByUsername).toBe(user.username)
    expect(responseJson.triggerLockedByUserFullName).toBe("Forename1 Surname1")
  })

  it("locks exception to the current-user when the case is unlocked, has exceptions, and has error status unresolved", async () => {
    const messageId = randomUUID()
    const [user] = await createUsers(helper.postgres, 3)
    const jwtToken = await generateJwtForUser(user)

    const testCase = await createCase(helper.postgres, {
      error_count: 1,
      error_locked_by_id: null,
      error_status: 1,
      message_id: messageId,
      org_for_police_filter: "01"
    })

    const auditLog = mockInputApiAuditLog({ caseId: "1", messageId })
    const result = await createAuditLog(auditLog, helper.dynamo)
    expect(isError(result)).toBe(false)

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", testCase.error_id.toString())}`, {
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
    const jwtToken = await generateJwtForUser(user)

    const testCase = await createCase(helper.postgres, {
      message_id: messageId,
      org_for_police_filter: "01",
      trigger_count: 1,
      trigger_locked_by_id: null,
      trigger_status: 1
    })

    const auditLog = mockInputApiAuditLog({ caseId: "1", messageId })
    const result = await createAuditLog(auditLog, helper.dynamo)
    expect(isError(result)).toBe(false)

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", testCase.error_id.toString())}`, {
      headers: { Authorization: `Bearer ${jwtToken}` },
      method: "GET"
    })

    expect(response.status).toBe(OK)
    const responseJson: CaseDto = (await response.json()) as CaseDto
    expect(responseJson.triggerLockedByUsername).toBe(user.username)
  })

  const testCases = [
    {
      caseData: { error_count: 1, error_locked_by_id: "another_user", error_status: 1 },
      description: "doesn't lock exception to the current-user when the case is locked to another user",
      expectedErrorLockedByUsername: "another_user"
    },
    {
      caseData: { error_count: 0, error_locked_by_id: null, error_status: null },
      description: "doesn't lock exception when case does not have any exception",
      expectedErrorLockedByUsername: null
    },
    {
      caseData: { error_count: 1, error_locked_by_id: null, error_status: 2 },
      description: "doesn't lock exception when error status is resolved",
      expectedErrorLockedByUsername: null
    },
    {
      caseData: { error_count: 1, error_locked_by_id: null, error_status: 3 },
      description: "doesn't lock exception when error status is submitted",
      expectedErrorLockedByUsername: null
    },
    {
      caseData: { trigger_count: 1, trigger_locked_by_id: "another_user", trigger_status: 1 },
      description: "doesn't lock trigger to the current-user when the case is locked to another user",
      expectedTriggerLockedByUsername: "another_user"
    },
    {
      caseData: { trigger_count: 0, trigger_locked_by_id: null, trigger_status: null },
      description: "doesn't lock exception when case does not have any exception",
      expectedTriggerLockedByUsername: null
    },
    {
      caseData: { trigger_count: 1, trigger_locked_by_id: null, trigger_status: 2 },
      description: "doesn't lock exception when error status is resolved",
      expectedTriggerLockedByUsername: null
    },
    {
      caseData: { trigger_count: 1, trigger_locked_by_id: null, trigger_status: 3 },
      description: "doesn't lock exception when error status is submitted",
      expectedTriggerLockedByUsername: null
    }
  ]

  testCases.forEach(
    ({ caseData, description, expectedErrorLockedByUsername = null, expectedTriggerLockedByUsername = null }) => {
      it(`${description}`, async () => {
        const [user] = await createUsers(helper.postgres, 1)
        const jwtToken = await generateJwtForUser(user)

        const testCase = await createCase(helper.postgres, caseData)

        const response = await fetch(`${helper.address}${endpoint.replace(":caseId", testCase.error_id.toString())}`, {
          headers: { Authorization: `Bearer ${jwtToken}` },
          method: "GET"
        })

        expect(response.status).toBe(OK)
        const responseJson: CaseDto = (await response.json()) as CaseDto

        expect(responseJson.errorLockedByUsername).toBe(expectedErrorLockedByUsername)
        expect(responseJson.triggerLockedByUsername).toBe(expectedTriggerLockedByUsername)
      })
    }
  )

  it("should create a new audit log event when locking a case", async () => {
    const messageId = randomUUID()

    const [user] = await createUsers(helper.postgres, 3)
    const jwtToken = await generateJwtForUser(user)

    const testCase = await createCase(helper.postgres, {
      error_count: 1,
      error_locked_by_id: null,
      error_status: 1,
      message_id: messageId,
      org_for_police_filter: "01"
    })

    const auditLog = mockInputApiAuditLog({ caseId: "1", messageId })
    const result = await createAuditLog(auditLog, helper.dynamo)
    expect(isError(result)).toBe(false)

    const caseResult = await fetch(`${helper.address}${endpoint.replace(":caseId", testCase.error_id.toString())}`, {
      headers: { Authorization: `Bearer ${jwtToken}` },
      method: "GET"
    })

    expect(caseResult.status).toBe(OK)

    const auditLogJson = await new FetchById(helper.dynamo, messageId).fetch()

    expect(isError(auditLogJson)).toBe(false)
    expect(auditLogJson).toBeDefined()

    const auditLogObj = auditLogJson as OutputApiAuditLog

    expect(auditLogObj.events).toHaveLength(1)

    const auditLogEvent = auditLogObj.events?.[0]

    expect(auditLogEvent).toHaveProperty("eventCode", EventCode.ExceptionsLocked)
    expect(auditLogEvent).toHaveProperty("category", EventCategory.information)
    expect(auditLogEvent).toHaveProperty("eventSource", "Bichard New UI")
    expect(auditLogEvent).toHaveProperty("eventType", AuditLogEventLookup[EventCode.ExceptionsLocked])
    expect(auditLogEvent).toHaveProperty("user", user.username)
  })
})
