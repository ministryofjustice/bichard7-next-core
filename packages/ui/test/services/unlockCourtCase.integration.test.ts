import axios from "axios"
import User from "services/entities/User"
import courtCasesByOrganisationUnitQuery from "services/queries/courtCasesByOrganisationUnitQuery"
import { storeMessageAuditLogEvents } from "services/storeAuditLogEvents"
import unlockCourtCase from "services/unlockCourtCase"
import updateLockStatusToUnlocked from "services/updateLockStatusToUnlocked"
import { DataSource } from "typeorm"
import UnlockReason from "types/UnlockReason"
import { AUDIT_LOG_API_URL, AUDIT_LOG_EVENT_SOURCE } from "../../src/config"
import CourtCase from "../../src/services/entities/CourtCase"
import getCourtCase from "../../src/services/getCourtCase"
import getDataSource from "../../src/services/getDataSource"
import { isError } from "../../src/types/Result"
import { hasAccessToAll } from "../helpers/hasAccessTo"
import deleteFromDynamoTable from "../utils/deleteFromDynamoTable"
import deleteFromEntity from "../utils/deleteFromEntity"
import { insertCourtCasesWithFields } from "../utils/insertCourtCases"

jest.mock("services/updateLockStatusToUnlocked")
jest.mock("services/storeAuditLogEvents")
jest.mock("services/queries/courtCasesByOrganisationUnitQuery")

describe("unlock court case", () => {
  let dataSource: DataSource
  const lockedByName = "BichardForce04"
  const user = {
    username: lockedByName,
    visibleForces: ["36"],
    visibleCourts: [],
    hasAccessTo: hasAccessToAll
  } as Partial<User> as User
  let lockedCourtCase: CourtCase

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromEntity(CourtCase)
    await deleteFromDynamoTable("auditLogTable", "messageId")
    await deleteFromDynamoTable("auditLogEventsTable", "_id")
    ;(updateLockStatusToUnlocked as jest.Mock).mockImplementation(
      jest.requireActual("services/updateLockStatusToUnlocked").default
    )
    ;(storeMessageAuditLogEvents as jest.Mock).mockImplementation(
      jest.requireActual("services/storeAuditLogEvents").storeMessageAuditLogEvents
    )
    ;(courtCasesByOrganisationUnitQuery as jest.Mock).mockImplementation(
      jest.requireActual("services/queries/courtCasesByOrganisationUnitQuery").default
    )

    lockedCourtCase = (
      (await insertCourtCasesWithFields([
        {
          errorLockedByUsername: lockedByName,
          triggerLockedByUsername: lockedByName,
          orgForPoliceFilter: "36FPA ",
          errorId: 0
        }
      ])) as CourtCase[]
    )[0]
  }, 20_000)

  afterEach(async () => {
    jest.resetAllMocks()
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  describe("when a case is successfully unlocked", () => {
    it("Should call courtCasesByOrganisationUnitQuery, updateLockStatusToUnlocked and storeAuditLogEvents", async () => {
      const expectedAuditLogEvents = [
        {
          attributes: { auditLogVersion: 2, user: lockedByName },
          category: "information",
          eventSource: AUDIT_LOG_EVENT_SOURCE,
          eventCode: "exceptions.unlocked",
          eventType: "Exception unlocked",
          timestamp: expect.anything()
        },
        {
          attributes: { auditLogVersion: 2, user: lockedByName },
          category: "information",
          eventSource: AUDIT_LOG_EVENT_SOURCE,
          eventCode: "triggers.unlocked",
          eventType: "Trigger unlocked",
          timestamp: expect.anything()
        }
      ]

      const expectedToCallWithCourtCase = await getCourtCase(dataSource, lockedCourtCase.errorId)

      await unlockCourtCase(dataSource, lockedCourtCase.errorId, user, UnlockReason.TriggerAndException).catch(
        (error) => error
      )

      expect(courtCasesByOrganisationUnitQuery).toHaveBeenCalledTimes(1)
      expect(courtCasesByOrganisationUnitQuery).toHaveBeenCalledWith(expect.any(Object), user)
      expect(updateLockStatusToUnlocked).toHaveBeenCalledTimes(1)
      expect(updateLockStatusToUnlocked).toHaveBeenCalledWith(
        expect.any(Object),
        expectedToCallWithCourtCase,
        user,
        UnlockReason.TriggerAndException,
        expectedAuditLogEvents
      )
      expect(storeMessageAuditLogEvents).toHaveBeenCalledTimes(1)
      expect(storeMessageAuditLogEvents).toHaveBeenCalledWith(lockedCourtCase.messageId, expectedAuditLogEvents)
    })

    it("Should unlock the case and update the audit log events", async () => {
      const result = await unlockCourtCase(dataSource, lockedCourtCase.errorId, user, UnlockReason.TriggerAndException)
      expect(isError(result)).toBe(false)

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: lockedCourtCase.errorId } })
      const actualCourtCase = record as CourtCase
      expect(actualCourtCase.errorLockedByUsername).toBeNull()
      expect(actualCourtCase.triggerLockedByUsername).toBeNull()

      // Creates audit log events
      const apiResult = await axios(`${AUDIT_LOG_API_URL}/messages/${lockedCourtCase.messageId}`)
      const auditLogs = (await apiResult.data) as [{ events: [{ timestamp: string; eventCode: string }] }]
      const events = auditLogs[0].events
      expect(events).toHaveLength(2)

      const unlockedExceptionEvent = events.find((event) => event.eventCode === "exceptions.unlocked")
      const unlockedTriggerEvent = events.find((event) => event.eventCode === "triggers.unlocked")

      expect(unlockedExceptionEvent).toStrictEqual({
        category: "information",
        eventSource: AUDIT_LOG_EVENT_SOURCE,
        eventType: "Exception unlocked",
        timestamp: expect.anything(),
        user: user.username,
        eventCode: "exceptions.unlocked",
        attributes: {
          auditLogVersion: 2
        }
      })

      expect(unlockedTriggerEvent).toStrictEqual({
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
  })

  describe("when there is an error", () => {
    it("Should return the error if fails to store audit logs", async () => {
      ;(storeMessageAuditLogEvents as jest.Mock).mockImplementationOnce(
        () => new Error(`Error while calling audit log API`)
      )

      const result = await unlockCourtCase(
        dataSource,
        lockedCourtCase.errorId,
        user,
        UnlockReason.TriggerAndException
      ).catch((error) => error)

      expect(result).toEqual(Error(`Error while calling audit log API`))

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: 0 } })
      const actualCourtCase = record as CourtCase

      expect(actualCourtCase.errorLockedByUsername).toBe(lockedByName)
      expect(actualCourtCase.triggerLockedByUsername).toBe(lockedByName)
    })

    it("Should not store audit log events if it fails to update the lock status", async () => {
      ;(updateLockStatusToUnlocked as jest.Mock).mockImplementationOnce(() => new Error(`Error while updating lock`))

      const result = await unlockCourtCase(
        dataSource,
        lockedCourtCase.errorId,
        user,
        UnlockReason.TriggerAndException
      ).catch((error) => error)

      expect(result).toEqual(Error(`Error while updating lock`))

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: 0 } })
      const actualCourtCase = record as CourtCase

      expect(actualCourtCase.errorLockedByUsername).toBe(lockedByName)
      expect(actualCourtCase.triggerLockedByUsername).toBe(lockedByName)

      const apiResult = await axios(`${AUDIT_LOG_API_URL}/messages/${lockedCourtCase.messageId}`)
      const auditLogs = (await apiResult.data) as [{ events: [{ timestamp: string; eventCode: string }] }]
      const events = auditLogs[0].events

      expect(events).toHaveLength(0)
    })
  })
})
