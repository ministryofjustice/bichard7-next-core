import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import axios from "axios"
import User from "services/entities/User"
import getCourtCase from "services/getCourtCase"
import lockCourtCase from "services/lockCourtCase"
import courtCasesByOrganisationUnitQuery from "services/queries/courtCasesByOrganisationUnitQuery"
import { storeMessageAuditLogEvents } from "services/storeAuditLogEvents"
import updateLockStatusToLocked from "services/updateLockStatusToLocked"
import { DataSource } from "typeorm"
import { AUDIT_LOG_API_URL, AUDIT_LOG_EVENT_SOURCE } from "../../src/config"
import CourtCase from "../../src/services/entities/CourtCase"
import getDataSource from "../../src/services/getDataSource"
import { isError } from "../../src/types/Result"
import { hasAccessToAll } from "../helpers/hasAccessTo"
import deleteFromDynamoTable from "../utils/deleteFromDynamoTable"
import deleteFromEntity from "../utils/deleteFromEntity"
import { insertCourtCasesWithFields } from "../utils/insertCourtCases"
import { TestTrigger, insertTriggers } from "../utils/manageTriggers"

jest.mock("services/updateLockStatusToLocked")
jest.mock("services/storeAuditLogEvents")
jest.mock("services/queries/courtCasesByOrganisationUnitQuery")

describe("lock court case", () => {
  let dataSource: DataSource
  const lockedByName = "BichardForce04"
  const user = {
    username: lockedByName,
    visibleForces: ["36"],
    visibleCourts: [],
    hasAccessTo: hasAccessToAll
  } as Partial<User> as User
  let unlockedCourtCase: CourtCase

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromEntity(CourtCase)
    await deleteFromDynamoTable("auditLogTable", "messageId")
    await deleteFromDynamoTable("auditLogEventsTable", "_id")
    ;(updateLockStatusToLocked as jest.Mock).mockImplementation(
      jest.requireActual("services/updateLockStatusToLocked").default
    )
    ;(storeMessageAuditLogEvents as jest.Mock).mockImplementation(
      jest.requireActual("services/storeAuditLogEvents").storeMessageAuditLogEvents
    )
    ;[unlockedCourtCase] = await insertCourtCasesWithFields([
      {
        errorLockedByUsername: null,
        triggerLockedByUsername: null,
        errorCount: 1,
        triggerCount: 1,
        orgForPoliceFilter: "36FPA",
        errorId: 0
      }
    ])

    const trigger: TestTrigger = {
      triggerId: 0,
      triggerCode: TriggerCode.TRPR0001,
      status: "Unresolved",
      createdAt: new Date("2022-07-12T10:22:34.000Z")
    }
    await insertTriggers(0, [trigger])
    ;(courtCasesByOrganisationUnitQuery as jest.Mock).mockImplementation(
      jest.requireActual("services/queries/courtCasesByOrganisationUnitQuery").default
    )
  }, 20_000)

  afterEach(async () => {
    jest.resetAllMocks()
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  describe("when a case is successfully locked", () => {
    it("Should call courtCasesByOrganisationUnitQuery, updateLockStatusToLocked and storeAuditLogEvents", async () => {
      const expectedAuditLogEvents = [
        {
          attributes: { auditLogVersion: 2, user: lockedByName },
          category: "information",
          eventSource: AUDIT_LOG_EVENT_SOURCE,
          eventCode: "exceptions.locked",
          eventType: "Exception locked",
          timestamp: expect.anything()
        },
        {
          attributes: { auditLogVersion: 2, user: lockedByName },
          category: "information",
          eventSource: AUDIT_LOG_EVENT_SOURCE,
          eventCode: "triggers.locked",
          eventType: "Trigger locked",
          timestamp: expect.anything()
        }
      ]

      const result = await lockCourtCase(dataSource, unlockedCourtCase.errorId, user).catch((error) => error)

      expect(isError(result)).toBeFalsy()
      expect(courtCasesByOrganisationUnitQuery).toHaveBeenCalledTimes(1)
      expect(courtCasesByOrganisationUnitQuery).toHaveBeenCalledWith(expect.any(Object), user)
      expect(updateLockStatusToLocked).toHaveBeenCalledTimes(1)
      expect(updateLockStatusToLocked).toHaveBeenCalledWith(
        expect.any(Object),
        unlockedCourtCase.errorId,
        user,
        expectedAuditLogEvents
      )
      expect(storeMessageAuditLogEvents).toHaveBeenCalledTimes(1)
      expect(storeMessageAuditLogEvents).toHaveBeenCalledWith(unlockedCourtCase.messageId, expectedAuditLogEvents)
    }, 10000)

    it("Should lock the case and update the audit log events", async () => {
      const result = await lockCourtCase(dataSource, unlockedCourtCase.errorId, user)
      expect(isError(result)).toBe(false)

      const record = await dataSource
        .getRepository(CourtCase)
        .findOne({ where: { errorId: unlockedCourtCase.errorId } })
      const actualCourtCase = record as CourtCase
      expect(actualCourtCase.errorLockedByUsername).toBe(user.username)
      expect(actualCourtCase.triggerLockedByUsername).toBe(user.username)

      // Creates audit log events
      const apiResult = await axios(`${AUDIT_LOG_API_URL}/messages/${unlockedCourtCase.messageId}`)
      const auditLogs = (await apiResult.data) as [{ events: [{ timestamp: string; eventCode: string }] }]
      const events = auditLogs[0].events
      expect(events).toHaveLength(2)

      const lockedExceptionEvent = events.find((event) => event.eventCode === "exceptions.locked")
      const lockedTriggerEvent = events.find((event) => event.eventCode === "triggers.locked")

      expect(lockedExceptionEvent).toStrictEqual({
        category: "information",
        eventSource: AUDIT_LOG_EVENT_SOURCE,
        eventType: "Exception locked",
        timestamp: expect.anything(),
        user: user.username,
        eventCode: "exceptions.locked",
        attributes: {
          auditLogVersion: 2
        }
      })

      expect(lockedTriggerEvent).toStrictEqual({
        category: "information",
        eventSource: AUDIT_LOG_EVENT_SOURCE,
        eventType: "Trigger locked",
        timestamp: expect.anything(),
        user: user.username,
        eventCode: "triggers.locked",
        attributes: {
          auditLogVersion: 2
        }
      })
    })
  })

  describe("when there is an error", () => {
    it("Should return the error if fails to store audit logs", async () => {
      ;(storeMessageAuditLogEvents as jest.Mock).mockImplementationOnce(
        () => new Error(`Error while calling audit log API`)
      )

      const result = await lockCourtCase(dataSource, unlockedCourtCase.errorId, user).catch((error) => error)

      expect(result).toEqual(Error(`Error while calling audit log API`))

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: 0 } })
      const actualCourtCase = record as CourtCase

      expect(actualCourtCase.errorLockedByUsername).toBeNull()
      expect(actualCourtCase.triggerLockedByUsername).toBeNull()
    })

    it("Should not store audit log events if it fails to update the lock status", async () => {
      ;(updateLockStatusToLocked as jest.Mock).mockImplementationOnce(() => new Error(`Error while updating lock`))

      const result = await lockCourtCase(dataSource, unlockedCourtCase.errorId, user).catch((error) => error)

      expect(result).toEqual(Error(`Error while updating lock`))

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: 0 } })
      const actualCourtCase = record as CourtCase

      expect(actualCourtCase.errorLockedByUsername).toBeNull()
      expect(actualCourtCase.triggerLockedByUsername).toBeNull()

      const apiResult = await axios(`${AUDIT_LOG_API_URL}/messages/${unlockedCourtCase.messageId}`)
      const auditLogs = (await apiResult.data) as [{ events: [{ timestamp: string; eventCode: string }] }]
      const events = auditLogs[0].events

      expect(events).toHaveLength(0)
    })
  })

  describe("When attempting to lock cases with resolved triggers or exceptions", () => {
    it("Should lock an unresolved exception when all triggers are resolved", async () => {
      const courtCaseId = 1
      const [courtCase] = await insertCourtCasesWithFields([
        {
          errorId: courtCaseId,
          errorLockedByUsername: null,
          triggerLockedByUsername: null,
          errorCount: 1,
          errorStatus: "Unresolved",
          triggerCount: 1,
          triggerStatus: "Resolved",
          orgForPoliceFilter: "36FPA "
        }
      ])

      const result = await lockCourtCase(dataSource, courtCase.errorId, user)
      expect(isError(result)).toBeFalsy()

      const fetchedCourtCase = await getCourtCase(dataSource, courtCaseId)
      expect(isError(fetchedCourtCase)).toBeFalsy()
      const updatedCourtCase = fetchedCourtCase as CourtCase

      expect(updatedCourtCase.errorLockedByUsername).toBe(user.username)
      expect(updatedCourtCase.triggerLockedByUsername).toBeNull()
    })

    it("Should lock an unresolved trigger when all exceptions are resolved", async () => {
      const courtCaseId = 1
      const [courtCase] = await insertCourtCasesWithFields([
        {
          errorId: courtCaseId,
          errorLockedByUsername: null,
          triggerLockedByUsername: null,
          errorCount: 1,
          errorStatus: "Resolved",
          triggerCount: 1,
          triggerStatus: "Unresolved",
          orgForPoliceFilter: "36FPA "
        }
      ])

      const result = await lockCourtCase(dataSource, courtCase.errorId, user)
      expect(isError(result)).toBeFalsy()

      const fetchedCourtCase = await getCourtCase(dataSource, courtCaseId)
      expect(isError(fetchedCourtCase)).toBeFalsy()
      const updatedCourtCase = fetchedCourtCase as CourtCase

      expect(updatedCourtCase.triggerLockedByUsername).toBe(user.username)
      expect(updatedCourtCase.errorLockedByUsername).toBeNull()
    })

    it("Should lock neither triggers nor exceptions when both are resolved", async () => {
      const courtCaseId = 1
      const [courtCase] = await insertCourtCasesWithFields([
        {
          errorId: courtCaseId,
          errorLockedByUsername: null,
          triggerLockedByUsername: null,
          errorCount: 1,
          errorStatus: "Resolved",
          triggerCount: 1,
          triggerStatus: "Resolved",
          orgForPoliceFilter: "36FPA "
        }
      ])

      const result = await lockCourtCase(dataSource, courtCase.errorId, user)
      expect(isError(result)).toBeFalsy()

      const fetchedCourtCase = await getCourtCase(dataSource, courtCaseId)
      expect(isError(fetchedCourtCase)).toBeFalsy()
      const updatedCourtCase = fetchedCourtCase as CourtCase

      expect(updatedCourtCase.triggerLockedByUsername).toBeNull()
      expect(updatedCourtCase.errorLockedByUsername).toBeNull()
    })
  })
})
