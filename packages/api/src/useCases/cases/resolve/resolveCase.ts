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
  return await databaseConnection
    .transaction<Error | void>(async (tx) => {
      const resolveErrorResult = await resolveError(tx, user, caseId, resolution)
      if (isError(resolveErrorResult)) {
        return resolveErrorResult
      }

      // Unlock Case (TBD)
      // const unlockResult = await unlockCase(tx, caseId, user)
      // if (isError(unlockResult)) { return unlockResult }

      const noteText =
        `${user.username}: Portal Action: Record Manually Resolved.` +
        ` Reason: ${resolution.reason}. Reason Text: ${resolution.reasonText}`

      const insertNoteResult = await insertNote(tx, caseId, noteText, "System").catch((err: Error) => err)

      if (isError(insertNoteResult)) {
        return insertNoteResult
      }

      // audit logging (TBD)
    })
    .catch((err: Error) => err)
}
