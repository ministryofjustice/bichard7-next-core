import type { CaseDto } from "@moj-bichard7/common/types/Case"
import type { AxiosRequestConfig } from "axios"
import type { FastifyInstance } from "fastify"

import EventCategory from "@moj-bichard7/common/types/EventCategory"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import axios, { HttpStatusCode } from "axios"
import { randomUUID } from "crypto"
import { OK } from "http-status"
import { isError } from "lodash"

import type { OutputApiAuditLog } from "../../../types/AuditLog"

import { V1 } from "../../../endpoints/versionedEndpoints"
import { createCase } from "../../../tests/helpers/caseHelper"
import auditLogDynamoConfig from "../../../tests/helpers/dynamoDbConfig"
import { generateTestJwtToken } from "../../../tests/helpers/jwtHelper"
import { mockInputApiAuditLog } from "../../../tests/helpers/mockAuditLogs"
import { SetupAppEnd2EndHelper } from "../../../tests/helpers/setupAppEnd2EndHelper"
import { createUsers, generateJwtForUser } from "../../../tests/helpers/userHelper"
import TestDynamoGateway from "../../../tests/testGateways/TestDynamoGateway/TestDynamoGateway"
import EventCode from "../../../types/EventCode"
import { AuditLogEventLookup } from "../../../useCases/auditLog/auditLogEventLookup"

const serviceJwt = generateTestJwtToken({ groups: [UserGroup.Service], username: "Service" })
const axiosOptions: AxiosRequestConfig = {
  headers: { Authorization: `Bearer ${serviceJwt}` },
  validateStatus: () => true
}

describe("Creating Audit Log Event", () => {
  const auditLogsEndpoint = V1.AuditLogs
  const auditLogEndpoint = V1.AuditLog
  const caseEndpoint = V1.Case

  const messageId = randomUUID()

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

  it("should create a new audit log event when locking a case", async () => {
    const gateway = new TestDynamoGateway(auditLogDynamoConfig)
    const auditLog = mockInputApiAuditLog({ caseId: "1", messageId })

    const result = await axios.post(`${helper.address}${auditLogsEndpoint}`, auditLog, axiosOptions)
    expect(result.status).toEqual(HttpStatusCode.Created)

    const record = await gateway.getOne(auditLogDynamoConfig.auditLogTableName, "messageId", auditLog.messageId)
    if (isError(record)) {
      throw record
    }

    expect(record?.Item?.messageId).toEqual(auditLog.messageId)

    const [user] = await createUsers(helper.postgres, 3)
    const jwtToken = await generateJwtForUser(user)

    const testCase = await createCase(helper.postgres, {
      error_count: 1,
      error_locked_by_id: null,
      error_status: 1,
      message_id: messageId,
      org_for_police_filter: "01"
    })

    const caseResult = await fetch(
      `${helper.address}${caseEndpoint.replace(":caseId", testCase.error_id.toString())}`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        },
        method: "GET"
      }
    )

    expect(caseResult.status).toBe(OK)
    const caseDto = (await caseResult.json()) as CaseDto
    expect(caseDto.errorLockedByUsername).toBe(user.username)
    expect(caseDto.errorLockedByUserFullName).toBe(`${user.forenames} ${user.surname}`)

    const auditLogResult = await fetch(`${helper.address}${auditLogEndpoint.replace(":correlationId", messageId)}`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`
      },
      method: "GET"
    })

    expect(auditLogResult.status).toBe(OK)

    const auditLogJson = (await auditLogResult.json()) as OutputApiAuditLog

    expect(auditLogJson.events).toHaveLength(1)

    const auditLogEvent = auditLogJson.events?.[0]

    expect(auditLogEvent).toHaveProperty("eventCode", EventCode.ExceptionsLocked)
    expect(auditLogEvent).toHaveProperty("category", EventCategory.information)
    expect(auditLogEvent).toHaveProperty("eventSource", "Bichard New UI")
    expect(auditLogEvent).toHaveProperty("eventType", AuditLogEventLookup[EventCode.ExceptionsLocked])
    expect(auditLogEvent).toHaveProperty("user", user.username)
  })
})
