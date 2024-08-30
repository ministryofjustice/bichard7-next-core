import MockDate from "mockdate"
import User from "services/entities/User"
import { isError } from "services/mq/types/Result"
import updateCourtCaseStatus from "services/updateCourtCaseStatus"
import { DataSource, UpdateResult } from "typeorm"
import { ResolutionStatus } from "types/ResolutionStatus"
import CourtCase from "../../src/services/entities/CourtCase"
import getDataSource from "../../src/services/getDataSource"
import deleteFromEntity from "../utils/deleteFromEntity"
import { getDummyCourtCase, insertCourtCases } from "../utils/insertCourtCases"

const courtCaseId = 0
const testUser = { username: "GeneralHandler" } as User

const insertRecord = async (
  errorLockedByUsername: string | null = null,
  triggerLockedByUsername: string | null = null,
  errorStatus: ResolutionStatus | null = null,
  triggerStatus: ResolutionStatus | null = null
) => {
  const existingCourtCasesDbObjects = [
    await getDummyCourtCase({
      courtDate: new Date("2008-09-25"),
      orgForPoliceFilter: "36FPA1".padEnd(6, " "),
      errorId: courtCaseId,
      messageId: String(0).padStart(5, "x"),
      errorLockedByUsername: errorLockedByUsername,
      triggerLockedByUsername: triggerLockedByUsername,
      errorStatus: errorStatus,
      triggerStatus: triggerStatus
    }),
    await getDummyCourtCase({
      courtDate: new Date("2008-09-25"),
      orgForPoliceFilter: "36FPA1".padEnd(6, " "),
      errorId: 1,
      messageId: String(1).padStart(5, "x"),
      errorLockedByUsername: errorLockedByUsername,
      triggerLockedByUsername: triggerLockedByUsername,
      errorStatus: errorStatus,
      triggerStatus: triggerStatus
    })
  ]

  return insertCourtCases(existingCourtCasesDbObjects)
}

describe("updateCourtCaseStatus", () => {
  let dataSource: DataSource

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromEntity(CourtCase)
  })

  afterEach(() => {
    MockDate.reset()
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  describe("Updating error status", () => {
    it("Should not update the case if its locked by another user", async () => {
      const errorLockedByUsername = "BichardForce02"
      const [courtCase] = await insertRecord(errorLockedByUsername)

      const result = await updateCourtCaseStatus(dataSource, courtCase, "Error", "Submitted", testUser)

      expect((result as UpdateResult).raw).toHaveLength(0)
      expect((result as UpdateResult).affected).toBe(0)
    })

    it("Should not update the case if the current error status is not set", async () => {
      const errorLockedByUsername = testUser.username
      const triggerLockedByUsername = testUser.username
      const [courtCase] = await insertRecord(errorLockedByUsername, triggerLockedByUsername, null, null)

      const result = await updateCourtCaseStatus(dataSource, courtCase, "Error", "Submitted", testUser)

      expect((result as UpdateResult).raw).toHaveLength(0)
      expect((result as UpdateResult).affected).toBe(0)
    })

    it("can updates the case when its not locked and error status is not null", async () => {
      const errorStatus = "Unresolved"
      const [courtCase] = await insertRecord(null, null, errorStatus, null)

      const result = await updateCourtCaseStatus(dataSource, courtCase, "Error", "Submitted", testUser)
      expect(isError(result)).toBe(false)

      const updateResult = result as UpdateResult
      expect(updateResult.raw).toHaveLength(1)

      const courtCaseRow = updateResult.raw[0]
      expect(courtCaseRow.error_status).toEqual(3)
      expect(courtCaseRow.error_resolved_by).toEqual(testUser.username)
      expect(courtCaseRow.error_resolved_ts).toBeNull()

      expect(courtCaseRow.trigger_resolved_ts).toBeNull()
      expect(courtCaseRow.trigger_status).toBeNull()
      expect(courtCaseRow.resolution_ts).toBeNull()
    })

    it("Should update the case when its locked by the user and error status is not null", async () => {
      const errorLockedByUsername = testUser.username
      const errorStatus = "Unresolved"
      const [courtCase] = await insertRecord(errorLockedByUsername, null, errorStatus, null)

      const result = await updateCourtCaseStatus(dataSource, courtCase, "Error", "Submitted", testUser)
      expect(isError(result)).toBe(false)

      const updateResult = result as UpdateResult
      expect(updateResult.raw).toHaveLength(1)

      const courtCaseRow = updateResult.raw[0]
      expect(courtCaseRow.error_status).toEqual(3)
      expect(courtCaseRow.error_resolved_by).toEqual(testUser.username)
      expect(courtCaseRow.error_resolved_ts).toBeNull()
      expect(courtCaseRow.trigger_status).toBeNull()
    })

    it("updates error resolved timestamp when the resolution status is 'Resolved'", async () => {
      const date = new Date()
      MockDate.set(date)
      const errorLockedByUsername = testUser.username
      const errorStatus = "Unresolved"
      const triggerStatus = "Unresolved"
      const [courtCase] = await insertRecord(errorLockedByUsername, null, errorStatus, triggerStatus)

      const result = await updateCourtCaseStatus(dataSource, courtCase, "Error", "Resolved", testUser)
      expect(isError(result)).toBe(false)

      const updateResult = result as UpdateResult
      expect(updateResult.raw).toHaveLength(1)

      const courtCaseRow = updateResult.raw[0]
      expect(courtCaseRow.error_status).toEqual(2)
      expect(courtCaseRow.error_resolved_by).toEqual(testUser.username)
      expect(courtCaseRow.error_resolved_ts).toEqual(date)
      expect(courtCaseRow.resolution_ts).toBeNull()
    })

    it("updates resolution timestamp when the triggerStatus is NULL and resolution status is 'Resolved'", async () => {
      const date = new Date()
      MockDate.set(date)
      const errorLockedByUsername = testUser.username
      const errorStatus = "Unresolved"
      const triggerStatus = null
      const [courtCase] = await insertRecord(errorLockedByUsername, null, errorStatus, triggerStatus)

      const result = await updateCourtCaseStatus(dataSource, courtCase, "Error", "Resolved", testUser)
      expect(isError(result)).toBe(false)

      const updateResult = result as UpdateResult
      expect(updateResult.raw).toHaveLength(1)

      const courtCaseRow = updateResult.raw[0]
      expect(courtCaseRow.error_status).toEqual(2)
      expect(courtCaseRow.error_resolved_by).toEqual(testUser.username)
      expect(courtCaseRow.error_resolved_ts).toEqual(date)
      expect(courtCaseRow.resolution_ts).toEqual(date)
    })

    it("updates resolution timestamp when the triggerStatus is 'Resolved' and resolution status is 'Resolved'", async () => {
      const date = new Date()
      MockDate.set(date)
      const errorLockedByUsername = testUser.username
      const errorStatus = "Unresolved"
      const triggerStatus = "Resolved"
      const [courtCase] = await insertRecord(errorLockedByUsername, null, errorStatus, triggerStatus)

      const result = await updateCourtCaseStatus(dataSource, courtCase, "Error", "Resolved", testUser)
      expect(isError(result)).toBe(false)

      const updateResult = result as UpdateResult
      expect(updateResult.raw).toHaveLength(1)

      const courtCaseRow = updateResult.raw[0]
      expect(courtCaseRow.error_status).toEqual(2)
      expect(courtCaseRow.error_resolved_by).toEqual(testUser.username)
      expect(courtCaseRow.error_resolved_ts).toEqual(date)
      expect(courtCaseRow.resolution_ts).toEqual(date)
    })
  })

  describe("Updating trigger status", () => {
    it("Should not update the case if the current trigger status is not set", async () => {
      const errorLockedByUsername = testUser.username
      const triggerLockedByUsername = testUser.username
      const [courtCase] = await insertRecord(errorLockedByUsername, triggerLockedByUsername, null, null)

      const result = await updateCourtCaseStatus(dataSource, courtCase, "Trigger", "Submitted", testUser)

      expect((result as UpdateResult).raw).toHaveLength(0)
      expect((result as UpdateResult).affected).toBe(0)
    })

    it("Should update trigger status when its not locked and trigger status is not null", async () => {
      const triggerStatus = "Unresolved"
      const [courtCase] = await insertRecord(null, null, null, triggerStatus)

      const result = await updateCourtCaseStatus(dataSource, courtCase, "Trigger", "Submitted", testUser)
      expect(isError(result)).toBe(false)

      const updateResult = result as UpdateResult
      expect(updateResult.raw).toHaveLength(1)

      const courtCaseRow = updateResult.raw[0]
      expect(courtCaseRow.trigger_status).toEqual(3)
      expect(courtCaseRow.trigger_resolved_ts).toBeNull()
      expect(courtCaseRow.error_resolved_ts).toBeNull()
      expect(courtCaseRow.error_status).toBeNull()
      expect(courtCaseRow.resolution_ts).toBeNull()
    })

    it("Should update the case when its locked by the user and trigger status is not null", async () => {
      const triggerLockedByUsername = testUser.username
      const triggerStatus = "Unresolved"

      const [courtCase] = await insertRecord(null, triggerLockedByUsername, null, triggerStatus)

      const result = await updateCourtCaseStatus(dataSource, courtCase, "Trigger", "Submitted", testUser)
      expect(isError(result)).toBe(false)

      const updateResult = result as UpdateResult
      expect(updateResult.raw).toHaveLength(1)

      const courtCaseRow = updateResult.raw[0]
      expect(courtCaseRow.trigger_status).toEqual(3)
      expect(courtCaseRow.trigger_resolved_ts).toBeNull()
      expect(courtCaseRow.error_resolved_ts).toBeNull()
      expect(courtCaseRow.error_status).toBeNull()
      expect(courtCaseRow.resolution_ts).toBeNull()
    })

    it("updates trigger resolved timestamp when the resolution status is 'Resolved'", async () => {
      const date = new Date()
      MockDate.set(date)
      const errorLockedByUsername = testUser.username
      const errorStatus = "Unresolved"
      const triggerStatus = "Unresolved"
      const [courtCase] = await insertRecord(errorLockedByUsername, null, errorStatus, triggerStatus)

      const result = await updateCourtCaseStatus(dataSource, courtCase, "Trigger", "Resolved", testUser)
      expect(isError(result)).toBe(false)

      const updateResult = result as UpdateResult
      expect(updateResult.raw).toHaveLength(1)

      const courtCaseRow = updateResult.raw[0]
      expect(courtCaseRow.trigger_resolved_by).toEqual(testUser.username)
      expect(courtCaseRow.trigger_resolved_ts).toEqual(date)
      expect(courtCaseRow.resolution_ts).toBeNull()
      expect(courtCaseRow.error_status).toEqual(1)
      expect(courtCaseRow.error_resolved_ts).toBeNull()
    })

    it("updates resolution timestamp when the errorStatus is NULL and resolution status is 'Resolved'", async () => {
      const date = new Date()
      MockDate.set(date)
      const errorLockedByUsername = testUser.username
      const errorStatus = null
      const triggerStatus = "Unresolved"
      const [courtCase] = await insertRecord(errorLockedByUsername, null, errorStatus, triggerStatus)

      const result = await updateCourtCaseStatus(dataSource, courtCase, "Trigger", "Resolved", testUser)
      expect(isError(result)).toBe(false)

      const updateResult = result as UpdateResult
      expect(updateResult.raw).toHaveLength(1)

      const courtCaseRow = updateResult.raw[0]
      expect(courtCaseRow.trigger_status).toEqual(2)
      expect(courtCaseRow.trigger_resolved_by).toEqual(testUser.username)
      expect(courtCaseRow.trigger_resolved_ts).toEqual(date)
      expect(courtCaseRow.resolution_ts).toEqual(date)
      expect(courtCaseRow.error_resolved_ts).toBeNull()
      expect(courtCaseRow.error_status).toBeNull()
    })

    it("updates resolution timestamp when the errorStatus is 'Resolved' and resolution status is 'Resolved'", async () => {
      const date = new Date()
      MockDate.set(date)
      const errorLockedByUsername = testUser.username
      const errorStatus = "Resolved"
      const triggerStatus = "Unresolved"
      const [courtCase] = await insertRecord(errorLockedByUsername, null, errorStatus, triggerStatus)

      const result = await updateCourtCaseStatus(dataSource, courtCase, "Trigger", "Resolved", testUser)
      expect(isError(result)).toBe(false)

      const updateResult = result as UpdateResult
      expect(updateResult.raw).toHaveLength(1)

      const courtCaseRow = updateResult.raw[0]
      expect(courtCaseRow.trigger_status).toEqual(2)
      expect(courtCaseRow.trigger_resolved_by).toEqual(testUser.username)
      expect(courtCaseRow.trigger_resolved_ts).toEqual(date)
      expect(courtCaseRow.resolution_ts).toEqual(date)
    })
  })
})
