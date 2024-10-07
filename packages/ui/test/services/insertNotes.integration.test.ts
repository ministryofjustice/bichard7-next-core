import MockDate from "mockdate"
import { DataSource } from "typeorm"
import CourtCase from "../../src/services/entities/CourtCase"
import getDataSource from "../../src/services/getDataSource"
import deleteFromEntity from "../utils/deleteFromEntity"
import { getDummyCourtCase, insertCourtCases } from "../utils/insertCourtCases"
import Note from "../../src/services/entities/Note"
import insertNotes from "services/insertNotes"
import { isError } from "services/mq/types/Result"
const courtCaseId = 0

const insertRecords = async (
  errorLockedByUsername: string | null = null,
  triggerLockedByUsername: string | null = null
) => {
  const existingCourtCasesDbObject = [
    await getDummyCourtCase({
      courtDate: new Date("2008-09-25"),
      orgForPoliceFilter: "36FPA1".padEnd(6, " "),
      errorId: courtCaseId,
      messageId: String(0).padStart(5, "x"),
      errorLockedByUsername: errorLockedByUsername,
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
      userId: "System",
      noteText: "Test note"
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
      userId: "Dummy user",
      noteText: "Dummy note"
    }

    const result = await insertNotes(dataSource, [note])

    expect(isError(result)).toBe(true)

    const error = result as Error
    expect(error.message).toEqual(
      'insert or update on table "error_list_notes" violates foreign key constraint "error_list_notes_error_id_fkey"'
    )
  })
})
