import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger } from "fastify"

import { type Amendments } from "@moj-bichard7/common/types/Amendments"
import Permission from "@moj-bichard7/common/types/Permission"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"
import { isError } from "lodash"

import type { AuditLogDynamoGateway } from "../../../services/gateways/dynamo"
import type { ApiAuditLogEvent } from "../../../types/AuditLogEvent"
import type { WritableDatabaseConnection } from "../../../types/DatabaseGateway"

import fetchCase from "../../../services/db/cases/fetchCase"
import { NotAllowedError } from "../../../types/errors/NotAllowedError"

export const amendCourtCase = async (
  amendments: Partial<Amendments>,
  auditLogGateway: AuditLogDynamoGateway,
  caseId: number,
  database: WritableDatabaseConnection,
  logger: FastifyBaseLogger,
  user: User
): PromiseResult<void> => {
  const auditLogEvents: ApiAuditLogEvent[] = []

  if (!userAccess(user)[Permission.Exceptions]) {
    return new NotAllowedError()
  }

  return await database
    .transaction<Error | void>(async (tx) => {
      const courtCase = await fetchCase(tx, user, caseId, logger)
      if (isError(courtCase)) {
        throw courtCase
      }

      if (courtCase.errorLockedByUsername && courtCase.errorLockedByUsername !== user.username) {
        return new Error("Exception is locked by another user")
      }

      // CourtCase does not bring back updatedHearingOutcome or hearingOutcome
      // Do we need to pass through the caseId only or can we pass through the case like the original does?
      // const ahoResult = parseHearingOutcome(courtCase.updatedHearingOutcome ?? courtCase.hearingOutcome)
      // if (isError(ahoResult)) {
      //   return ahoResult
      // }

      // const ahoForceOwner = ahoResult.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner
      // if (ahoForceOwner === undefined || !ahoForceOwner.OrganisationUnitCode) {
      //   const organisationUnitCodes = createForceOwner(courtCase.orgForPoliceFilter || "")
      //   if (isError(organisationUnitCodes)) {
      //     return organisationUnitCodes
      //   }

      //   ahoResult.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner = organisationUnitCodes
      // }

      // const updatedAho = applyAmendmentsToAho(amendments, ahoResult)
      // if (isError(updatedAho)) {
      //   return updatedAho
      // }

      // const updateResult = await updateCourtCaseAho(dataSource, courtCase.errorId, updatedAho)
      // if (isError(updateResult)) {
      //   return updateResult
      // }

      // const updatedCourtCase = await getCourtCase(dataSource, courtCase.errorId)
      // if (isError(updatedCourtCase)) {
      //   return updatedCourtCase
      // }
      const updatedCourtCase = await fetchCase(tx, user, caseId, logger)
      if (isError(updatedCourtCase)) {
        return updatedCourtCase
      }

      // if (!updatedCourtCase) {
      //   return Error(`Couldn't find the court case id ${courtCase.errorId}`)
      // }

      // const addNoteResult = await insertNotes(database, getSystemNotes(amendments, userDetails, courtCase.errorId))
      // if (isError(addNoteResult)) {
      //   return addNoteResult
      // }

      // return updatedCourtCase
    })
    .catch((error: Error) => error)
}
