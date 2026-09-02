import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger } from "fastify"

import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"

import type { WritableDatabaseConnection } from "../../types/DatabaseGateway"

import fetchCase from "../../services/db/cases/fetchCase"
import insertNotes from "../../services/db/cases/insertNotes"
import { NotFoundError } from "../../types/errors/NotFoundError"

const MaxNoteLength = 2000
const notesRegex = new RegExp(`(.|\\s){1,${MaxNoteLength}}`, "g")

const createNote = async (
  database: WritableDatabaseConnection,
  user: User,
  caseId: number,
  logger: FastifyBaseLogger,
  noteText: string
): PromiseResult<void> => {
  const caseResult = await fetchCase(database, user, caseId, logger)

  if (isError(caseResult)) {
    if (caseResult instanceof NotFoundError) {
      return new NotFoundError()
    }

    return new Error()
  }

  const wholeNote = noteText.match(notesRegex)

  const notes = wholeNote ? wholeNote.map((text) => text) : []

  const noteResult = await database
    .transaction<Error | void>(async (tx) => {
      const noteResult = await insertNotes(tx, notes, user.username, caseId)
      return noteResult
    })
    .catch((err) => err)

  if (isError(noteResult)) {
    return new Error()
  }
}

export default createNote
