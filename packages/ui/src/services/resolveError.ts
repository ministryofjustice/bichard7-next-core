import { AuditLogEvent } from "@moj-bichard7-developers/bichard7-next-core/common/types/AuditLogEvent"
import EventCategory from "@moj-bichard7-developers/bichard7-next-core/common/types/EventCategory"
import EventCode from "@moj-bichard7-developers/bichard7-next-core/common/types/EventCode"
import getAuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/core/lib/getAuditLogEvent"
import { EntityManager, MoreThan, Not, UpdateResult } from "typeorm"
import { ManualResolution, ResolutionReasonCode } from "types/ManualResolution"
import { isError } from "types/Result"
import { validateManualResolution } from "utils/validators/validateManualResolution"
import { AUDIT_LOG_EVENT_SOURCE } from "../config"
import CourtCase from "./entities/CourtCase"
import Trigger from "./entities/Trigger"
import User from "./entities/User"
import courtCasesByOrganisationUnitQuery from "./queries/courtCasesByOrganisationUnitQuery"

const resolveError = async (
  entityManager: EntityManager,
  courtCase: CourtCase,
  user: User,
  resolution: ManualResolution,
  events?: AuditLogEvent[]
): Promise<UpdateResult | Error> => {
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
    errorStatus: "Resolved",
    errorResolvedBy: resolver,
    errorResolvedTimestamp: resolutionTimestamp
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
    errorId: courtCase.errorId,
    errorLockedByUsername: resolver,
    errorCount: MoreThan(0),
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
      user: user.username,
      auditLogVersion: 2,
      resolutionReasonCode: ResolutionReasonCode[resolution.reason],
      resolutionReasonText: resolution.reasonText
    })
  )

  return queryResult
}

export default resolveError
