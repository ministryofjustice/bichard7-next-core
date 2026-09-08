import type { ResolveBody } from "@moj-bichard7/common/contracts/ResolveBody"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger } from "fastify"

import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"

import type { WritableDatabaseConnection } from "../../../types/DatabaseGateway"

import { resolveError } from "./resolveError"

export const resolveCase = async (
  databaseConnection: WritableDatabaseConnection,
  user: User,
  caseId: number,
  resolution: ResolveBody,
  logger: FastifyBaseLogger
): PromiseResult<void> => {
  const resolveErrorResult = await resolveError(databaseConnection, user, caseId, resolution, logger)

  if (isError(resolveErrorResult)) {
    return resolveErrorResult
  }

  return undefined
}
