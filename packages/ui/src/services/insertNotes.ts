import { DataSource, EntityManager, InsertResult } from "typeorm"
import PromiseResult from "types/PromiseResult"
import Note from "./entities/Note"
import { isError } from "types/Result"

const insertNotes = async (
  dataSource: DataSource | EntityManager,
  notes: Partial<Note>[]
): PromiseResult<InsertResult | Error> => {
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
