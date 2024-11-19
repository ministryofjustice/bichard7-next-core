import type { AuditLogEvent } from "@moj-bichard7/common/types/AuditLogEvent"
import type User from "services/entities/User"
import type { DataSource } from "typeorm"

import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"
import { UpdateQueryBuilder } from "typeorm"
import UnlockReason from "types/UnlockReason"

import { AUDIT_LOG_EVENT_SOURCE } from "../../src/config"
import CourtCase from "../../src/services/entities/CourtCase"
import getDataSource from "../../src/services/getDataSource"
import updateLockStatusToUnlocked from "../../src/services/updateLockStatusToUnlocked"
import { isError } from "../../src/types/Result"
import { hasAccessToAll } from "../helpers/hasAccessTo"
import deleteFromEntity from "../utils/deleteFromEntity"
import { getDummyCourtCase, insertCourtCases, insertCourtCasesWithFields } from "../utils/insertCourtCases"

const exceptionUnlockedEvent = (username = "GeneralHandler") => ({
  attributes: {
    auditLogVersion: 2,
    user: username
  },
  category: "information",
  eventCode: "exceptions.unlocked",
  eventSource: AUDIT_LOG_EVENT_SOURCE,
  eventType: "Exception unlocked",
  timestamp: expect.anything()
})

const triggerUnlockedEvent = (username = "GeneralHandler") => ({
  attributes: {
    auditLogVersion: 2,
    user: username
  },
  category: "information",
  eventCode: "triggers.unlocked",
  eventSource: AUDIT_LOG_EVENT_SOURCE,
  eventType: "Trigger unlocked",
  timestamp: expect.anything()
})

const testCases = [
  {
    currentUserGroup: UserGroup.TriggerHandler,
    description: "Trigger handler can only unlock triggers when unlock reason is TriggerAndException",
    exceptionLockedBy: "BichardForce02",
    expectedEvents: [triggerUnlockedEvent()],
    expectExceptionsToBeLockedBy: "BichardForce02",
    expectTriggersToBeLockedBy: null,
    triggerLockedBy: "GeneralHandler",
    unlockReason: UnlockReason.TriggerAndException
  },
  {
    currentUserGroup: UserGroup.TriggerHandler,
    description: "Trigger handler can unlock triggers when unlock reason is Trigger",
    exceptionLockedBy: "BichardForce02",
    expectedEvents: [triggerUnlockedEvent()],
    expectExceptionsToBeLockedBy: "BichardForce02",
    expectTriggersToBeLockedBy: null,
    triggerLockedBy: "GeneralHandler",
    unlockReason: UnlockReason.Trigger
  },
  {
    currentUserGroup: UserGroup.TriggerHandler,
    description:
      "Trigger handler can unlock triggers when the exception is not locked and unlock reason is TriggerAndException",
    exceptionLockedBy: null,
    expectedEvents: [triggerUnlockedEvent()],
    expectExceptionsToBeLockedBy: null,
    expectTriggersToBeLockedBy: null,
    triggerLockedBy: "GeneralHandler",
    unlockReason: UnlockReason.TriggerAndException
  },
  {
    currentUserGroup: UserGroup.TriggerHandler,
    description: "Trigger handler cannot unlock the case when unlock reason is Exception",
    exceptionLockedBy: "BichardForce02",
    expectedEvents: [],
    expectError: "User hasn't got permission to unlock the case",
    expectExceptionsToBeLockedBy: "BichardForce02",
    expectTriggersToBeLockedBy: "GeneralHandler",
    triggerLockedBy: "GeneralHandler",
    unlockReason: UnlockReason.Exception
  },
  {
    currentUserGroup: UserGroup.TriggerHandler,
    description: "Trigger handler cannot unlock the case when its locked by BichardForce02",
    exceptionLockedBy: "BichardForce02",
    expectedEvents: [],
    expectExceptionsToBeLockedBy: "BichardForce02",
    expectTriggersToBeLockedBy: "BichardForce02",
    triggerLockedBy: "BichardForce02",
    unlockReason: UnlockReason.TriggerAndException
  },
  {
    currentUserGroup: UserGroup.TriggerHandler,
    description: "Trigger handler cannot unlock a case that is not locked",
    exceptionLockedBy: null,
    expectedEvents: [],
    expectError: "Case is not locked",
    expectExceptionsToBeLockedBy: null,
    expectTriggersToBeLockedBy: null,
    triggerLockedBy: null,
    unlockReason: UnlockReason.TriggerAndException
  },
  {
    currentUserGroup: UserGroup.TriggerHandler,
    description: "Trigger handler cannot unlock a case that has lock on exceptions",
    exceptionLockedBy: "BichardForce02",
    expectedEvents: [],
    expectError: "Case is not locked",
    expectExceptionsToBeLockedBy: "BichardForce02",
    expectTriggersToBeLockedBy: null,
    triggerLockedBy: null,
    unlockReason: UnlockReason.TriggerAndException
  },
  {
    currentUserGroup: UserGroup.ExceptionHandler,
    description: "Exception handler can unlock exception when unlock reason is TriggerAndException",
    exceptionLockedBy: "GeneralHandler",
    expectedEvents: [exceptionUnlockedEvent()],
    expectExceptionsToBeLockedBy: null,
    expectTriggersToBeLockedBy: "BichardForce02",
    triggerLockedBy: "BichardForce02",
    unlockReason: UnlockReason.TriggerAndException
  },
  {
    currentUserGroup: UserGroup.ExceptionHandler,
    description: "Exception handler can unlock exception when unlock reason is Exception",
    exceptionLockedBy: "GeneralHandler",
    expectedEvents: [exceptionUnlockedEvent()],
    expectExceptionsToBeLockedBy: null,
    expectTriggersToBeLockedBy: "BichardForce02",
    triggerLockedBy: "BichardForce02",
    unlockReason: UnlockReason.Exception
  },
  {
    currentUserGroup: UserGroup.ExceptionHandler,
    description:
      "Exception handler can unlock exception when the trigger is not locked and unlock reason is TriggerAndException",
    exceptionLockedBy: "GeneralHandler",
    expectedEvents: [exceptionUnlockedEvent()],
    expectExceptionsToBeLockedBy: null,
    expectTriggersToBeLockedBy: null,
    triggerLockedBy: null,
    unlockReason: UnlockReason.TriggerAndException
  },
  {
    currentUserGroup: UserGroup.ExceptionHandler,
    description: "Exception handler cannot unlock the case when unlock reason is Trigger",
    exceptionLockedBy: "GeneralHandler",
    expectedEvents: [],
    expectError: "User hasn't got permission to unlock the case",
    expectExceptionsToBeLockedBy: "GeneralHandler",
    expectTriggersToBeLockedBy: "BichardForce02",
    triggerLockedBy: "BichardForce02",
    unlockReason: UnlockReason.Trigger
  },
  {
    currentUserGroup: UserGroup.ExceptionHandler,
    description: "Exception handler cannot unlock the case when its locked by BichardForce02",
    exceptionLockedBy: "BichardForce02",
    expectedEvents: [],
    expectExceptionsToBeLockedBy: "BichardForce02",
    expectTriggersToBeLockedBy: "BichardForce02",
    triggerLockedBy: "BichardForce02",
    unlockReason: UnlockReason.TriggerAndException
  },
  {
    currentUserGroup: UserGroup.ExceptionHandler,
    description: "Exception handler cannot unlock a case that is not locked",
    exceptionLockedBy: null,
    expectedEvents: [],
    expectError: "Case is not locked",
    expectExceptionsToBeLockedBy: null,
    expectTriggersToBeLockedBy: null,
    triggerLockedBy: null,
    unlockReason: UnlockReason.TriggerAndException
  },
  {
    currentUserGroup: UserGroup.ExceptionHandler,
    description: "Exception handler cannot unlock a case that has lock on triggers",
    exceptionLockedBy: null,
    expectedEvents: [],
    expectError: "Case is not locked",
    expectExceptionsToBeLockedBy: null,
    expectTriggersToBeLockedBy: "BichardForce02",
    triggerLockedBy: "BichardForce02",
    unlockReason: UnlockReason.TriggerAndException
  },
  {
    currentUserGroup: UserGroup.GeneralHandler,
    description: "General handler can unlock both triggers and exception when unlock reason is TriggerAndException",
    exceptionLockedBy: "GeneralHandler",
    expectedEvents: [exceptionUnlockedEvent(), triggerUnlockedEvent()],
    expectExceptionsToBeLockedBy: null,
    expectTriggersToBeLockedBy: null,
    triggerLockedBy: "GeneralHandler",
    unlockReason: UnlockReason.TriggerAndException
  },
  {
    currentUserGroup: UserGroup.GeneralHandler,
    description: "General handler can unlock triggers when unlock reason is Trigger",
    exceptionLockedBy: "GeneralHandler",
    expectedEvents: [triggerUnlockedEvent()],
    expectExceptionsToBeLockedBy: "GeneralHandler",
    expectTriggersToBeLockedBy: null,
    triggerLockedBy: "GeneralHandler",
    unlockReason: UnlockReason.Trigger
  },
  {
    currentUserGroup: UserGroup.GeneralHandler,
    description:
      "General handler can unlock triggers when the exception is not locked and unlock reason is TriggerAndException",
    exceptionLockedBy: null,
    expectedEvents: [triggerUnlockedEvent()],
    expectExceptionsToBeLockedBy: null,
    expectTriggersToBeLockedBy: null,
    triggerLockedBy: "GeneralHandler",
    unlockReason: UnlockReason.TriggerAndException
  },
  {
    currentUserGroup: UserGroup.GeneralHandler,
    description:
      "General handler can unlock exception when the trigger is not locked and unlock reason is TriggerAndException",
    exceptionLockedBy: "GeneralHandler",
    expectedEvents: [exceptionUnlockedEvent()],
    expectExceptionsToBeLockedBy: null,
    expectTriggersToBeLockedBy: null,
    triggerLockedBy: null,
    unlockReason: UnlockReason.TriggerAndException
  },
  {
    currentUserGroup: UserGroup.GeneralHandler,
    description: "General handler can unlock exception when unlock reason is Exception",
    exceptionLockedBy: "GeneralHandler",
    expectedEvents: [exceptionUnlockedEvent()],
    expectExceptionsToBeLockedBy: null,
    expectTriggersToBeLockedBy: "GeneralHandler",
    triggerLockedBy: "GeneralHandler",
    unlockReason: UnlockReason.Exception
  },
  {
    currentUserGroup: UserGroup.GeneralHandler,
    description:
      "General handler can only unlock exception when unlock reason is TriggerAndException and trigger is locked by BichardForce02",
    exceptionLockedBy: "GeneralHandler",
    expectedEvents: [exceptionUnlockedEvent()],
    expectExceptionsToBeLockedBy: null,
    expectTriggersToBeLockedBy: "BichardForce02",
    triggerLockedBy: "BichardForce02",
    unlockReason: UnlockReason.TriggerAndException
  },
  {
    currentUserGroup: UserGroup.GeneralHandler,
    description:
      "General handler can only unlock trigger when unlock reason is TriggerAndException and exception is locked by BichardForce02",
    exceptionLockedBy: "BichardForce02",
    expectedEvents: [triggerUnlockedEvent()],
    expectExceptionsToBeLockedBy: "BichardForce02",
    expectTriggersToBeLockedBy: null,
    triggerLockedBy: "GeneralHandler",
    unlockReason: UnlockReason.TriggerAndException
  },
  {
    currentUserGroup: UserGroup.GeneralHandler,
    description: "General handler cannot unlock the case when its locked by BichardForce02",
    exceptionLockedBy: "BichardForce02",
    expectedEvents: [],
    expectExceptionsToBeLockedBy: "BichardForce02",
    expectTriggersToBeLockedBy: "BichardForce02",
    triggerLockedBy: "BichardForce02",
    unlockReason: UnlockReason.TriggerAndException
  },
  {
    currentUserGroup: UserGroup.GeneralHandler,
    description: "General handler cannot unlock a case that is not locked",
    exceptionLockedBy: null,
    expectedEvents: [],
    expectError: "Case is not locked",
    expectExceptionsToBeLockedBy: null,
    expectTriggersToBeLockedBy: null,
    triggerLockedBy: null,
    unlockReason: UnlockReason.TriggerAndException
  },
  {
    currentUserGroup: UserGroup.Supervisor,
    description: "Supervisor can unlock both triggers and exception when unlock reason is TriggerAndException",
    exceptionLockedBy: "GeneralHandler",
    expectedEvents: [exceptionUnlockedEvent(), triggerUnlockedEvent()],
    expectExceptionsToBeLockedBy: null,
    expectTriggersToBeLockedBy: null,
    triggerLockedBy: "GeneralHandler",
    unlockReason: UnlockReason.TriggerAndException
  },
  {
    currentUserGroup: UserGroup.Supervisor,
    description: "Supervisor can unlock triggers when unlock reason is Trigger",
    exceptionLockedBy: "GeneralHandler",
    expectedEvents: [triggerUnlockedEvent()],
    expectExceptionsToBeLockedBy: "GeneralHandler",
    expectTriggersToBeLockedBy: null,
    triggerLockedBy: "GeneralHandler",
    unlockReason: UnlockReason.Trigger
  },
  {
    currentUserGroup: UserGroup.Supervisor,
    description: "Supervisor can unlock exception when unlock reason is Exception",
    exceptionLockedBy: "GeneralHandler",
    expectedEvents: [exceptionUnlockedEvent()],
    expectExceptionsToBeLockedBy: null,
    expectTriggersToBeLockedBy: "GeneralHandler",
    triggerLockedBy: "GeneralHandler",
    unlockReason: UnlockReason.Exception
  },
  {
    currentUserGroup: UserGroup.Supervisor,
    description:
      "Supervisor can unlock both triggers and exceptions when unlock reason is TriggerAndException and trigger is locked by BichardForce02",
    exceptionLockedBy: "GeneralHandler",
    expectedEvents: [exceptionUnlockedEvent(), triggerUnlockedEvent()],
    expectExceptionsToBeLockedBy: null,
    expectTriggersToBeLockedBy: null,
    triggerLockedBy: "BichardForce02",
    unlockReason: UnlockReason.TriggerAndException
  },
  {
    currentUserGroup: UserGroup.Supervisor,
    description:
      "Supervisor can unlock both triggers and exceptions when unlock reason is TriggerAndException and exception is locked by BichardForce02",
    exceptionLockedBy: "BichardForce02",
    expectedEvents: [exceptionUnlockedEvent(), triggerUnlockedEvent()],
    expectExceptionsToBeLockedBy: null,
    expectTriggersToBeLockedBy: null,
    triggerLockedBy: "GeneralHandler",
    unlockReason: UnlockReason.TriggerAndException
  },
  {
    currentUserGroup: UserGroup.Supervisor,
    description: "Supervisor can unlock the case when its locked by BichardForce02",
    exceptionLockedBy: "BichardForce02",
    expectedEvents: [exceptionUnlockedEvent(), triggerUnlockedEvent()],
    expectExceptionsToBeLockedBy: null,
    expectTriggersToBeLockedBy: null,
    triggerLockedBy: "BichardForce02",
    unlockReason: UnlockReason.TriggerAndException
  },
  {
    currentUserGroup: UserGroup.Supervisor,
    description:
      "Supervisor can unlock triggers when the exception is not locked and unlock reason is TriggerAndException",
    exceptionLockedBy: null,
    expectedEvents: [triggerUnlockedEvent()],
    expectExceptionsToBeLockedBy: null,
    expectTriggersToBeLockedBy: null,
    triggerLockedBy: "GeneralHandler",
    unlockReason: UnlockReason.TriggerAndException
  },
  {
    currentUserGroup: UserGroup.Supervisor,
    description:
      "Supervisor can unlock exception when the trigger is not locked and unlock reason is TriggerAndException",
    exceptionLockedBy: "GeneralHandler",
    expectedEvents: [exceptionUnlockedEvent()],
    expectExceptionsToBeLockedBy: null,
    expectTriggersToBeLockedBy: null,
    triggerLockedBy: null,
    unlockReason: UnlockReason.TriggerAndException
  },
  {
    currentUserGroup: UserGroup.Supervisor,
    description: "Supervisor cannot unlock a case that is not locked",
    exceptionLockedBy: null,
    expectedEvents: [],
    expectError: "Case is not locked",
    expectExceptionsToBeLockedBy: null,
    expectTriggersToBeLockedBy: null,
    triggerLockedBy: null,
    unlockReason: UnlockReason.TriggerAndException
  }
]

describe("Unlock court case", () => {
  let dataSource: DataSource

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromEntity(CourtCase)
  })

  afterEach(() => {
    jest.resetAllMocks()
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  test.each(testCases)(
    "$description",
    async ({
      currentUserGroup,
      exceptionLockedBy,
      expectedEvents,
      expectError,
      expectExceptionsToBeLockedBy,
      expectTriggersToBeLockedBy,
      triggerLockedBy,
      unlockReason
    }) => {
      const [courtCase, anotherCourtCase] = await insertCourtCasesWithFields([
        {
          errorId: 1,
          errorLockedByUsername: exceptionLockedBy,
          orgForPoliceFilter: "36FPA ",
          triggerLockedByUsername: triggerLockedBy
        },
        {
          errorId: 2,
          errorLockedByUsername: exceptionLockedBy,
          orgForPoliceFilter: "36FPA ",
          triggerLockedByUsername: triggerLockedBy
        }
      ])

      const user = {
        hasAccessTo: userAccess({ groups: [currentUserGroup] }),
        username: "GeneralHandler",
        visibleCourts: [],
        visibleForces: ["36FPA1"]
      } as Partial<User> as User

      const events: AuditLogEvent[] = []
      const result = await updateLockStatusToUnlocked(dataSource.manager, courtCase, user, unlockReason, events)

      if (expectError) {
        expect(isError(result)).toBe(true)
        expect((result as Error).message).toEqual(expectError)
      } else {
        expect(isError(result)).toBe(false)
      }

      const actualCourtCase = (await dataSource
        .getRepository(CourtCase)
        .findOne({ where: { errorId: courtCase.errorId } })) as CourtCase
      expect(actualCourtCase.errorLockedByUsername).toBe(expectExceptionsToBeLockedBy)
      expect(actualCourtCase.triggerLockedByUsername).toBe(expectTriggersToBeLockedBy)

      const actualAnotherCourtCase = (await dataSource
        .getRepository(CourtCase)
        .findOne({ where: { errorId: anotherCourtCase.errorId } })) as CourtCase
      expect(actualAnotherCourtCase.errorLockedByUsername).toEqual(exceptionLockedBy)
      expect(actualAnotherCourtCase.triggerLockedByUsername).toEqual(triggerLockedBy)

      expect(events).toEqual(expectedEvents)
    }
  )

  describe("when there is an error", () => {
    it("Should return the error when failed to unlock court case", async () => {
      jest
        .spyOn(UpdateQueryBuilder.prototype, "execute")
        .mockRejectedValue(Error("Failed to update record with some error"))

      const [lockedCourtCase] = await insertCourtCases(
        await getDummyCourtCase({
          errorLockedByUsername: "BichardForce04",
          triggerLockedByUsername: "BichardForce04"
        })
      )

      const user = {
        hasAccessTo: hasAccessToAll,
        username: "dummy username",
        visibleCourts: [],
        visibleForces: ["36FPA1"]
      } as Partial<User> as User

      const events: AuditLogEvent[] = []
      const result = await updateLockStatusToUnlocked(
        dataSource.manager,
        lockedCourtCase,
        user,
        UnlockReason.TriggerAndException,
        events
      )
      expect(isError(result)).toBe(true)

      const receivedError = result as Error

      expect(receivedError.message).toBe("Failed to update record with some error")
      expect(events).toHaveLength(0)
    })
  })
})
