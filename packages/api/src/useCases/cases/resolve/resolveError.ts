import type { ResolveBody } from "@moj-bichard7/common/contracts/ResolveBody"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger } from "fastify"

import { validateManualResolution } from "@moj-bichard7/common/utils/validateManualResolution"

import type { WritableDatabaseConnection } from "../../../types/DatabaseGateway"

import fetchCase from "../../../services/db/cases/fetchCase"

export const resolveError = async (
  databaseConnection: WritableDatabaseConnection,
  user: User,
  caseId: number,
  resolution: ResolveBody,
  logger: FastifyBaseLogger
): PromiseResult<void> => {
  const resolutionError = validateManualResolution(resolution).error

  if (resolutionError) {
    return new Error(resolutionError)
  }

  if (resolution.resolutionStatus === "Resolved") {
    return
  }

  const caseResult = await fetchCase(databaseConnection, user, caseId, logger)
}
