import type { AuditLogEvent } from "@moj-bichard7/common/types/AuditLogEvent"
import type { EntityManager, UpdateResult } from "typeorm"
import type { ManualResolution } from "types/ManualResolution"

import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import getAuditLogEvent from "@moj-bichard7/core/lib/getAuditLogEvent"
import { MoreThan, Not } from "typeorm"
import { ResolutionReasonCode } from "types/ManualResolution"
import { isError } from "types/Result"
import { validateManualResolution } from "utils/validators/validateManualResolution"

import type User from "./entities/User"

import { AUDIT_LOG_EVENT_SOURCE } from "../config"
import CourtCase from "./entities/CourtCase"
import Trigger from "./entities/Trigger"
import courtCasesByOrganisationUnitQuery from "./queries/courtCasesByOrganisationUnitQuery"

const resolveError = async (
  entityManager: EntityManager,
  courtCase: CourtCase,
  user: User,
  resolution: ManualResolution,
  events?: AuditLogEvent[]
): Promise<Error | UpdateResult> => {
  const resolutionError = validateManualResolution(resolution).error

  if (resolutionError) {
    throw new Error(resolutionError)
  }

  const resolver = user.username
  const resolutionTimestamp = new Date()
  const query = courtCasesByOrganisationUnitQuery(
    entityManager.getRepository(CourtCase).createQueryBuilder().update(CourtCase),
    user
  )

  const queryParams: Record<string, unknown> = {
    errorResolvedBy: resolver,
    errorResolvedTimestamp: resolutionTimestamp,
    errorStatus: "Resolved"
  }

  const triggersResolved =
    (
      await entityManager.getRepository(Trigger).find({
        where: {
          errorId: courtCase.errorId,
          status: Not("Resolved")
        }
      })
    ).length === 0

  if (triggersResolved) {
    queryParams.resolutionTimestamp = resolutionTimestamp
  }

  query.set(queryParams)
  query.andWhere({
    errorCount: MoreThan(0),
    errorId: courtCase.errorId,
    errorLockedByUsername: resolver,
    errorStatus: "Unresolved"
  })

  const queryResult = await query.execute()?.catch((error: Error) => error)

  if (isError(queryResult)) {
    return queryResult
  }

  if (queryResult.affected === 0) {
    return new Error("Failed to resolve case")
  }

  events?.push(
    getAuditLogEvent(EventCode.ExceptionsResolved, EventCategory.information, AUDIT_LOG_EVENT_SOURCE, {
      auditLogVersion: 2,
      resolutionReasonCode: ResolutionReasonCode[resolution.reason],
      resolutionReasonText: resolution.reasonText,
      user: user.username
    })
  )

  return queryResult
}

export default resolveError
