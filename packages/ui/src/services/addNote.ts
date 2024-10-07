import { DataSource, EntityManager } from "typeorm"
import { isError } from "types/Result"
import { ServiceResultPromise } from "types/ServiceResult"
import CourtCase from "./entities/CourtCase"
import insertNotes from "./insertNotes"

const MaxNoteLength = 2000
const notesRegex = new RegExp(`(.|\\s){1,${MaxNoteLength}}`, "g")

const addNote = async (
  dataSource: DataSource | EntityManager,
  courtCaseId: number,
  username: string,
  noteText: string
): ServiceResultPromise => {
  if (!noteText) {
    return { isSuccessful: false, ValidationException: "Note text cannot be empty" }
  }

  const courtCaseRepository = dataSource.getRepository(CourtCase)
  const courtCase = await courtCaseRepository.findOneBy({ errorId: courtCaseId })
  if (!courtCase) {
    return {
      isSuccessful: false,
      ValidationException: "Case not found"
    }
  }

  if (!courtCase.isLockedByCurrentUser(username)) {
    return {
      isSuccessful: false,
      ValidationException: "Case is not locked by the user"
    }
  }

  const wholeNote = noteText.match(notesRegex)

  const notes =
    wholeNote?.map((text) => ({
      noteText: text,
      errorId: courtCaseId,
      userId: username
    })) ?? []

  const addNoteResult = await insertNotes(dataSource, notes)

  if (isError(addNoteResult)) {
    console.error(addNoteResult)
    return { isSuccessful: false, Exception: addNoteResult }
  }

  return { isSuccessful: true }
}

export default addNote
