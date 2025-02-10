import type { FastifyInstance } from "fastify"

import { auditLogEventLookup as AuditLogEventLookup } from "@moj-bichard7/common/types/AuditLogEvent"
import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { isError } from "@moj-bichard7/common/types/Result"
import { randomUUID } from "crypto"

import type { OutputApiAuditLog } from "../../types/AuditLog"

import { createCase } from "../../tests/helpers/caseHelper"
import FakeLogger from "../../tests/helpers/fakeLogger"
import { mockInputApiAuditLog } from "../../tests/helpers/mockAuditLogs"
import { SetupAppEnd2EndHelper } from "../../tests/helpers/setupAppEnd2EndHelper"
import { createUsers } from "../../tests/helpers/userHelper"
import createAuditLog from "../createAuditLog"
import FetchById from "../fetchAuditLogs/FetchById"
import { lockAndFetchCase } from "./lockAndFetchCase"

describe("lockAndFetchCase e2e", () => {
  const messageId = randomUUID()
  const fakeLogger = new FakeLogger()

  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app
    helper.postgres.forceIds = [1]
  })

  beforeEach(async () => {
    await helper.postgres.clearDb()
    await helper.dynamo.clearDynamo()

    await createAuditLog(mockInputApiAuditLog({ caseId: "1", messageId }), helper.dynamo)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    await app.close()
    await helper.postgres.close()
  })

  it("locks the exceptions, creates an audit log event and fetches the updated case", async () => {
    await createCase(helper.postgres, {
      error_count: 1,
      error_status: 1,
      message_id: messageId
    })

    const caseId = 1
    const [user] = await createUsers(helper.postgres, 1)

    jest.spyOn(fakeLogger, "error")

    const caseResult = await lockAndFetchCase(helper.postgres, helper.dynamo, caseId, user, fakeLogger)

    expect(fakeLogger.error).not.toHaveBeenCalled()

    expect(caseResult.error_locked_by_id).toBe(user.username)
    expect(caseResult.error_locked_by_fullname).toBe(`${user.forenames} ${user.surname}`)

    const auditLogJson = await new FetchById(helper.dynamo, messageId).fetch()

    expect(isError(auditLogJson)).toBe(false)

    const auditLogObj = auditLogJson as OutputApiAuditLog

    expect(auditLogObj.events).toHaveLength(1)

    const auditLogEvent = auditLogObj.events?.[0]

    expect(auditLogEvent).toHaveProperty("eventCode", EventCode.ExceptionsLocked)
    expect(auditLogEvent).toHaveProperty("category", EventCategory.information)
    expect(auditLogEvent).toHaveProperty("eventSource", "Bichard New UI")
    expect(auditLogEvent).toHaveProperty("eventType", AuditLogEventLookup[EventCode.ExceptionsLocked])
    expect(auditLogEvent).toHaveProperty("user", user.username)
  })

  it("locks the triggers, creates an audit log event and fetches the updated case", async () => {
    await createCase(helper.postgres, {
      message_id: messageId,
      trigger_count: 1,
      trigger_status: 1
    })

    const caseId = 1
    const [user] = await createUsers(helper.postgres, 1)

    jest.spyOn(fakeLogger, "error")

    const caseResult = await lockAndFetchCase(helper.postgres, helper.dynamo, caseId, user, fakeLogger)

    expect(fakeLogger.error).not.toHaveBeenCalled()

    expect(caseResult.trigger_locked_by_id).toBe(user.username)
    expect(caseResult.trigger_locked_by_fullname).toBe(`${user.forenames} ${user.surname}`)

    const auditLogJson = await new FetchById(helper.dynamo, messageId).fetch()

    expect(isError(auditLogJson)).toBe(false)

    const auditLogObj = auditLogJson as OutputApiAuditLog

    expect(auditLogObj.events).toHaveLength(1)

    const auditLogEvent = auditLogObj.events?.[0]

    expect(auditLogEvent).toHaveProperty("eventCode", EventCode.TriggersLocked)
    expect(auditLogEvent).toHaveProperty("category", EventCategory.information)
    expect(auditLogEvent).toHaveProperty("eventSource", "Bichard New UI")
    expect(auditLogEvent).toHaveProperty("eventType", AuditLogEventLookup[EventCode.TriggersLocked])
    expect(auditLogEvent).toHaveProperty("user", user.username)
  })

  it("does not update the case record and audit log when postgres throws an error, and fetches the case", async () => {
    await createCase(helper.postgres, {
      error_count: 1,
      error_status: 1,
      message_id: messageId
    })

    const caseId = 1
    const [user] = await createUsers(helper.postgres, 1)

    jest.spyOn(fakeLogger, "error")
    jest.spyOn(helper.postgres, "lockCase").mockRejectedValue(new Error())

    const caseResult = await lockAndFetchCase(helper.postgres, helper.dynamo, caseId, user, fakeLogger)

    expect(fakeLogger.error).toHaveBeenCalled()

    expect(caseResult.error_locked_by_id).toBeNull()
    expect(caseResult.error_locked_by_fullname).toBeNull()

    const auditLogJson = await new FetchById(helper.dynamo, messageId).fetch()

    expect(isError(auditLogJson)).toBe(false)

    const auditLogObj = auditLogJson as OutputApiAuditLog

    expect(auditLogObj.events).toHaveLength(0)
  })

  it("does not update the case record when audit log fails, and fetches the case", async () => {
    await createCase(helper.postgres, {
      error_count: 1,
      error_status: 1,
      message_id: messageId
    })

    const caseId = 1
    const [user] = await createUsers(helper.postgres, 1)

    jest.spyOn(fakeLogger, "error")
    jest.spyOn(helper.dynamo, "fetchOne").mockRejectedValue(new Error())

    const caseResult = await lockAndFetchCase(helper.postgres, helper.dynamo, caseId, user, fakeLogger)

    expect(fakeLogger.error).toHaveBeenCalled()

    expect(caseResult.error_locked_by_id).toBeNull()
    expect(caseResult.error_locked_by_fullname).toBeNull()
  })
})
