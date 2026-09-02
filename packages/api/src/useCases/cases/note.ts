import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger } from "fastify"

import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"

import type { AuditLogDynamoGateway } from "../../services/gateways/dynamo"
import type { WritableDatabaseConnection } from "../../types/DatabaseGateway"

import fetchCase from "../../services/db/cases/fetchCase"
import { NotFoundError } from "../../types/errors/NotFoundError"

const MaxNoteLength = 2000
const notesRegex = new RegExp(`(.|\\s){1,${MaxNoteLength}}`, "g")

const note = async (
  database: WritableDatabaseConnection,
  auditLogGateway: AuditLogDynamoGateway,
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

  // const wholeNote = noteText.match(notesRegex)

  // const notes =
  //   wholeNote?.map((text) => ({
  //     noteText: text,
  //     errorId: caseId,
  //     userId: user.username
  //   })) ?? []
}

export default note
