import type { Case, CaseDto } from "@moj-bichard7/common/types/Case"
import type { Note } from "@moj-bichard7/common/types/Note"
import type { User } from "@moj-bichard7/common/types/User"

import { isError } from "@moj-bichard7/common/types/Result"

import auditCase from "../../services/db/cases/auditCase"
import fetchCase from "../../services/db/cases/fetchCase"
import fetchNotes from "../../services/db/cases/fetchNotes"
import insertNote from "../../services/db/cases/insertNote"
import { createCase } from "../../tests/helpers/caseHelper"
import FakeLogger from "../../tests/helpers/fakeLogger"
import { createUser } from "../../tests/helpers/userHelper"
import End2EndPostgres from "../../tests/testGateways/e2ePostgres"
import saveAuditResults from "./saveAuditResults"

jest.mock("../../services/db/cases/auditCase")
jest.mock("../../services/db/cases/insertNote")

const testDatabaseGateway = new End2EndPostgres()
const logger = new FakeLogger()

const mockedAuditCase = auditCase as jest.Mock
const mockedInsertNote = insertNote as jest.Mock

let caseObj: Case
let user: User

describe("saveAuditResults", () => {
  const userId = "testUser"
  const mockAuditQuality = { errorQuality: 1, triggerQuality: 2 }
  const testNote = "This is the test note"

  beforeEach(async () => {
    await testDatabaseGateway.clearDb()

    mockedAuditCase.mockImplementation(jest.requireActual("../../services/db/cases/auditCase").default)
    mockedInsertNote.mockImplementation(jest.requireActual("../../services/db/cases/insertNote").default)

    caseObj = await createCase(testDatabaseGateway, {
      courtCode: "ABC",
      errorId: 1,
      orgForPoliceFilter: "02"
    })
    user = await createUser(testDatabaseGateway)
  })

  afterAll(async () => {
    await testDatabaseGateway.close()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe("when saving audit quality", () => {
    it("saves auditResults successfully", async () => {
      jest.restoreAllMocks()

      const result = await saveAuditResults(
        testDatabaseGateway.writable,
        caseObj.errorId,
        mockAuditQuality,
        userId,
        testNote
      )
      expect(isError(result)).toBe(false)

      const updatedCase = (await fetchCase(testDatabaseGateway.readonly, user, caseObj.errorId, logger)) as CaseDto
      expect(updatedCase.errorQualityChecked).toBe(1)
      expect(updatedCase.triggerQualityChecked).toBe(2)
    })

    it("throws an error when no audit quality is provided", async () => {
      await expect(
        saveAuditResults(testDatabaseGateway.writable, caseObj.errorId, {}, userId, testNote)
      ).rejects.toThrow("Neither errorQuality nor triggerQuality is provided")
    })

    it("throws an error when case is not found", async () => {
      await expect(
        saveAuditResults(testDatabaseGateway.writable, 2, { errorQuality: 1, triggerQuality: 2 }, userId, testNote)
      ).rejects.toThrow("Case with id 2 not found")
    })

    it("throws an error when the database update fails", async () => {
      mockedAuditCase.mockResolvedValue(false)

      await expect(
        saveAuditResults(testDatabaseGateway.writable, caseObj.errorId, mockAuditQuality, userId, testNote)
      ).rejects.toThrow("Audit results could not be saved")
    })
  })

  describe("when saving note", () => {
    it("saves note successfully", async () => {
      const expectedNoteText = "Trigger quality: 2. Exception quality: 1. This is the test note"
      const result = await saveAuditResults(
        testDatabaseGateway.writable,
        caseObj.errorId,
        mockAuditQuality,
        userId,
        testNote
      )

      expect(isError(result)).toBe(false)

      const insertedNotes = (await fetchNotes(testDatabaseGateway.readonly, [caseObj.errorId])) as Note[]
      expect(insertedNotes[0].noteText).toBe(expectedNoteText)
    })

    it("throws an error when insertNote throws", async () => {
      mockedInsertNote.mockResolvedValue(new Error("DB insert failed"))

      await expect(
        saveAuditResults(testDatabaseGateway.writable, caseObj.errorId, mockAuditQuality, userId, testNote)
      ).rejects.toThrow("DB insert failed")
    })

    it("returns an error when database update fails", async () => {
      mockedInsertNote.mockResolvedValue(false)

      await expect(
        saveAuditResults(testDatabaseGateway.writable, caseObj.errorId, mockAuditQuality, userId, testNote)
      ).rejects.toThrow("Audit note could not be saved")
    })
  })
})
