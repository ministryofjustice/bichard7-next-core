import type { User } from "@moj-bichard7/common/types/User"

import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"

import type { WritableDatabaseConnection } from "../../types/DatabaseGateway"

import checkCasePermission from "../../services/db/cases/checkCasePermission"
import insertNotes from "../../services/db/cases/insertNotes"

const MaxNoteLength = 2000

const createNote = async (
  database: WritableDatabaseConnection,
  user: User,
  caseId: number,
  noteText: string
): PromiseResult<void> => {
  const caseResult = await checkCasePermission(database, user, caseId)

  if (isError(caseResult)) {
    return caseResult
  }

  const notes: string[] = []
  for (let i = 0; i < noteText.length; i += MaxNoteLength) {
    notes.push(noteText.slice(i, i + MaxNoteLength))
  }

  const noteResult = await database
    .transaction<Error | void>(async (tx) => {
      return await insertNotes(tx, notes, user.username, caseId)
    })
    .catch((err) => err)

  if (isError(noteResult)) {
    return noteResult
  }
}

export default createNote
