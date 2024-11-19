import type { DataSource, EntityManager, InsertResult } from "typeorm"
import type PromiseResult from "types/PromiseResult"

import { isError } from "types/Result"

import Note from "./entities/Note"

const insertNotes = async (
  dataSource: DataSource | EntityManager,
  notes: Partial<Note>[]
): PromiseResult<Error | InsertResult> => {
  const noteRepository = dataSource.getRepository(Note)
  const insertResult = await noteRepository
    .createQueryBuilder()
    .insert()
    .into(Note)
    .values(
      notes.map((note) => {
        return { ...note, createdAt: new Date() }
      })
    )
    .execute()
    .catch((error: Error) => error)

  if (isError(insertResult)) {
    return insertResult
  }

  return insertResult
}

export default insertNotes
