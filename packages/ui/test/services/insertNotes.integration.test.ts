import type { DataSource } from "typeorm"

import MockDate from "mockdate"
import insertNotes from "services/insertNotes"
import { isError } from "services/mq/types/Result"

import CourtCase from "../../src/services/entities/CourtCase"
import Note from "../../src/services/entities/Note"
import getDataSource from "../../src/services/getDataSource"
import deleteFromEntity from "../utils/deleteFromEntity"
import { getDummyCourtCase, insertCourtCases } from "../utils/insertCourtCases"
const courtCaseId = 0

const insertRecords = async (
  errorLockedByUsername: null | string = null,
  triggerLockedByUsername: null | string = null
) => {
  const existingCourtCasesDbObject = [
    await getDummyCourtCase({
      courtDate: new Date("2008-09-25"),
      errorId: courtCaseId,
      errorLockedByUsername: errorLockedByUsername,
      messageId: String(0).padStart(5, "x"),
      orgForPoliceFilter: "36FPA1".padEnd(6, " "),
      triggerLockedByUsername: triggerLockedByUsername
    })
  ]

  await insertCourtCases(existingCourtCasesDbObject)
}

describe("insertNote", () => {
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

  it("Should insert a valid note", async () => {
    const note = {
      errorId: courtCaseId,
      noteText: "Test note",
      userId: "System"
    }
    await insertRecords()
    const date = new Date()
    MockDate.set(date)

    const result = await insertNotes(dataSource, [note])

    expect(isError(result)).toBe(false)

    const record = await dataSource.getRepository(Note).findOne({ where: { errorId: 0 } })
    const actualCourtCase = record as Note
    expect(actualCourtCase.noteText).toBe(note.noteText)
    expect(actualCourtCase.userId).toBe("System")
    expect(actualCourtCase.createdAt).toEqual(date)
  })

  it("Should return the error when the query fails", async () => {
    const invalidId = 9999
    const note = {
      errorId: invalidId,
      noteText: "Dummy note",
      userId: "Dummy user"
    }

    const result = await insertNotes(dataSource, [note])

    expect(isError(result)).toBe(true)

    const error = result as Error
    expect(error.message).toBe(
      'insert or update on table "error_list_notes" violates foreign key constraint "error_list_notes_error_id_fkey"'
    )
  })
})
