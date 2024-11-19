import type { AuditLogEvent } from "@moj-bichard7/common/types/AuditLogEvent"
import type User from "services/entities/User"
import type { DataSource } from "typeorm"

import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"

import type { ResolutionStatus } from "../../src/types/ResolutionStatus"

import { AUDIT_LOG_EVENT_SOURCE } from "../../src/config"
import CourtCase from "../../src/services/entities/CourtCase"
import getCourtCase from "../../src/services/getCourtCase"
import getDataSource from "../../src/services/getDataSource"
import updateLockStatusToLocked from "../../src/services/updateLockStatusToLocked"
import { isError } from "../../src/types/Result"
import deleteFromEntity from "../utils/deleteFromEntity"
import { getDummyCourtCase, insertCourtCases } from "../utils/insertCourtCases"

describe("Update lock status to locked", () => {
  let dataSource: DataSource

  const exceptionLockedEvent = (username = "GeneralHandler") => ({
    attributes: {
      auditLogVersion: 2,
      user: username
    },
    category: "information",
    eventCode: "exceptions.locked",
    eventSource: AUDIT_LOG_EVENT_SOURCE,
    eventType: "Exception locked",
    timestamp: expect.anything()
  })
  const triggerLockedEvent = (username = "GeneralHandler") => ({
    attributes: {
      auditLogVersion: 2,
      user: username
    },
    category: "information",
    eventCode: "triggers.locked",
    eventSource: AUDIT_LOG_EVENT_SOURCE,
    eventType: "Trigger locked",
    timestamp: expect.anything()
  })

  const testCases = [
    {
      currentUserGroup: UserGroup.GeneralHandler,
      description: "General handler can lock a case that is not locked",
      exceptionLockedBy: null,
      expectedEvents: [exceptionLockedEvent(), triggerLockedEvent()],
      expectExceptionsToBeLockedBy: "GeneralHandler",
      expectTriggersToBeLockedBy: "GeneralHandler",
      triggerLockedBy: null
    },
    {
      currentUserGroup: UserGroup.GeneralHandler,
      description: "General handler can lock the exception when the trigger is already locked ",
      exceptionLockedBy: null,
      expectedEvents: [exceptionLockedEvent()],
      expectExceptionsToBeLockedBy: "GeneralHandler",
      expectTriggersToBeLockedBy: "BichardForce02",
      triggerLockedBy: "BichardForce02"
    },
    {
      currentUserGroup: UserGroup.GeneralHandler,
      description: "General handler can lock the exception when the trigger status is submitted ",
      exceptionLockedBy: null,
      expectedEvents: [exceptionLockedEvent()],
      expectExceptionsToBeLockedBy: "GeneralHandler",
      expectTriggersToBeLockedBy: null,
      triggerLockedBy: null,
      triggerStatus: "Submitted" as ResolutionStatus
    },
    {
      currentUserGroup: UserGroup.GeneralHandler,
      description: "General handler can lock the trigger when the exception is already locked ",
      exceptionLockedBy: "BichardForce02",
      expectedEvents: [triggerLockedEvent()],
      expectExceptionsToBeLockedBy: "BichardForce02",
      expectTriggersToBeLockedBy: "GeneralHandler",
      triggerLockedBy: null
    },
    {
      currentUserGroup: UserGroup.GeneralHandler,
      description: "General handler can lock the trigger when the error status is submitted",
      errorStatus: "Submitted" as ResolutionStatus,
      exceptionLockedBy: null,
      expectedEvents: [triggerLockedEvent()],
      expectExceptionsToBeLockedBy: null,
      expectTriggersToBeLockedBy: "GeneralHandler",
      triggerLockedBy: null
    },
    {
      currentUserGroup: UserGroup.GeneralHandler,
      description: "General handler cannot lock a case that is already locked",
      exceptionLockedBy: "BichardForce02",
      expectedEvents: [],
      expectExceptionsToBeLockedBy: "BichardForce02",
      expectTriggersToBeLockedBy: "BichardForce02",
      triggerLockedBy: "BichardForce02"
    },
    {
      currentUserGroup: UserGroup.GeneralHandler,
      description: "General handler cannot lock a case when the error status and trigger status is submitted",
      errorStatus: "Submitted" as ResolutionStatus,
      exceptionLockedBy: null,
      expectedEvents: [],
      expectExceptionsToBeLockedBy: null,
      expectTriggersToBeLockedBy: null,
      triggerLockedBy: null,
      triggerStatus: "Submitted" as ResolutionStatus
    },
    {
      currentUserGroup: UserGroup.TriggerHandler,
      description: "Trigger handler can lock the trigger when the exception is already locked ",
      exceptionLockedBy: "BichardForce02",
      expectedEvents: [triggerLockedEvent()],
      expectExceptionsToBeLockedBy: "BichardForce02",
      expectTriggersToBeLockedBy: "GeneralHandler",
      triggerLockedBy: null
    },
    {
      currentUserGroup: UserGroup.TriggerHandler,
      description: "Trigger handler can lock the trigger when the exception is not locked ",
      exceptionLockedBy: null,
      expectedEvents: [triggerLockedEvent()],
      expectExceptionsToBeLockedBy: null,
      expectTriggersToBeLockedBy: "GeneralHandler",
      triggerLockedBy: null
    },
    {
      currentUserGroup: UserGroup.TriggerHandler,
      description: "Trigger handler cannot lock a case that is already locked",
      exceptionLockedBy: null,
      expectedEvents: [],
      expectExceptionsToBeLockedBy: null,
      expectTriggersToBeLockedBy: "BichardForce02",
      triggerLockedBy: "BichardForce02"
    },
    {
      currentUserGroup: UserGroup.TriggerHandler,
      description: "Trigger handler cannot lock a case when the trigger status is submitted",
      exceptionLockedBy: null,
      expectedEvents: [],
      expectExceptionsToBeLockedBy: null,
      expectTriggersToBeLockedBy: null,
      triggerLockedBy: null,
      triggerStatus: "Submitted" as ResolutionStatus
    },
    {
      currentUserGroup: UserGroup.ExceptionHandler,
      description: "Exception handler can lock the exception when the trigger is already locked ",
      exceptionLockedBy: null,
      expectedEvents: [exceptionLockedEvent()],
      expectExceptionsToBeLockedBy: "GeneralHandler",
      expectTriggersToBeLockedBy: "BichardForce02",
      triggerLockedBy: "BichardForce02"
    },
    {
      currentUserGroup: UserGroup.ExceptionHandler,
      description: "Exception handler can lock the trigger when the exception is not locked ",
      exceptionLockedBy: null,
      expectedEvents: [exceptionLockedEvent()],
      expectExceptionsToBeLockedBy: "GeneralHandler",
      expectTriggersToBeLockedBy: null,
      triggerLockedBy: null
    },
    {
      currentUserGroup: UserGroup.ExceptionHandler,
      description: "Exception handler cannot lock a case that is already locked",
      exceptionLockedBy: "BichardForce02",
      expectedEvents: [],
      expectExceptionsToBeLockedBy: "BichardForce02",
      expectTriggersToBeLockedBy: null,
      triggerLockedBy: null
    },
    {
      currentUserGroup: UserGroup.ExceptionHandler,
      description: "Exception handler cannot lock a case when the error status is submitted",
      errorStatus: "Submitted" as ResolutionStatus,
      exceptionLockedBy: null,
      expectedEvents: [],
      expectExceptionsToBeLockedBy: null,
      expectTriggersToBeLockedBy: null,
      triggerLockedBy: null
    },
    {
      currentUserGroup: UserGroup.Audit,
      description: "Auditor cannot lock a case",
      exceptionLockedBy: null,
      expectedEvents: [],
      expectError: "update requires a lock (exception or trigger) to update",
      expectExceptionsToBeLockedBy: null,
      expectTriggersToBeLockedBy: null,
      triggerLockedBy: null
    }
  ]

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromEntity(CourtCase)
  })

  afterAll(async () => {
    if (dataSource) {
      await dataSource.destroy()
    }
  })

  test.each(testCases)(
    "$description",
    async ({
      currentUserGroup,
      errorStatus,
      exceptionLockedBy,
      expectedEvents,
      expectError,
      expectExceptionsToBeLockedBy,
      expectTriggersToBeLockedBy,
      triggerLockedBy,
      triggerStatus
    }) => {
      const inputCourtCase = await getDummyCourtCase({
        errorCount: 1,
        errorLockedByUsername: exceptionLockedBy,
        errorStatus: errorStatus ?? "Unresolved",
        triggerCount: 1,
        triggerLockedByUsername: triggerLockedBy,
        triggerStatus: triggerStatus ?? "Unresolved"
      })
      await insertCourtCases(inputCourtCase)

      const user = {
        hasAccessTo: userAccess({ groups: [currentUserGroup] }),
        username: "GeneralHandler",
        visibleCourts: [],
        visibleForces: ["36"]
      } as Partial<User> as User

      const events: AuditLogEvent[] = []
      const result = await updateLockStatusToLocked(dataSource.manager, inputCourtCase.errorId, user, events)

      if (expectError) {
        expect(isError(result)).toBe(true)
        expect((result as Error).message).toEqual(expectError)
      } else {
        expect(isError(result)).toBe(false)
      }

      const expectedCourtCase = await getDummyCourtCase({
        errorCount: 1,
        errorLockedByUsername: expectExceptionsToBeLockedBy,
        errorStatus: errorStatus ?? "Unresolved",
        triggerCount: 1,
        triggerLockedByUsername: expectTriggersToBeLockedBy,
        triggerStatus: triggerStatus ?? "Unresolved"
      })

      const actualCourtCase = await getCourtCase(dataSource, inputCourtCase.errorId)
      expect(actualCourtCase).toMatchObject(expectedCourtCase)
      expect(events).toStrictEqual(expectedEvents)
    }
  )
})
