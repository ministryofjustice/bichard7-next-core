import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import axios from "axios"
import { differenceInMilliseconds } from "date-fns"
import type User from "services/entities/User"
import insertNotes from "services/insertNotes"
import courtCasesByOrganisationUnitQuery from "services/queries/courtCasesByOrganisationUnitQuery"
import { storeMessageAuditLogEvents } from "services/storeAuditLogEvents"
import updateLockStatusToUnlocked from "services/updateLockStatusToUnlocked"
import type { DataSource } from "typeorm"
import { UpdateQueryBuilder } from "typeorm"
import type { ManualResolution } from "types/ManualResolution"
import { ResolutionReasonCode } from "types/ManualResolution"
import { isError } from "types/Result"
import { AUDIT_LOG_API_URL, AUDIT_LOG_EVENT_SOURCE } from "../../src/config"
import CourtCase from "../../src/services/entities/CourtCase"
import getCourtCaseByOrganisationUnit from "../../src/services/getCourtCaseByOrganisationUnit"
import getDataSource from "../../src/services/getDataSource"
import resolveCourtCase from "../../src/services/resolveCourtCase"
import { hasAccessToAll } from "../helpers/hasAccessTo"
import deleteFromDynamoTable from "../utils/deleteFromDynamoTable"
import deleteFromEntity from "../utils/deleteFromEntity"
import { insertCourtCasesWithFields } from "../utils/insertCourtCases"
import type { TestTrigger } from "../utils/manageTriggers"
import { insertTriggers } from "../utils/manageTriggers"

jest.setTimeout(100000)
jest.mock("services/insertNotes")
jest.mock("services/updateLockStatusToUnlocked")
jest.mock("services/storeAuditLogEvents")
jest.mock("services/queries/courtCasesByOrganisationUnitQuery")

const expectToBeUnresolved = (courtCase: CourtCase) => {
  expect(courtCase.errorStatus).toBe("Unresolved")
  expect(courtCase.errorLockedByUsername).not.toBeNull()
  expect(courtCase.triggerLockedByUsername).not.toBeNull()
  expect(courtCase.errorResolvedBy).toBeNull()
  expect(courtCase.errorResolvedTimestamp).toBeNull()
  expect(courtCase.resolutionTimestamp).toBeNull()
  expect(courtCase.errorResolvedTimestamp).toBeNull()
  expect(courtCase.notes).toHaveLength(0)
}

describe("resolveCourtCase", () => {
  let dataSource: DataSource
  const visibleForce = "36"
  const resolverUsername = "GeneralHandler"
  const user = {
    visibleCourts: [],
    visibleForces: [visibleForce],
    username: resolverUsername,
    hasAccessTo: hasAccessToAll
  } as Partial<User> as User

  beforeAll(async () => {
    dataSource = await getDataSource()
    jest.resetAllMocks()
    jest.clearAllMocks()
    ;(insertNotes as jest.Mock).mockImplementation(jest.requireActual("services/insertNotes").default)
    ;(updateLockStatusToUnlocked as jest.Mock).mockImplementation(
      jest.requireActual("services/updateLockStatusToUnlocked").default
    )
    ;(storeMessageAuditLogEvents as jest.Mock).mockImplementation(
      jest.requireActual("services/storeAuditLogEvents").storeMessageAuditLogEvents
    )
    ;(courtCasesByOrganisationUnitQuery as jest.Mock).mockImplementation(
      jest.requireActual("services/queries/courtCasesByOrganisationUnitQuery").default
    )
  })

  beforeEach(async () => {
    await deleteFromEntity(CourtCase)
    await deleteFromDynamoTable("auditLogTable", "messageId")
    await deleteFromDynamoTable("auditLogEventsTable", "_id")
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  it("Should call cases by organisation unit query", async () => {
    const [courtCase] = await insertCourtCasesWithFields([
      {
        errorLockedByUsername: resolverUsername,
        triggerLockedByUsername: resolverUsername,
        orgForPoliceFilter: visibleForce,
        errorStatus: "Unresolved",
        errorCount: 4
      }
    ])
    await resolveCourtCase(
      dataSource,
      courtCase,
      {
        reason: "NonRecordable"
      },
      user
    ).catch((error) => error)

    expect(courtCasesByOrganisationUnitQuery).toHaveBeenCalledTimes(1)
    expect(courtCasesByOrganisationUnitQuery).toHaveBeenCalledWith(expect.any(Object), user)
  })

  describe("When there aren't any unresolved triggers", () => {
    it("Should resolve a case and populate a resolutionTimestamp", async () => {
      const [courtCase] = await insertCourtCasesWithFields([
        {
          errorLockedByUsername: resolverUsername,
          triggerLockedByUsername: resolverUsername,
          orgForPoliceFilter: visibleForce,
          errorStatus: "Unresolved",
          errorCount: 4
        }
      ])

      const resolution: ManualResolution = {
        reason: "NonRecordable",
        reasonText: "Some description"
      }

      const beforeCourtCaseResult = await getCourtCaseByOrganisationUnit(dataSource, 0, user)
      expect(isError(beforeCourtCaseResult)).toBeFalsy()
      expect(beforeCourtCaseResult).not.toBeNull()
      const beforeCourtCase = beforeCourtCaseResult as CourtCase
      expect(beforeCourtCase.errorStatus).toBe("Unresolved")
      expect(beforeCourtCase.errorLockedByUsername).toEqual(resolverUsername)
      expect(beforeCourtCase.triggerLockedByUsername).toEqual(resolverUsername)
      expect(beforeCourtCase.errorResolvedBy).toBeNull()
      expect(beforeCourtCase.errorResolvedTimestamp).toBeNull()
      expect(beforeCourtCase.resolutionTimestamp).toBeNull()

      const result = await resolveCourtCase(dataSource, courtCase, resolution, user)

      expect(isError(result)).toBeFalsy()

      const afterCourtCaseResult = await getCourtCaseByOrganisationUnit(dataSource, 0, user)
      expect(isError(afterCourtCaseResult)).toBeFalsy()
      expect(afterCourtCaseResult).not.toBeNull()
      const afterCourtCase = afterCourtCaseResult as CourtCase

      // Resolves the error
      expect(afterCourtCase.errorStatus).toBe("Resolved")
      // Unlocks the case
      expect(afterCourtCase.errorLockedByUsername).toBeNull()
      expect(afterCourtCase.triggerLockedByUsername).toBeNull()
      // Sets resolver user
      expect(afterCourtCase.errorResolvedBy).toEqual(resolverUsername)

      // Sets the timestamps
      expect(afterCourtCase.errorResolvedTimestamp).not.toBeNull()
      expect(afterCourtCase.resolutionTimestamp).not.toBeNull()
      // When there are no unresolved triggers the resolution time stamp also set
      expect(afterCourtCase.errorResolvedTimestamp).toEqual(afterCourtCase.resolutionTimestamp)

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const timeSinceCaseTriggersResolved = differenceInMilliseconds(new Date(), afterCourtCase.errorResolvedTimestamp!)
      expect(timeSinceCaseTriggersResolved).toBeGreaterThanOrEqual(0)

      // Creates a system note
      expect(afterCourtCase.notes[0].userId).toBe("System")
      expect(afterCourtCase.notes[0].noteText).toEqual(
        `${resolverUsername}: Portal Action: Record Manually Resolved.` +
          ` Reason: ${resolution.reason}. Reason Text: ${resolution.reasonText}`
      )

      // Creates audit log events
      const apiResult = await axios(`${AUDIT_LOG_API_URL}/messages/${courtCase.messageId}`)
      const auditLogs = (await apiResult.data) as [{ events: [{ timestamp: string; eventCode: string }] }]
      const events = auditLogs[0].events
      const unlockedEvent = events.find((event) => event.eventCode === "exceptions.unlocked")
      const resolvedEvent = events.find((event) => event.eventCode === "exceptions.resolved")

      expect(unlockedEvent).toStrictEqual({
        category: "information",
        eventSource: AUDIT_LOG_EVENT_SOURCE,
        eventType: "Exception unlocked",
        timestamp: expect.anything(),
        user: resolverUsername,
        eventCode: "exceptions.unlocked",
        attributes: {
          auditLogVersion: 2
        }
      })

      expect(resolvedEvent).toStrictEqual({
        attributes: {
          auditLogVersion: 2,
          resolutionReasonCode: ResolutionReasonCode[resolution.reason],
          resolutionReasonText: resolution.reasonText
        },
        category: "information",
        eventSource: AUDIT_LOG_EVENT_SOURCE,
        eventType: "Exception marked as resolved by user",
        eventCode: "exceptions.resolved",
        user: resolverUsername,
        timestamp: expect.anything()
      })

      expect(new Date(unlockedEvent!.timestamp).getTime()).toBeGreaterThanOrEqual(
        new Date(resolvedEvent!.timestamp).getTime()
      )
    })

    it("Should only resolve the case that matches the case id", async () => {
      const firstCaseId = 0
      const secondCaseId = 1
      const [firstCourtCase] = await insertCourtCasesWithFields([
        {
          errorId: firstCaseId,
          errorLockedByUsername: resolverUsername,
          triggerLockedByUsername: resolverUsername,
          orgForPoliceFilter: visibleForce,
          errorStatus: "Unresolved",
          errorCount: 1
        },
        {
          errorId: secondCaseId,
          errorLockedByUsername: resolverUsername,
          triggerLockedByUsername: resolverUsername,
          orgForPoliceFilter: visibleForce,
          errorStatus: "Unresolved",
          errorCount: 1
        }
      ])

      const resolution: ManualResolution = {
        reason: "NonRecordable"
      }

      const result = await resolveCourtCase(dataSource, firstCourtCase, resolution, user)
      expect(isError(result)).toBeFalsy()

      const records = await dataSource
        .getRepository(CourtCase)
        .createQueryBuilder("courtCase")
        .orderBy("courtCase.errorId")
        .getMany()
        .catch((error: Error) => error)
      const courtCases = records as CourtCase[]

      expect(courtCases[0].errorId).toEqual(firstCaseId)
      expect(courtCases[0].errorStatus).toBe("Resolved")

      expect(courtCases[1].errorId).toEqual(secondCaseId)
      expect(courtCases[1].errorStatus).toBe("Unresolved")
    })

    it("Should only resolve the case that matches the organisation unit", async () => {
      const caseId = 0
      const [courtCase] = await insertCourtCasesWithFields([
        {
          errorId: caseId,
          errorLockedByUsername: resolverUsername,
          triggerLockedByUsername: resolverUsername,
          orgForPoliceFilter: "3LSE",
          errorStatus: "Unresolved",
          errorCount: 1
        }
      ])

      const resolution: ManualResolution = {
        reason: "NonRecordable"
      }

      const result = await resolveCourtCase(dataSource, courtCase, resolution, user).catch((error) => error)
      expect((result as Error).message).toBe("Failed to resolve case")

      const records = await dataSource
        .getRepository(CourtCase)
        .createQueryBuilder("courtCase")
        .getMany()
        .catch((error: Error) => error)
      const courtCases = records as CourtCase[]

      expect(courtCases).toHaveLength(1)
      expect(courtCases[0].errorId).toEqual(caseId)
      expect(courtCases[0].errorStatus).toBe("Unresolved")
    })

    it("Should not resolve a case when the case is locked by another user", async () => {
      const anotherUser = "BichardForce02"
      const [courtCase] = await insertCourtCasesWithFields([
        {
          errorLockedByUsername: anotherUser,
          triggerLockedByUsername: anotherUser,
          orgForPoliceFilter: visibleForce,
          errorStatus: "Unresolved",
          errorCount: 1
        }
      ])

      const resolution: ManualResolution = {
        reason: "NonRecordable"
      }

      const result = await resolveCourtCase(dataSource, courtCase, resolution, user).catch((error) => error)
      expect(isError(result)).toBeTruthy()
      expect((result as Error).message).toBe("Failed to resolve case")

      const afterCourtCaseResult = await getCourtCaseByOrganisationUnit(dataSource, 0, user)
      expect(isError(afterCourtCaseResult)).toBeFalsy()
      expect(afterCourtCaseResult).not.toBeNull()
      const afterCourtCase = afterCourtCaseResult as CourtCase

      expectToBeUnresolved(afterCourtCase)
    })

    it("Should not resolve a case when the case is not locked", async () => {
      const [courtCase] = await insertCourtCasesWithFields([
        {
          errorLockedByUsername: null,
          triggerLockedByUsername: null,
          orgForPoliceFilter: visibleForce,
          errorStatus: "Unresolved",
          errorCount: 1
        }
      ])

      const resolution: ManualResolution = {
        reason: "NonRecordable"
      }

      const result = await resolveCourtCase(dataSource, courtCase, resolution, user).catch((error) => error)
      expect(isError(result)).toBeTruthy()
      expect((result as Error).message).toBe("Failed to resolve case")

      const afterCourtCaseResult = await getCourtCaseByOrganisationUnit(dataSource, 0, user)
      expect(isError(afterCourtCaseResult)).toBeFalsy()
      expect(afterCourtCaseResult).not.toBeNull()
      const afterCourtCase = afterCourtCaseResult as CourtCase

      expect(afterCourtCase.errorStatus).toBe("Unresolved")
    })

    it("Should return the error when the resolution reason is 'Reallocated' but reasonText is not provided", async () => {
      const [courtCase] = await insertCourtCasesWithFields([
        {
          errorLockedByUsername: resolverUsername,
          triggerLockedByUsername: resolverUsername,
          orgForPoliceFilter: visibleForce,
          errorStatus: "Unresolved",
          errorCount: 1
        }
      ])

      let result = await resolveCourtCase(
        dataSource,
        courtCase,
        {
          reason: "Reallocated",
          reasonText: undefined
        },
        user
      ).catch((error) => error)
      expect(isError(result)).toBeTruthy()
      expect((result as Error).message).toBe("Reason text is required")

      result = await resolveCourtCase(
        dataSource,
        courtCase,
        {
          reason: "Reallocated",
          reasonText: "Text provided"
        },
        user
      )
      expect(isError(result)).toBeFalsy()
    })
  })

  describe("When there are unresolved triggers", () => {
    let courtCase: CourtCase
    beforeEach(async () => {
      ;[courtCase] = await insertCourtCasesWithFields([
        {
          errorLockedByUsername: resolverUsername,
          triggerLockedByUsername: resolverUsername,
          orgForPoliceFilter: visibleForce,
          errorStatus: "Unresolved",
          errorCount: 1
        }
      ])

      const trigger: TestTrigger = {
        triggerId: 0,
        triggerCode: TriggerCode.TRPR0001,
        status: "Unresolved",
        createdAt: new Date("2022-07-12T10:22:34.000Z")
      }
      await insertTriggers(0, [trigger])
    })

    it("Should resolve a case without setting a resolutionTimestamp", async () => {
      const resolution: ManualResolution = {
        reason: "NonRecordable"
      }

      const result = await resolveCourtCase(dataSource, courtCase, resolution, user)

      expect(isError(result)).toBeFalsy()

      const afterCourtCaseResult = await getCourtCaseByOrganisationUnit(dataSource, 0, user)
      expect(isError(afterCourtCaseResult)).toBeFalsy()
      expect(afterCourtCaseResult).not.toBeNull()
      const afterCourtCase = afterCourtCaseResult as CourtCase

      expect(afterCourtCase.errorStatus).toBe("Resolved")
      expect(afterCourtCase.errorLockedByUsername).toBeNull()
      expect(afterCourtCase.triggerLockedByUsername).toBeNull()
      expect(afterCourtCase.errorResolvedBy).toEqual(resolverUsername)
      expect(afterCourtCase.errorResolvedTimestamp).not.toBeNull()
      expect(afterCourtCase.notes[0].userId).toBe("System")
      expect(afterCourtCase.notes[0].noteText).toEqual(
        `${resolverUsername}: Portal Action: Record Manually Resolved.` +
          ` Reason: ${resolution.reason}. Reason Text: ${resolution.reasonText}`
      )

      expect(afterCourtCase.resolutionTimestamp).toBeNull()
    })
  })

  describe("When there are triggers but no errors on a case", () => {
    let courtCases: CourtCase[] = []
    beforeEach(async () => {
      courtCases = await insertCourtCasesWithFields([
        {
          errorLockedByUsername: resolverUsername,
          triggerLockedByUsername: resolverUsername,
          errorStatus: null,
          errorCount: 0,
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
    })

    it("Should not resolve the case", async () => {
      const resolution: ManualResolution = {
        reason: "NonRecordable"
      }

      const result = await resolveCourtCase(dataSource, courtCases[0], resolution, user).catch((error) => error)

      expect(isError(result)).toBeTruthy()

      const afterCourtCaseResult = await getCourtCaseByOrganisationUnit(dataSource, 0, user)
      expect(isError(afterCourtCaseResult)).toBeFalsy()
      expect(afterCourtCaseResult).not.toBeNull()
      const afterCourtCase = afterCourtCaseResult as CourtCase

      expect(afterCourtCase.errorStatus).toBeNull()
      expect(afterCourtCase.errorLockedByUsername).toEqual(resolverUsername)
      expect(afterCourtCase.triggerLockedByUsername).toEqual(resolverUsername)
      expect(afterCourtCase.errorResolvedBy).toBeNull()
      expect(afterCourtCase.errorResolvedTimestamp).toBeNull()
      expect(afterCourtCase.resolutionTimestamp).toBeNull()
      expect(afterCourtCase.errorResolvedTimestamp).toBeNull()
      expect(afterCourtCase.notes).toHaveLength(0)
    })
  })

  describe("when there is an unexpected error", () => {
    let courtCases: CourtCase[] = []
    const resolution: ManualResolution = {
      reason: "NonRecordable"
    }

    beforeEach(async () => {
      courtCases = await insertCourtCasesWithFields([
        {
          errorLockedByUsername: resolverUsername,
          triggerLockedByUsername: resolverUsername,
          orgForPoliceFilter: visibleForce,
          errorStatus: "Unresolved",
          errorCount: 1
        }
      ])
    })

    it("Should return the error if fails to create notes", async () => {
      ;(insertNotes as jest.Mock).mockImplementationOnce(() => new Error("Error while creating notes"))

      const result = await resolveCourtCase(dataSource, courtCases[0], resolution, user).catch(
        (error) => error as Error
      )

      expect(result).toEqual(Error("Error while creating notes"))

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: 0 } })
      const actualCourtCase = record as CourtCase

      expectToBeUnresolved(actualCourtCase)
    })

    it("Should return the error if fails to unlock the case", async () => {
      ;(updateLockStatusToUnlocked as jest.Mock).mockImplementationOnce(
        () => new Error("Error while unlocking the case")
      )

      const result = await resolveCourtCase(dataSource, courtCases[0], resolution, user).catch(
        (error) => error as Error
      )

      expect(result).toEqual(Error("Error while unlocking the case"))

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: 0 } })
      const actualCourtCase = record as CourtCase

      expectToBeUnresolved(actualCourtCase)
    })

    it("Should return the error if fails to store audit logs", async () => {
      const expectedError = "Error while calling audit log API"
      ;(storeMessageAuditLogEvents as jest.Mock).mockImplementationOnce(() => new Error(expectedError))

      const result = await resolveCourtCase(dataSource, courtCases[0], resolution, user).catch(
        (error) => error as Error
      )

      expect(result).toEqual(Error(expectedError))

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: 0 } })
      const actualCourtCase = record as CourtCase

      expectToBeUnresolved(actualCourtCase)
    })

    it("Should return the error when fails to update the case", async () => {
      jest
        .spyOn(UpdateQueryBuilder.prototype, "execute")
        .mockRejectedValue(Error("Failed to update record with some error"))

      const result = await resolveCourtCase(dataSource, courtCases[0], resolution, user).catch(
        (error) => error as Error
      )

      expect(result).toEqual(Error("Failed to update record with some error"))

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: 0 } })
      const actualCourtCase = record as CourtCase

      expectToBeUnresolved(actualCourtCase)
    })
  })
})
