import type { ResolveBody } from "@moj-bichard7/common/contracts/ResolveBody"
import type { User } from "@moj-bichard7/common/types/User"

import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"

import type { WritableDatabaseConnection } from "../../../types/DatabaseGateway"

import insertNote from "../../../services/db/cases/insertNote"
import { resolveError } from "./resolveError"

export const resolveCase = async (
  databaseConnection: WritableDatabaseConnection,
  user: User,
  caseId: number,
  resolution: ResolveBody
  /*   logger: FastifyBaseLogger */
): PromiseResult<void> => {
  const resolveErrorResult = await resolveError(databaseConnection, user, caseId, resolution) /* , logger */

  if (isError(resolveErrorResult)) {
    return resolveErrorResult
  }

  // unlock case

  const noteText =
    `${user.username}: Portal Action: Record Manually Resolved.` +
    ` Reason: ${resolution.reason}. Reason Text: ${resolution.reasonText}`

  const insertNoteResult = await databaseConnection
    .transaction<boolean | Error>(async (tx) => {
      return await insertNote(tx, caseId, noteText, "System")
    })
    .catch((err) => err)

  if (isError(insertNoteResult)) {
    throw insertNoteResult
  }

  // audit log store here, need to add events throughout process still though

  return undefined
}
