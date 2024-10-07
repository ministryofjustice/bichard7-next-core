import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { differenceInMinutes } from "date-fns"
import User from "services/entities/User"
import { DataSource } from "typeorm"
import { isError } from "types/Result"
import { AUDIT_LOG_EVENT_SOURCE } from "../../src/config"
import CourtCase from "../../src/services/entities/CourtCase"
import Trigger from "../../src/services/entities/Trigger"
import getCourtCaseByOrganisationUnit from "../../src/services/getCourtCaseByOrganisationUnit"
import getDataSource from "../../src/services/getDataSource"
import resolveTriggers from "../../src/services/resolveTriggers"
import fetchAuditLogEvents from "../helpers/fetchAuditLogEvents"
import { hasAccessToAll } from "../helpers/hasAccessTo"
import deleteFromDynamoTable from "../utils/deleteFromDynamoTable"
import deleteFromEntity from "../utils/deleteFromEntity"
import { insertCourtCasesWithFields } from "../utils/insertCourtCases"
import insertException from "../utils/manageExceptions"
import { insertTriggers, TestTrigger } from "../utils/manageTriggers"

jest.setTimeout(100000)

describe("resolveTriggers", () => {
  let dataSource: DataSource

  const createTriggersEvent = (
    eventCode: string,
    eventType: string,
    triggers: string[],
    username = "TriggerHandler"
  ) => {
    return {
      category: "information",
      eventSource: AUDIT_LOG_EVENT_SOURCE,
      eventType,
      timestamp: expect.anything(),
      eventCode,
      user: username,
      attributes: {
        auditLogVersion: 2,
        "Number Of Triggers": triggers.length,
        ...triggers.reduce(
          (acc, trigger, index) => {
            acc[`Trigger ${index + 1} Details`] = trigger
            return acc
          },
          {} as Record<string, unknown>
        )
      }
    }
  }

  const createTriggersResolvedEvent = (triggers: string[], username = "TriggerHandler") =>
    createTriggersEvent("triggers.resolved", "Trigger marked as resolved by user", triggers, username)

  const createAllTriggersResolvedEvent = (triggers: string[], username = "TriggerHandler") =>
    createTriggersEvent("triggers.all-resolved", "All triggers marked as resolved", triggers, username)

  const triggerUnlockedEvent = {
    category: "information",
    eventSource: AUDIT_LOG_EVENT_SOURCE,
    eventType: "Trigger unlocked",
    timestamp: expect.anything(),
    user: "TriggerHandler",
    eventCode: "triggers.unlocked",
    attributes: {
      auditLogVersion: 2
    }
  }

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromEntity(CourtCase)
    await deleteFromDynamoTable("auditLogTable", "messageId")
    await deleteFromDynamoTable("auditLogEventsTable", "_id")
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  describe("Mark trigger as resolved", () => {
    const resolverUsername = "TriggerHandler"
    const visibleForce = "36"
    const user = {
      visibleCourts: [],
      visibleForces: [visibleForce],
      username: resolverUsername,
      hasAccessTo: hasAccessToAll
    } as Partial<User> as User

    it("Should set the relevant columns when resolving a trigger", async () => {
      const [courtCase] = await insertCourtCasesWithFields([
        {
          triggerLockedByUsername: resolverUsername,
          orgForPoliceFilter: visibleForce
        }
      ])
      const trigger: TestTrigger = {
        triggerId: 0,
        triggerCode: TriggerCode.TRPR0001,
        status: "Unresolved",
        createdAt: new Date("2022-07-12T10:22:34.000Z")
      }
      await insertTriggers(0, [trigger])

      const beforeCourtCaseResult = await getCourtCaseByOrganisationUnit(dataSource, 0, user)
      expect(isError(beforeCourtCaseResult)).toBeFalsy()
      expect(beforeCourtCaseResult).not.toBeNull()
      const beforeCourtCase = beforeCourtCaseResult as CourtCase
      expect(beforeCourtCase.triggerResolvedBy).toBeNull()
      expect(beforeCourtCase.triggerResolvedTimestamp).toBeNull()

      const result = await resolveTriggers(dataSource, [trigger.triggerId], courtCase.errorId, user)
      expect(isError(result)).toBeFalsy()

      const retrievedTrigger = await dataSource
        .getRepository(Trigger)
        .findOne({ where: { triggerId: trigger.triggerId } })
      expect(retrievedTrigger).not.toBeNull()
      const updatedTrigger = retrievedTrigger!

      expect(updatedTrigger.resolvedAt).not.toBeNull()
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const minsSinceResolved = differenceInMinutes(new Date(), updatedTrigger.resolvedAt!)
      expect(minsSinceResolved).toBeGreaterThanOrEqual(0)
      expect(minsSinceResolved).toBeLessThanOrEqual(5)

      expect(updatedTrigger.resolvedBy).not.toBeNull()
      expect(updatedTrigger.resolvedBy).toStrictEqual(resolverUsername)
      expect(updatedTrigger.status).toStrictEqual("Resolved")

      const afterCourtCaseResult = await getCourtCaseByOrganisationUnit(dataSource, 0, user)
      expect(isError(afterCourtCaseResult)).toBeFalsy()
      expect(afterCourtCaseResult).not.toBeNull()
      const afterCourtCase = afterCourtCaseResult as CourtCase

      expect(afterCourtCase.triggerResolvedBy).toStrictEqual(resolverUsername)
      expect(afterCourtCase.triggerResolvedTimestamp).not.toBeNull()
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const minsSinceCaseTriggersResolved = differenceInMinutes(new Date(), afterCourtCase.triggerResolvedTimestamp!)
      expect(minsSinceCaseTriggersResolved).toBeGreaterThanOrEqual(0)
      expect(minsSinceCaseTriggersResolved).toBeLessThanOrEqual(5)

      const events = await fetchAuditLogEvents(courtCase.messageId)
      expect(events).toHaveLength(3)
      expect(events).toContainEqual(createTriggersResolvedEvent(["TRPR0001"]))
      expect(events).toContainEqual(createAllTriggersResolvedEvent(["TRPR0001"]))
      expect(events).toContainEqual(triggerUnlockedEvent)
    })

    it("Should mark the entire case as resolved when there are no other unresolved triggers or exceptions", async () => {
      const [courtCase] = await insertCourtCasesWithFields([
        {
          errorLockedByUsername: resolverUsername,
          triggerLockedByUsername: resolverUsername,
          orgForPoliceFilter: visibleForce,
          errorCount: 0,
          errorReport: "",
          errorReason: ""
        }
      ])

      const trigger: TestTrigger = {
        triggerId: 0,
        triggerCode: TriggerCode.TRPR0001,
        triggerItemIdentity: 1,
        status: "Unresolved",
        createdAt: new Date("2022-07-12T10:22:34.000Z")
      }
      await insertTriggers(0, [trigger])

      const beforeCourtCaseResult = await getCourtCaseByOrganisationUnit(dataSource, 0, user)
      const beforeCourtCase = beforeCourtCaseResult as CourtCase
      expect(beforeCourtCase.resolutionTimestamp).toBeNull()
      expect(beforeCourtCase.triggerStatus).toBe("Unresolved")

      const result = await resolveTriggers(dataSource, [0], 0, user)

      expect(isError(result)).toBeFalsy()
      const updatedCourtCase = await getCourtCaseByOrganisationUnit(dataSource, 0, user)
      const afterCourtCaseResult = updatedCourtCase as CourtCase
      expect(afterCourtCaseResult.resolutionTimestamp).not.toBeNull()

      const events = await fetchAuditLogEvents(courtCase.messageId)
      expect(events).toHaveLength(3)
      expect(events).toContainEqual(createTriggersResolvedEvent(["TRPR0001 (1)"]))
      expect(events).toContainEqual(createAllTriggersResolvedEvent(["TRPR0001 (1)"]))
      expect(events).toContainEqual(triggerUnlockedEvent)
    })

    it("Should not set the case trigger status as resolved while there are other unresolved triggers or exceptions", async () => {
      const [courtCase] = await insertCourtCasesWithFields([
        {
          errorLockedByUsername: resolverUsername,
          triggerLockedByUsername: resolverUsername,
          orgForPoliceFilter: visibleForce
        }
      ])

      const triggerNotToBeResolved: TestTrigger = {
        triggerId: 0,
        triggerCode: TriggerCode.TRPR0001,
        status: "Unresolved",
        createdAt: new Date("2022-07-12T10:22:34.000Z")
      }
      const triggerToBeResolved: TestTrigger = {
        triggerId: 1,
        triggerCode: TriggerCode.TRPR0002,
        triggerItemIdentity: 2,
        status: "Unresolved",
        createdAt: new Date("2022-07-12T10:22:34.000Z")
      }
      await insertTriggers(0, [triggerNotToBeResolved, triggerToBeResolved])

      const courtCaseBeforeResolvingTrigger = (await getCourtCaseByOrganisationUnit(dataSource, 0, user)) as CourtCase
      expect(courtCaseBeforeResolvingTrigger.resolutionTimestamp).toBeNull()
      expect(courtCaseBeforeResolvingTrigger.triggerStatus).toBe("Unresolved")

      const resolveTriggersResult = await resolveTriggers(
        dataSource,
        [triggerToBeResolved.triggerId],
        courtCase.errorId,
        user
      ).catch((error) => error)
      expect(isError(resolveTriggersResult)).toBeFalsy()

      const courtCaseAfterResolvingTrigger = (await getCourtCaseByOrganisationUnit(dataSource, 0, user)) as CourtCase
      expect(courtCaseAfterResolvingTrigger.resolutionTimestamp).toBeNull()
      expect(courtCaseAfterResolvingTrigger.triggerStatus).toBe("Unresolved")

      const triggerNotToBeResolvedAfterResolving = (await dataSource
        .getRepository(Trigger)
        .findOne({ where: { triggerId: triggerNotToBeResolved.triggerId } }))!
      expect(triggerNotToBeResolvedAfterResolving).not.toBeNull()
      expect(triggerNotToBeResolvedAfterResolving.resolvedBy).toBeNull()
      expect(triggerNotToBeResolvedAfterResolving.resolvedAt).toBeNull()

      const triggerToBeResolvedAfterResolving = (await dataSource
        .getRepository(Trigger)
        .findOne({ where: { triggerId: triggerToBeResolved.triggerId } }))!
      expect(triggerToBeResolvedAfterResolving).not.toBeNull()
      expect(triggerToBeResolvedAfterResolving.resolvedBy).toBe(user.username)
      expect(triggerToBeResolvedAfterResolving.resolvedAt).not.toBeNull()

      const eventsAfterResolvingTrigger = await fetchAuditLogEvents(courtCase.messageId)
      expect(eventsAfterResolvingTrigger).toStrictEqual([createTriggersResolvedEvent(["TRPR0002 (2)"])])
    })

    it("Shouldn't overwrite an already resolved trigger when attempting to resolve again", async () => {
      const reResolverUser = {
        visibleCourts: [],
        visibleForces: [visibleForce],
        username: "BichardForce02",
        hasAccessTo: hasAccessToAll
      } as Partial<User> as User

      const [courtCase] = await insertCourtCasesWithFields([
        {
          triggerLockedByUsername: user.username,
          orgForPoliceFilter: visibleForce
        }
      ])

      const trigger: TestTrigger = {
        triggerId: 0,
        triggerCode: TriggerCode.TRPR0001,
        triggerItemIdentity: 0,
        status: "Unresolved",
        createdAt: new Date("2022-07-12T10:22:34.000Z")
      }
      await insertTriggers(courtCase.errorId, [trigger])

      // Resolve trigger
      let resolvedResult = await resolveTriggers(dataSource, [trigger.triggerId], courtCase.errorId, user).catch(
        (error) => error
      )
      expect(isError(resolvedResult)).toBeFalsy()

      // Try to resolve again as a different user
      resolvedResult = await resolveTriggers(dataSource, [trigger.triggerId], courtCase.errorId, reResolverUser).catch(
        (error) => error
      )

      expect(isError(resolvedResult)).toBeTruthy()
      expect((resolvedResult as Error).message).toBe("One or more triggers are already resolved")

      const updatedTrigger = (await dataSource
        .getRepository(Trigger)
        .findOne({ where: { triggerId: trigger.triggerId } }))!
      expect(updatedTrigger).not.toBeNull()
      expect(updatedTrigger.resolvedAt).not.toBeNull()
      expect(updatedTrigger.resolvedBy).toBe(user.username)

      const events = await fetchAuditLogEvents(courtCase.messageId)
      expect(events).toHaveLength(3)
      expect(events).toContainEqual(createTriggersResolvedEvent(["TRPR0001"]))
      expect(events).toContainEqual(createAllTriggersResolvedEvent(["TRPR0001"]))
      expect(events).toContainEqual(triggerUnlockedEvent)
    })

    it("Shouldn't resolve a trigger locked by someone else", async () => {
      const lockHolderUsername = "BichardForce02"
      const [courtCase] = await insertCourtCasesWithFields([
        {
          triggerLockedByUsername: lockHolderUsername,
          orgForPoliceFilter: visibleForce
        }
      ])

      const trigger: TestTrigger = {
        triggerId: 0,
        triggerCode: TriggerCode.TRPR0001,
        status: "Unresolved",
        createdAt: new Date("2022-07-12T10:22:34.000Z")
      }
      await insertTriggers(0, [trigger])

      // Attempt to resolve trigger whilst not holding the lock
      const resolveResult = await resolveTriggers(dataSource, [trigger.triggerId], courtCase.errorId, user).catch(
        (error) => error
      )
      expect(isError(resolveResult)).toBeTruthy()
      expect((resolveResult as Error).message).toBe("Triggers are not locked by the user")

      const retrievedTrigger = await dataSource
        .getRepository(Trigger)
        .findOne({ where: { triggerId: trigger.triggerId } })
      expect(retrievedTrigger).not.toBeNull()
      const updatedTrigger = retrievedTrigger!

      expect(updatedTrigger.resolvedAt).toBeNull()
      expect(updatedTrigger.resolvedBy).toBeNull()

      const events = await fetchAuditLogEvents(courtCase.messageId)
      expect(events).toHaveLength(0)
    })

    it("Shouldn't resolve a trigger which is not locked", async () => {
      const [courtCase] = await insertCourtCasesWithFields([{ orgForPoliceFilter: "36" }])
      const trigger: TestTrigger = {
        triggerId: 0,
        triggerCode: TriggerCode.TRPR0001,
        status: "Unresolved",
        createdAt: new Date("2022-07-12T10:22:34.000Z")
      }
      await insertTriggers(courtCase.errorId, [trigger])

      // Attempt to resolve trigger whilst not holding the lock
      const resolveResult = await resolveTriggers(dataSource, [trigger.triggerId], courtCase.errorId, user).catch(
        (error) => error
      )
      expect(isError(resolveResult)).toBeTruthy()
      expect((resolveResult as Error).message).toBe("Triggers are not locked by the user")

      const retrievedTrigger = await dataSource
        .getRepository(Trigger)
        .findOne({ where: { triggerId: trigger.triggerId } })
      expect(retrievedTrigger).not.toBeNull()
      const updatedTrigger = retrievedTrigger!

      expect(updatedTrigger.resolvedAt).toBeNull()
      expect(updatedTrigger.resolvedBy).toBeNull()

      const events = await fetchAuditLogEvents(courtCase.messageId)
      expect(events).toHaveLength(0)
    })

    it("Should set the case trigger columns and unlock the case only when the last trigger is resolved", async () => {
      const [courtCase] = await insertCourtCasesWithFields([
        {
          triggerLockedByUsername: resolverUsername,
          orgForPoliceFilter: visibleForce
        }
      ])
      const triggers: TestTrigger[] = [0, 1, 2].map((triggerId, index) => {
        return {
          triggerId,
          triggerCode: [TriggerCode.TRPR0001, TriggerCode.TRPR0002, TriggerCode.TRPR0003][index],
          status: "Unresolved",
          createdAt: new Date("2022-07-15T10:22:34.000Z")
        }
      })
      await insertTriggers(courtCase.errorId, triggers)

      let triggerResolveResult = await resolveTriggers(dataSource, [triggers[0].triggerId], courtCase.errorId, user)
      expect(isError(triggerResolveResult)).toBeFalsy()

      let updatedCourtCase = (await getCourtCaseByOrganisationUnit(dataSource, courtCase.errorId, user)) as CourtCase
      expect(updatedCourtCase).not.toBeNull()
      expect(updatedCourtCase.triggerStatus).not.toBeNull()
      expect(updatedCourtCase.triggerStatus).toStrictEqual("Unresolved")
      expect(updatedCourtCase.triggerResolvedBy).toBeNull()
      expect(updatedCourtCase.triggerResolvedTimestamp).toBeNull()
      expect(updatedCourtCase.triggerLockedByUsername).toEqual(resolverUsername)

      let events = await fetchAuditLogEvents(courtCase.messageId)
      expect(events).toStrictEqual([createTriggersResolvedEvent(["TRPR0001"])])

      triggerResolveResult = await resolveTriggers(dataSource, [triggers[1].triggerId], courtCase.errorId, user)
      expect(isError(triggerResolveResult)).toBeFalsy()

      updatedCourtCase = (await getCourtCaseByOrganisationUnit(dataSource, courtCase.errorId, user)) as CourtCase
      expect(updatedCourtCase).not.toBeNull()
      expect(updatedCourtCase.triggerStatus).not.toBeNull()
      expect(updatedCourtCase.triggerStatus).toStrictEqual("Unresolved")
      expect(updatedCourtCase.triggerResolvedBy).toBeNull()
      expect(updatedCourtCase.triggerResolvedTimestamp).toBeNull()
      expect(updatedCourtCase.triggerLockedByUsername).toEqual(resolverUsername)

      events = await fetchAuditLogEvents(courtCase.messageId)
      expect(events).toHaveLength(2)
      expect(events).toContainEqual(createTriggersResolvedEvent(["TRPR0001"]))
      expect(events).toContainEqual(createTriggersResolvedEvent(["TRPR0002"]))

      triggerResolveResult = await resolveTriggers(dataSource, [triggers[2].triggerId], courtCase.errorId, user)
      expect(isError(triggerResolveResult)).toBeFalsy()

      updatedCourtCase = (await getCourtCaseByOrganisationUnit(dataSource, courtCase.errorId, user)) as CourtCase
      expect(updatedCourtCase).not.toBeNull()
      expect(updatedCourtCase.triggerStatus).not.toBeNull()
      expect(updatedCourtCase.triggerStatus).toStrictEqual("Resolved")
      expect(updatedCourtCase.triggerResolvedBy).toStrictEqual(resolverUsername)
      expect(updatedCourtCase.triggerResolvedTimestamp).not.toBeNull()
      expect(updatedCourtCase.triggerLockedByUsername).toBeNull()

      events = await fetchAuditLogEvents(courtCase.messageId)
      expect(events).toHaveLength(5)
      expect(events).toContainEqual(createTriggersResolvedEvent(["TRPR0001"]))
      expect(events).toContainEqual(createTriggersResolvedEvent(["TRPR0002"]))
      expect(events).toContainEqual(createTriggersResolvedEvent(["TRPR0003"]))
      expect(events).toContainEqual(createAllTriggersResolvedEvent(["TRPR0001", "TRPR0002", "TRPR0003"]))
      expect(events).toContainEqual({
        category: "information",
        eventSource: AUDIT_LOG_EVENT_SOURCE,
        eventType: "Trigger unlocked",
        timestamp: expect.anything(),
        user: user.username,
        eventCode: "triggers.unlocked",
        attributes: {
          auditLogVersion: 2
        }
      })
    })

    it("Should be able to resolve all triggers on a case at once", async () => {
      const [courtCase] = await insertCourtCasesWithFields([
        {
          triggerLockedByUsername: resolverUsername,
          orgForPoliceFilter: visibleForce
        }
      ])
      const triggers: TestTrigger[] = [0, 1, 2].map((triggerId, index) => {
        return {
          triggerId,
          triggerCode: [TriggerCode.TRPR0001, TriggerCode.TRPR0002, TriggerCode.TRPR0003][index],
          status: "Unresolved",
          createdAt: new Date("2022-07-15T10:22:34.000Z")
        }
      })
      await insertTriggers(courtCase.errorId, triggers)

      const triggerResolveResult = await resolveTriggers(
        dataSource,
        triggers.map((trigger) => trigger.triggerId),
        courtCase.errorId,
        user
      )
      expect(isError(triggerResolveResult)).toBeFalsy()

      const retrievedCourtCase = await getCourtCaseByOrganisationUnit(dataSource, courtCase.errorId, user)
      const updatedCourtCase = retrievedCourtCase as CourtCase
      expect(updatedCourtCase).not.toBeNull()
      expect(updatedCourtCase.triggerStatus).toStrictEqual("Resolved")
      expect(updatedCourtCase.triggerResolvedBy).toStrictEqual(resolverUsername)
      expect(updatedCourtCase.triggerResolvedTimestamp).not.toBeNull()
      expect(updatedCourtCase.triggers).toHaveLength(triggers.length)
      updatedCourtCase.triggers.map((trigger) => {
        expect(trigger.status).toStrictEqual("Resolved")
        expect(trigger.resolvedBy).toStrictEqual(resolverUsername)
        expect(trigger.resolvedAt).not.toBeNull()
      })

      const events = await fetchAuditLogEvents(courtCase.messageId)
      expect(events).toHaveLength(3)
      expect(events).toContainEqual(createTriggersResolvedEvent(["TRPR0001", "TRPR0002", "TRPR0003"]))
      expect(events).toContainEqual(createAllTriggersResolvedEvent(["TRPR0001", "TRPR0002", "TRPR0003"]))
      expect(events).toContainEqual(triggerUnlockedEvent)
    })

    it("Should be able to resolve some of the triggers on a case at once", async () => {
      const [courtCase] = await insertCourtCasesWithFields([
        {
          triggerLockedByUsername: resolverUsername,
          orgForPoliceFilter: visibleForce
        }
      ])
      const triggers: TestTrigger[] = [0, 1, 2, 3, 4].map((triggerId, index) => {
        return {
          triggerId,
          triggerCode: [
            TriggerCode.TRPR0001,
            TriggerCode.TRPR0002,
            TriggerCode.TRPR0003,
            TriggerCode.TRPR0004,
            TriggerCode.TRPR0005
          ][index],
          status: "Unresolved",
          createdAt: new Date("2022-07-15T10:22:34.000Z")
        }
      })
      const triggersToResolve = [triggers[0].triggerId, triggers[2].triggerId, triggers[4].triggerId]
      await insertTriggers(courtCase.errorId, triggers)

      const triggerResolveResult = await resolveTriggers(dataSource, triggersToResolve, courtCase.errorId, user)
      expect(isError(triggerResolveResult)).toBeFalsy()

      const retrievedCourtCase = await getCourtCaseByOrganisationUnit(dataSource, courtCase.errorId, user)
      const updatedCourtCase = retrievedCourtCase as CourtCase
      expect(updatedCourtCase).not.toBeNull()
      expect(updatedCourtCase.triggerStatus).toStrictEqual("Unresolved")
      expect(updatedCourtCase.triggerResolvedBy).toBeNull()
      expect(updatedCourtCase.triggerResolvedTimestamp).toBeNull()
      expect(updatedCourtCase.triggers).toHaveLength(triggers.length)
      updatedCourtCase.triggers.map((trigger) => {
        if (triggersToResolve.includes(trigger.triggerId)) {
          expect(trigger.status).toStrictEqual("Resolved")
          expect(trigger.resolvedBy).toStrictEqual(resolverUsername)
          expect(trigger.resolvedAt).not.toBeNull()
        } else {
          expect(trigger.status).toStrictEqual("Unresolved")
          expect(trigger.resolvedBy).toBeNull()
          expect(trigger.resolvedAt).toBeNull()
        }
      })

      const resolvedTriggerCodes = triggers
        .filter((trigger) => triggersToResolve.includes(trigger.triggerId))
        .map((trigger) => trigger.triggerCode)
      const events = await fetchAuditLogEvents(courtCase.messageId)
      expect(events).toStrictEqual([createTriggersResolvedEvent(resolvedTriggerCodes)])
    })

    it("Shouldn't set resolution timestamp when a case has unresolved exceptions", async () => {
      const [courtCase] = await insertCourtCasesWithFields([
        {
          errorLockedByUsername: resolverUsername,
          triggerLockedByUsername: resolverUsername,
          orgForPoliceFilter: visibleForce
        }
      ])

      const trigger: TestTrigger = {
        triggerId: 0,
        triggerCode: TriggerCode.TRPR0001,
        status: "Unresolved",
        createdAt: new Date("2022-07-12T10:22:34.000Z")
      }
      await insertTriggers(0, [trigger])

      await insertException(courtCase.errorId, "HO100300", "HO100300", "Unresolved")

      const courtCaseBeforeResolvingTrigger = (await getCourtCaseByOrganisationUnit(dataSource, 0, user)) as CourtCase
      expect(courtCaseBeforeResolvingTrigger.resolutionTimestamp).toBeNull()
      expect(courtCaseBeforeResolvingTrigger.errorResolvedTimestamp).toBeNull()
      expect(courtCaseBeforeResolvingTrigger.triggerResolvedTimestamp).toBeNull()
      expect(courtCaseBeforeResolvingTrigger.triggerCount).toBe(1)
      expect(courtCaseBeforeResolvingTrigger.errorCount).toBe(2)

      const resolveTriggersResult = await resolveTriggers(
        dataSource,
        [trigger.triggerId],
        courtCase.errorId,
        user
      ).catch((error) => error)
      expect(isError(resolveTriggersResult)).toBeFalsy()

      const courtCaseAfterResolvingTrigger = (await getCourtCaseByOrganisationUnit(dataSource, 0, user)) as CourtCase
      expect(courtCaseAfterResolvingTrigger.resolutionTimestamp).toBeNull()
      expect(courtCaseAfterResolvingTrigger.errorResolvedTimestamp).toBeNull()
      expect(courtCaseAfterResolvingTrigger.triggerResolvedTimestamp).not.toBeNull()
      expect(courtCaseAfterResolvingTrigger.triggerCount).toBe(1)
      expect(courtCaseAfterResolvingTrigger.errorCount).toBe(2)
    })

    it("Should set resolution timestamp when a case has resolved exceptions", async () => {
      const [courtCase] = await insertCourtCasesWithFields([
        {
          errorLockedByUsername: resolverUsername,
          triggerLockedByUsername: resolverUsername,
          orgForPoliceFilter: visibleForce
        }
      ])

      const trigger: TestTrigger = {
        triggerId: 0,
        triggerCode: TriggerCode.TRPR0001,
        status: "Unresolved",
        createdAt: new Date("2022-07-12T10:22:34.000Z")
      }
      await insertTriggers(0, [trigger])

      await insertException(courtCase.errorId, "HO100300", "HO100300", "Resolved", user.username)

      const courtCaseBeforeResolvingTrigger = (await getCourtCaseByOrganisationUnit(dataSource, 0, user)) as CourtCase
      expect(courtCaseBeforeResolvingTrigger.resolutionTimestamp).toBeNull()
      expect(courtCaseBeforeResolvingTrigger.errorResolvedTimestamp).not.toBeNull()
      expect(courtCaseBeforeResolvingTrigger.triggerResolvedTimestamp).toBeNull()
      expect(courtCaseBeforeResolvingTrigger.triggerCount).toBe(1)
      expect(courtCaseBeforeResolvingTrigger.errorCount).toBe(2)

      const resolveTriggersResult = await resolveTriggers(
        dataSource,
        [trigger.triggerId],
        courtCase.errorId,
        user
      ).catch((error) => error)
      expect(isError(resolveTriggersResult)).toBeFalsy()

      const courtCaseAfterResolvingTrigger = (await getCourtCaseByOrganisationUnit(dataSource, 0, user)) as CourtCase
      expect(courtCaseAfterResolvingTrigger.resolutionTimestamp).not.toBeNull()
      expect(courtCaseAfterResolvingTrigger.errorResolvedTimestamp).not.toBeNull()
      expect(courtCaseAfterResolvingTrigger.triggerResolvedTimestamp).not.toBeNull()
      expect(courtCaseAfterResolvingTrigger.triggerCount).toBe(1)
      expect(courtCaseAfterResolvingTrigger.errorCount).toBe(2)
    })
  })
})
