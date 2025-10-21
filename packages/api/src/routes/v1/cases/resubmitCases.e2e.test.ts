import type { FastifyInstance } from "fastify"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { isError } from "@moj-bichard7/common/types/Result"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { randomUUID } from "crypto"
import { ACCEPTED, FORBIDDEN } from "http-status"

import type { OutputApiAuditLog } from "../../../types/AuditLog"
import type { ResubmitCases } from "./resubmitCases"

import HO100404 from "../../../tests/fixtures/HO100404.json"
import { createCases } from "../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../tests/helpers/setupAppEnd2EndHelper"
import { createUserAndJwtToken } from "../../../tests/helpers/userHelper"
import { generateJwtForStaticUser } from "../../../tests/helpers/userHelper"
import { ResolutionStatusNumber } from "../../../useCases/dto/convertResolutionStatus"
import FetchById from "../../../useCases/fetchAuditLogs/FetchById"

const defaultRequest = (jwt: string) => {
  return {
    headers: { Authorization: `Bearer ${jwt}` },
    method: "POST"
  }
}

describe("/v1/cases/resubmit e2e", () => {
  const endpoint = V1.CasesResubmit
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app
  })

  beforeEach(async () => {
    await helper.postgres.clearDb()
  })

  afterAll(async () => {
    await app.close()
    await helper.postgres.close()
  })

  it("will receive a 403 error if there's no Service group for the User", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres, [
      UserGroup.GeneralHandler,
      UserGroup.Supervisor,
      UserGroup.SuperUserManager,
      UserGroup.UserManager,
      UserGroup.AuditLoggingManager
    ])

    const response = await fetch(`${helper.address}${endpoint}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(FORBIDDEN)
  })

  it("will work with a user with Service group", async () => {
    const [encodedJwt] = generateJwtForStaticUser([UserGroup.Service])

    const response = await fetch(`${helper.address}${endpoint}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(ACCEPTED)
    expect(await response.json()).toEqual({})
  })

  it("won't resubmit if there's no eligible Cases", async () => {
    const [encodedJwt] = generateJwtForStaticUser([UserGroup.Service])
    await createCases(helper.postgres, 3, {
      0: {
        aho: HO100404.hearingOutcomeXml,
        errorCount: 1,
        errorLockedById: "testUser",
        errorReport: "HO100404||br7:ArrestSummonsNumber",
        messageId: randomUUID()
      },
      1: {
        aho: HO100404.hearingOutcomeXml,
        errorCount: 1,
        errorReport: "HO100404||br7:ArrestSummonsNumber",
        errorStatus: ResolutionStatusNumber.Submitted,
        messageId: randomUUID()
      },
      2: {
        aho: HO100404.hearingOutcomeXml,
        errorCount: 1,
        errorReport: "HO100404||br7:ArrestSummonsNumber",
        errorStatus: ResolutionStatusNumber.Resolved,
        messageId: randomUUID()
      }
    })

    const response = await fetch(`${helper.address}${endpoint}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(ACCEPTED)
    expect(await response.json()).toEqual({})
  })

  it("will resubmit if there's eligible Cases", async () => {
    const [encodedJwt] = generateJwtForStaticUser([UserGroup.Service])
    const cases = await createCases(helper.postgres, 3, {
      0: {
        aho: HO100404.hearingOutcomeXml,
        errorCount: 1,
        errorReport: "HO100404||br7:ArrestSummonsNumber",
        messageId: randomUUID()
      },
      1: {
        aho: HO100404.hearingOutcomeXml,
        errorCount: 1,
        errorReport: "HO100404||br7:ArrestSummonsNumber",
        messageId: randomUUID()
      },
      2: {
        aho: HO100404.hearingOutcomeXml,
        errorCount: 1,
        errorReport: "HO100404||br7:ArrestSummonsNumber",
        messageId: randomUUID()
      }
    })

    if (isError(cases)) {
      throw new Error("Not meant to happen")
    }

    const response = await fetch(`${helper.address}${endpoint}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(ACCEPTED)

    const json = (await response.json()) as ResubmitCases

    for (const c of cases) {
      expect(json[c.messageId]).toBeDefined()
      expect(json[c.messageId]).not.toBeInstanceOf(Error)
      expect(json[c.messageId]).toHaveProperty("errorId", c.errorId)
      expect(json[c.messageId]).toHaveProperty("workflowId")
    }
  })

  it("will audit log", async () => {
    const [encodedJwt] = generateJwtForStaticUser([UserGroup.Service])
    const cases = await createCases(helper.postgres, 1, {
      0: {
        aho: HO100404.hearingOutcomeXml,
        errorCount: 1,
        errorReport: "HO100404||br7:ArrestSummonsNumber",
        messageId: randomUUID()
      }
    })

    if (isError(cases)) {
      throw new Error("Not meant to happen")
    }

    const response = await fetch(`${helper.address}${endpoint}`, defaultRequest(encodedJwt))

    expect(response.status).toBe(ACCEPTED)

    const auditLogJson = await new FetchById(helper.dynamo, cases[0].messageId).fetch()
    const auditLogObj = auditLogJson as OutputApiAuditLog
    expect(auditLogObj.events).toHaveLength(1)

    const auditLogEvent = auditLogObj.events?.[0]
    expect(auditLogEvent?.category).toBe(EventCategory.information)
    expect(auditLogEvent?.eventCode).toBe(EventCode.ExceptionsLocked)
    expect(auditLogEvent?.eventSource).toBe("Bichard API Auto Resubmit")
    expect(auditLogEvent?.user).toBe("service.user")
  })
})
