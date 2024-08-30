import MockDate from "mockdate"
import insertNotes from "services/insertNotes"
import { DataSource } from "typeorm"
import { v4 as uuid } from "uuid"
import addNote from "../../src/services/addNote"
import CourtCase from "../../src/services/entities/CourtCase"
import getDataSource from "../../src/services/getDataSource"
import deleteFromEntity from "../utils/deleteFromEntity"
import { insertCourtCasesWithFields } from "../utils/insertCourtCases"

jest.mock("services/insertNotes")

const note = "Dummy note"
const existingCourtCasesDbObject = {
  courtDate: new Date("2008-09-25"),
  orgForPoliceFilter: "36FPA1".padEnd(6, " "),
  errorId: 0
}
const currentUsername = "GeneralHandler"

describe("addNote", () => {
  let dataSource: DataSource

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromEntity(CourtCase)
    jest.resetAllMocks()
    jest.clearAllMocks()
  })

  afterEach(() => {
    MockDate.reset()
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  it("Should add note when record is fully locked by the user", async () => {
    await insertCourtCasesWithFields([
      {
        messageId: uuid(),
        errorLockedByUsername: currentUsername,
        triggerLockedByUsername: currentUsername,
        ...existingCourtCasesDbObject
      }
    ])
    const date = new Date()
    MockDate.set(date)
    const result = await addNote(dataSource, 0, currentUsername, note)

    expect(insertNotes).toHaveBeenCalledTimes(1)
    expect(insertNotes).toHaveBeenCalledWith(expect.anything(), [
      { errorId: 0, noteText: note, userId: currentUsername }
    ])

    expect(result).toStrictEqual({ isSuccessful: true })
  })

  it("Should add note when record is partially locked by the user", async () => {
    await insertCourtCasesWithFields([
      {
        messageId: uuid(),
        errorLockedByUsername: "BichardForce01",
        triggerLockedByUsername: currentUsername,
        ...existingCourtCasesDbObject
      }
    ])
    const date = new Date()
    MockDate.set(date)
    const result = await addNote(dataSource, 0, currentUsername, note)

    expect(insertNotes).toHaveBeenCalledTimes(1)
    expect(insertNotes).toHaveBeenCalledWith(expect.anything(), [
      { errorId: 0, noteText: note, userId: currentUsername }
    ])

    expect(result).toStrictEqual({ isSuccessful: true })
  })

  it("Should not add note when error is not locked by the user", async () => {
    await insertCourtCasesWithFields([
      {
        ...existingCourtCasesDbObject,
        messageId: uuid(),
        errorLockedByUsername: "BichardForce01",
        triggerLockedByUsername: "BichardForce02"
      }
    ])

    const date = new Date()
    MockDate.set(date)
    const result = await addNote(dataSource, 0, currentUsername, note)

    expect(result).toStrictEqual({
      isSuccessful: false,
      ValidationException: "Case is not locked by the user"
    })

    expect(insertNotes).toHaveBeenCalledTimes(0)
  })

  it("Should not add note when case does not exist", async () => {
    const result = await addNote(dataSource, 0, currentUsername, note)

    expect(result).toStrictEqual({
      isSuccessful: false,
      ValidationException: "Case not found"
    })

    expect(insertNotes).toHaveBeenCalledTimes(0)
  })

  it("Should add multiple notes when note text length is more than the 2000 characters", async () => {
    await insertCourtCasesWithFields([
      { messageId: uuid(), ...existingCourtCasesDbObject, errorLockedByUsername: currentUsername }
    ])

    const result = await addNote(dataSource, 0, currentUsername, "A".repeat(4503))
    expect(result).toStrictEqual({ isSuccessful: true })

    expect(insertNotes).toHaveBeenCalledTimes(1)
    expect(insertNotes).toHaveBeenCalledWith(expect.anything(), [
      { errorId: 0, noteText: "A".repeat(2000), userId: currentUsername },
      { errorId: 0, noteText: "A".repeat(2000), userId: currentUsername },
      { errorId: 0, noteText: "A".repeat(503), userId: currentUsername }
    ])
  })

  it("Should not add multiple notes when note has a new line", async () => {
    await insertCourtCasesWithFields([
      { messageId: uuid(), ...existingCourtCasesDbObject, errorLockedByUsername: currentUsername }
    ])

    const result = await addNote(dataSource, 0, currentUsername, "A\r\nB")
    expect(result).toStrictEqual({ isSuccessful: true })

    expect(insertNotes).toHaveBeenCalledTimes(1)
    expect(insertNotes).toHaveBeenCalledWith(expect.anything(), [
      { errorId: 0, noteText: "A\r\nB", userId: currentUsername }
    ])
  })

  it("Should add multiple notes when text is over 2000 characters and contains new lines (doesn't split on new lines)", async () => {
    await insertCourtCasesWithFields([
      { messageId: uuid(), ...existingCourtCasesDbObject, errorLockedByUsername: currentUsername }
    ])

    const text = "Abba\r\n".repeat(500)
    const result = await addNote(dataSource, 0, currentUsername, text)
    expect(result).toStrictEqual({ isSuccessful: true })

    expect(insertNotes).toHaveBeenCalledTimes(1)
    expect(insertNotes).toHaveBeenCalledWith(expect.anything(), [
      { errorId: 0, noteText: text.slice(0, 2000), userId: currentUsername },
      { errorId: 0, noteText: text.slice(2000, 3000), userId: currentUsername }
    ])
  })
})
