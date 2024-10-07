import type { AuditLogEvent } from "@moj-bichard7-developers/bichard7-next-core/common/types/AuditLogEvent"
import User from "services/entities/User"
import { DataSource, UpdateQueryBuilder } from "typeorm"
import UnlockReason from "types/UnlockReason"
import { userAccess } from "utils/userPermissions"
import { AUDIT_LOG_EVENT_SOURCE } from "../../src/config"
import CourtCase from "../../src/services/entities/CourtCase"
import getDataSource from "../../src/services/getDataSource"
import updateLockStatusToUnlocked from "../../src/services/updateLockStatusToUnlocked"
import { isError } from "../../src/types/Result"
import { UserGroup } from "../../src/types/UserGroup"
import { hasAccessToAll } from "../helpers/hasAccessTo"
import deleteFromEntity from "../utils/deleteFromEntity"
import { getDummyCourtCase, insertCourtCases, insertCourtCasesWithFields } from "../utils/insertCourtCases"

const exceptionUnlockedEvent = (username = "GeneralHandler") => ({
  category: "information",
  eventSource: AUDIT_LOG_EVENT_SOURCE,
  eventType: "Exception unlocked",
  eventCode: "exceptions.unlocked",
  timestamp: expect.anything(),
  attributes: {
    user: username,
    auditLogVersion: 2
  }
})

const triggerUnlockedEvent = (username = "GeneralHandler") => ({
  category: "information",
  eventSource: AUDIT_LOG_EVENT_SOURCE,
  eventType: "Trigger unlocked",
  eventCode: "triggers.unlocked",
  timestamp: expect.anything(),
  attributes: {
    user: username,
    auditLogVersion: 2
  }
})

const testCases = [
  {
    description: "Trigger handler can only unlock triggers when unlock reason is TriggerAndException",
    triggerLockedBy: "GeneralHandler",
    exceptionLockedBy: "BichardForce02",
    currentUserGroup: UserGroup.TriggerHandler,
    unlockReason: UnlockReason.TriggerAndException,
    expectTriggersToBeLockedBy: null,
    expectExceptionsToBeLockedBy: "BichardForce02",
    expectedEvents: [triggerUnlockedEvent()]
  },
  {
    description: "Trigger handler can unlock triggers when unlock reason is Trigger",
    triggerLockedBy: "GeneralHandler",
    exceptionLockedBy: "BichardForce02",
    currentUserGroup: UserGroup.TriggerHandler,
    unlockReason: UnlockReason.Trigger,
    expectTriggersToBeLockedBy: null,
    expectExceptionsToBeLockedBy: "BichardForce02",
    expectedEvents: [triggerUnlockedEvent()]
  },
  {
    description:
      "Trigger handler can unlock triggers when the exception is not locked and unlock reason is TriggerAndException",
    triggerLockedBy: "GeneralHandler",
    exceptionLockedBy: null,
    currentUserGroup: UserGroup.TriggerHandler,
    unlockReason: UnlockReason.TriggerAndException,
    expectTriggersToBeLockedBy: null,
    expectExceptionsToBeLockedBy: null,
    expectedEvents: [triggerUnlockedEvent()]
  },
  {
    description: "Trigger handler cannot unlock the case when unlock reason is Exception",
    triggerLockedBy: "GeneralHandler",
    exceptionLockedBy: "BichardForce02",
    currentUserGroup: UserGroup.TriggerHandler,
    unlockReason: UnlockReason.Exception,
    expectTriggersToBeLockedBy: "GeneralHandler",
    expectExceptionsToBeLockedBy: "BichardForce02",
    expectError: "User hasn't got permission to unlock the case",
    expectedEvents: []
  },
  {
    description: "Trigger handler cannot unlock the case when its locked by BichardForce02",
    triggerLockedBy: "BichardForce02",
    exceptionLockedBy: "BichardForce02",
    currentUserGroup: UserGroup.TriggerHandler,
    unlockReason: UnlockReason.TriggerAndException,
    expectTriggersToBeLockedBy: "BichardForce02",
    expectExceptionsToBeLockedBy: "BichardForce02",
    expectedEvents: []
  },
  {
    description: "Trigger handler cannot unlock a case that is not locked",
    triggerLockedBy: null,
    exceptionLockedBy: null,
    currentUserGroup: UserGroup.TriggerHandler,
    unlockReason: UnlockReason.TriggerAndException,
    expectTriggersToBeLockedBy: null,
    expectExceptionsToBeLockedBy: null,
    expectError: "Case is not locked",
    expectedEvents: []
  },
  {
    description: "Trigger handler cannot unlock a case that has lock on exceptions",
    triggerLockedBy: null,
    exceptionLockedBy: "BichardForce02",
    currentUserGroup: UserGroup.TriggerHandler,
    unlockReason: UnlockReason.TriggerAndException,
    expectTriggersToBeLockedBy: null,
    expectExceptionsToBeLockedBy: "BichardForce02",
    expectError: "Case is not locked",
    expectedEvents: []
  },
  {
    description: "Exception handler can unlock exception when unlock reason is TriggerAndException",
    triggerLockedBy: "BichardForce02",
    exceptionLockedBy: "GeneralHandler",
    currentUserGroup: UserGroup.ExceptionHandler,
    unlockReason: UnlockReason.TriggerAndException,
    expectTriggersToBeLockedBy: "BichardForce02",
    expectExceptionsToBeLockedBy: null,
    expectedEvents: [exceptionUnlockedEvent()]
  },
  {
    description: "Exception handler can unlock exception when unlock reason is Exception",
    triggerLockedBy: "BichardForce02",
    exceptionLockedBy: "GeneralHandler",
    currentUserGroup: UserGroup.ExceptionHandler,
    unlockReason: UnlockReason.Exception,
    expectTriggersToBeLockedBy: "BichardForce02",
    expectExceptionsToBeLockedBy: null,
    expectedEvents: [exceptionUnlockedEvent()]
  },
  {
    description:
      "Exception handler can unlock exception when the trigger is not locked and unlock reason is TriggerAndException",
    triggerLockedBy: null,
    exceptionLockedBy: "GeneralHandler",
    currentUserGroup: UserGroup.ExceptionHandler,
    unlockReason: UnlockReason.TriggerAndException,
    expectTriggersToBeLockedBy: null,
    expectExceptionsToBeLockedBy: null,
    expectedEvents: [exceptionUnlockedEvent()]
  },
  {
    description: "Exception handler cannot unlock the case when unlock reason is Trigger",
    triggerLockedBy: "BichardForce02",
    exceptionLockedBy: "GeneralHandler",
    currentUserGroup: UserGroup.ExceptionHandler,
    unlockReason: UnlockReason.Trigger,
    expectTriggersToBeLockedBy: "BichardForce02",
    expectExceptionsToBeLockedBy: "GeneralHandler",
    expectError: "User hasn't got permission to unlock the case",
    expectedEvents: []
  },
  {
    description: "Exception handler cannot unlock the case when its locked by BichardForce02",
    triggerLockedBy: "BichardForce02",
    exceptionLockedBy: "BichardForce02",
    currentUserGroup: UserGroup.ExceptionHandler,
    unlockReason: UnlockReason.TriggerAndException,
    expectTriggersToBeLockedBy: "BichardForce02",
    expectExceptionsToBeLockedBy: "BichardForce02",
    expectedEvents: []
  },
  {
    description: "Exception handler cannot unlock a case that is not locked",
    triggerLockedBy: null,
    exceptionLockedBy: null,
    currentUserGroup: UserGroup.ExceptionHandler,
    unlockReason: UnlockReason.TriggerAndException,
    expectTriggersToBeLockedBy: null,
    expectExceptionsToBeLockedBy: null,
    expectError: "Case is not locked",
    expectedEvents: []
  },
  {
    description: "Exception handler cannot unlock a case that has lock on triggers",
    triggerLockedBy: "BichardForce02",
    exceptionLockedBy: null,
    currentUserGroup: UserGroup.ExceptionHandler,
    unlockReason: UnlockReason.TriggerAndException,
    expectTriggersToBeLockedBy: "BichardForce02",
    expectExceptionsToBeLockedBy: null,
    expectError: "Case is not locked",
    expectedEvents: []
  },
  {
    description: "General handler can unlock both triggers and exception when unlock reason is TriggerAndException",
    triggerLockedBy: "GeneralHandler",
    exceptionLockedBy: "GeneralHandler",
    currentUserGroup: UserGroup.GeneralHandler,
    unlockReason: UnlockReason.TriggerAndException,
    expectTriggersToBeLockedBy: null,
    expectExceptionsToBeLockedBy: null,
    expectedEvents: [exceptionUnlockedEvent(), triggerUnlockedEvent()]
  },
  {
    description: "General handler can unlock triggers when unlock reason is Trigger",
    triggerLockedBy: "GeneralHandler",
    exceptionLockedBy: "GeneralHandler",
    currentUserGroup: UserGroup.GeneralHandler,
    unlockReason: UnlockReason.Trigger,
    expectTriggersToBeLockedBy: null,
    expectExceptionsToBeLockedBy: "GeneralHandler",
    expectedEvents: [triggerUnlockedEvent()]
  },
  {
    description:
      "General handler can unlock triggers when the exception is not locked and unlock reason is TriggerAndException",
    triggerLockedBy: "GeneralHandler",
    exceptionLockedBy: null,
    currentUserGroup: UserGroup.GeneralHandler,
    unlockReason: UnlockReason.TriggerAndException,
    expectTriggersToBeLockedBy: null,
    expectExceptionsToBeLockedBy: null,
    expectedEvents: [triggerUnlockedEvent()]
  },
  {
    description:
      "General handler can unlock exception when the trigger is not locked and unlock reason is TriggerAndException",
    triggerLockedBy: null,
    exceptionLockedBy: "GeneralHandler",
    currentUserGroup: UserGroup.GeneralHandler,
    unlockReason: UnlockReason.TriggerAndException,
    expectTriggersToBeLockedBy: null,
    expectExceptionsToBeLockedBy: null,
    expectedEvents: [exceptionUnlockedEvent()]
  },
  {
    description: "General handler can unlock exception when unlock reason is Exception",
    triggerLockedBy: "GeneralHandler",
    exceptionLockedBy: "GeneralHandler",
    currentUserGroup: UserGroup.GeneralHandler,
    unlockReason: UnlockReason.Exception,
    expectTriggersToBeLockedBy: "GeneralHandler",
    expectExceptionsToBeLockedBy: null,
    expectedEvents: [exceptionUnlockedEvent()]
  },
  {
    description:
      "General handler can only unlock exception when unlock reason is TriggerAndException and trigger is locked by BichardForce02",
    triggerLockedBy: "BichardForce02",
    exceptionLockedBy: "GeneralHandler",
    currentUserGroup: UserGroup.GeneralHandler,
    unlockReason: UnlockReason.TriggerAndException,
    expectTriggersToBeLockedBy: "BichardForce02",
    expectExceptionsToBeLockedBy: null,
    expectedEvents: [exceptionUnlockedEvent()]
  },
  {
    description:
      "General handler can only unlock trigger when unlock reason is TriggerAndException and exception is locked by BichardForce02",
    triggerLockedBy: "GeneralHandler",
    exceptionLockedBy: "BichardForce02",
    currentUserGroup: UserGroup.GeneralHandler,
    unlockReason: UnlockReason.TriggerAndException,
    expectTriggersToBeLockedBy: null,
    expectExceptionsToBeLockedBy: "BichardForce02",
    expectedEvents: [triggerUnlockedEvent()]
  },
  {
    description: "General handler cannot unlock the case when its locked by BichardForce02",
    triggerLockedBy: "BichardForce02",
    exceptionLockedBy: "BichardForce02",
    currentUserGroup: UserGroup.GeneralHandler,
    unlockReason: UnlockReason.TriggerAndException,
    expectTriggersToBeLockedBy: "BichardForce02",
    expectExceptionsToBeLockedBy: "BichardForce02",
    expectedEvents: []
  },
  {
    description: "General handler cannot unlock a case that is not locked",
    triggerLockedBy: null,
    exceptionLockedBy: null,
    currentUserGroup: UserGroup.GeneralHandler,
    unlockReason: UnlockReason.TriggerAndException,
    expectTriggersToBeLockedBy: null,
    expectExceptionsToBeLockedBy: null,
    expectError: "Case is not locked",
    expectedEvents: []
  },
  {
    description: "Supervisor can unlock both triggers and exception when unlock reason is TriggerAndException",
    triggerLockedBy: "GeneralHandler",
    exceptionLockedBy: "GeneralHandler",
    currentUserGroup: UserGroup.Supervisor,
    unlockReason: UnlockReason.TriggerAndException,
    expectTriggersToBeLockedBy: null,
    expectExceptionsToBeLockedBy: null,
    expectedEvents: [exceptionUnlockedEvent(), triggerUnlockedEvent()]
  },
  {
    description: "Supervisor can unlock triggers when unlock reason is Trigger",
    triggerLockedBy: "GeneralHandler",
    exceptionLockedBy: "GeneralHandler",
    currentUserGroup: UserGroup.Supervisor,
    unlockReason: UnlockReason.Trigger,
    expectTriggersToBeLockedBy: null,
    expectExceptionsToBeLockedBy: "GeneralHandler",
    expectedEvents: [triggerUnlockedEvent()]
  },
  {
    description: "Supervisor can unlock exception when unlock reason is Exception",
    triggerLockedBy: "GeneralHandler",
    exceptionLockedBy: "GeneralHandler",
    currentUserGroup: UserGroup.Supervisor,
    unlockReason: UnlockReason.Exception,
    expectTriggersToBeLockedBy: "GeneralHandler",
    expectExceptionsToBeLockedBy: null,
    expectedEvents: [exceptionUnlockedEvent()]
  },
  {
    description:
      "Supervisor can unlock both triggers and exceptions when unlock reason is TriggerAndException and trigger is locked by BichardForce02",
    triggerLockedBy: "BichardForce02",
    exceptionLockedBy: "GeneralHandler",
    currentUserGroup: UserGroup.Supervisor,
    unlockReason: UnlockReason.TriggerAndException,
    expectTriggersToBeLockedBy: null,
    expectExceptionsToBeLockedBy: null,
    expectedEvents: [exceptionUnlockedEvent(), triggerUnlockedEvent()]
  },
  {
    description:
      "Supervisor can unlock both triggers and exceptions when unlock reason is TriggerAndException and exception is locked by BichardForce02",
    triggerLockedBy: "GeneralHandler",
    exceptionLockedBy: "BichardForce02",
    currentUserGroup: UserGroup.Supervisor,
    unlockReason: UnlockReason.TriggerAndException,
    expectTriggersToBeLockedBy: null,
    expectExceptionsToBeLockedBy: null,
    expectedEvents: [exceptionUnlockedEvent(), triggerUnlockedEvent()]
  },
  {
    description: "Supervisor can unlock the case when its locked by BichardForce02",
    triggerLockedBy: "BichardForce02",
    exceptionLockedBy: "BichardForce02",
    currentUserGroup: UserGroup.Supervisor,
    unlockReason: UnlockReason.TriggerAndException,
    expectTriggersToBeLockedBy: null,
    expectExceptionsToBeLockedBy: null,
    expectedEvents: [exceptionUnlockedEvent(), triggerUnlockedEvent()]
  },
  {
    description:
      "Supervisor can unlock triggers when the exception is not locked and unlock reason is TriggerAndException",
    triggerLockedBy: "GeneralHandler",
    exceptionLockedBy: null,
    currentUserGroup: UserGroup.Supervisor,
    unlockReason: UnlockReason.TriggerAndException,
    expectTriggersToBeLockedBy: null,
    expectExceptionsToBeLockedBy: null,
    expectedEvents: [triggerUnlockedEvent()]
  },
  {
    description:
      "Supervisor can unlock exception when the trigger is not locked and unlock reason is TriggerAndException",
    triggerLockedBy: null,
    exceptionLockedBy: "GeneralHandler",
    currentUserGroup: UserGroup.Supervisor,
    unlockReason: UnlockReason.TriggerAndException,
    expectTriggersToBeLockedBy: null,
    expectExceptionsToBeLockedBy: null,
    expectedEvents: [exceptionUnlockedEvent()]
  },
  {
    description: "Supervisor cannot unlock a case that is not locked",
    triggerLockedBy: null,
    exceptionLockedBy: null,
    currentUserGroup: UserGroup.Supervisor,
    unlockReason: UnlockReason.TriggerAndException,
    expectTriggersToBeLockedBy: null,
    expectExceptionsToBeLockedBy: null,
    expectError: "Case is not locked",
    expectedEvents: []
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
      triggerLockedBy,
      exceptionLockedBy,
      unlockReason,
      currentUserGroup,
      expectTriggersToBeLockedBy,
      expectExceptionsToBeLockedBy,
      expectError,
      expectedEvents
    }) => {
      const [courtCase, anotherCourtCase] = await insertCourtCasesWithFields([
        {
          errorLockedByUsername: exceptionLockedBy,
          triggerLockedByUsername: triggerLockedBy,
          orgForPoliceFilter: "36FPA ",
          errorId: 1
        },
        {
          errorLockedByUsername: exceptionLockedBy,
          triggerLockedByUsername: triggerLockedBy,
          orgForPoliceFilter: "36FPA ",
          errorId: 2
        }
      ])

      const user = {
        username: "GeneralHandler",
        visibleForces: ["36FPA1"],
        visibleCourts: [],
        hasAccessTo: userAccess({ groups: [currentUserGroup] })
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
        username: "dummy username",
        visibleForces: ["36FPA1"],
        visibleCourts: [],
        hasAccessTo: hasAccessToAll
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

      expect(receivedError.message).toEqual("Failed to update record with some error")
      expect(events).toHaveLength(0)
    })
  })
})
