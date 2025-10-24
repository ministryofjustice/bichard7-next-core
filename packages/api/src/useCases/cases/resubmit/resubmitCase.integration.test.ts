import type { CaseRow } from "@moj-bichard7/common/types/Case"

import waitForWorkflows from "@moj-bichard7/common/test/conductor/waitForWorkflows"
import { isError } from "@moj-bichard7/common/types/Result"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"

import { createCase } from "../../../tests/helpers/caseHelper"
import { createUser } from "../../../tests/helpers/userHelper"
import { minimalUser } from "../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"
import { ResolutionStatusNumber } from "../../../useCases/dto/convertResolutionStatus"
import { resubmitCase } from "./resubmitCase"

describe("resubmitCase", () => {
  const testDatabaseGateway = new End2EndPostgres()

  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
  })

  afterAll(async () => {
    await testDatabaseGateway.close()
  })

  it("bubbles an error if it receives an error from canUserResubmitCase", async () => {
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.ExceptionHandler] })

    expect(await resubmitCase(testDatabaseGateway.writable, user, 1)).toEqual(new Error("Case not found"))
  })

  it("returns an error if the user can't resubmit", async () => {
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.TriggerHandler] })
    const caseObj = await createCase(testDatabaseGateway, { errorLockedById: user.username })

    const result = await resubmitCase(testDatabaseGateway.writable, user, caseObj.errorId)

    expect(result).toEqual(new Error("User can't resubmit"))
  })

  it("updates the case to be submitted", async () => {
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.ExceptionHandler] })
    const caseObj = await createCase(testDatabaseGateway, {
      errorLockedById: user.username,
      errorStatus: ResolutionStatusNumber.Unresolved
    })

    const result = await resubmitCase(testDatabaseGateway.writable, user, caseObj.errorId)

    if (isError(result)) {
      throw result
    }

    const [caseRow] = await testDatabaseGateway.readonly.connection<
      CaseRow[]
    >`SELECT * FROM br7own.error_list el WHERE el.message_id = ${caseObj.messageId}`

    expect(result.messageId).toBe(caseObj.messageId)
    expect(caseRow.error_status).toBe(ResolutionStatusNumber.Submitted)
  })

  it("creates a Conductor Workflow", async () => {
    const user = await createUser(testDatabaseGateway, { groups: [UserGroup.ExceptionHandler] })
    const caseObj = await createCase(testDatabaseGateway, { errorLockedById: user.username })

    const result = await resubmitCase(testDatabaseGateway.writable, user, caseObj.errorId)

    if (isError(result)) {
      throw result
    }

    const response = await waitForWorkflows({ query: { correlationId: result.messageId } })

    expect(response).toBeDefined()
    expect(response[0].workflowType).toBe("resubmit")
    expect(response[0].workflowId).toBe(result.workflowId)
    expect(response[0].correlationId).toBe(result.messageId)
  })

  describe("with auto resubmit", () => {
    it("creates a Conductor Workflow", async () => {
      const user = minimalUser([UserGroup.Service], "service.user")
      const caseObj = await createCase(testDatabaseGateway)

      const result = await resubmitCase(testDatabaseGateway.writable, user, caseObj.errorId, true)

      if (isError(result)) {
        throw result
      }

      const response = await waitForWorkflows({ query: { correlationId: result.messageId } })

      expect(response).toBeDefined()
      expect(response[0].workflowType).toBe("resubmit")
      expect(response[0].workflowId).toBe(result.workflowId)
      expect(response[0].correlationId).toBe(result.messageId)
    })
  })
})
