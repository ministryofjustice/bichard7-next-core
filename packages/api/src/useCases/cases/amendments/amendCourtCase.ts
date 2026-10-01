import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger } from "fastify"

import { type Amendments } from "@moj-bichard7/common/types/Amendments"
import Permission from "@moj-bichard7/common/types/Permission"
import createForceOwner from "@moj-bichard7/common/utils/createForceOwner"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"
import { isError } from "lodash"

import type { WritableDatabaseConnection } from "../../../types/DatabaseGateway"

import fetchCase from "../../../services/db/cases/fetchCase"
import insertNotes from "../../../services/db/cases/insertNotes"
import { NotAllowedError } from "../../../types/errors/NotAllowedError"
import applyAmendmentsToAho from "./applyAmendmentsToAho"
import { updateCourtCaseAho } from "./updateCourtCaseAho"
import getSystemNotes from "./utils/getSystemNotes"

export const amendCourtCase = async (
  amendments: Partial<Amendments>,
  caseId: number,
  database: WritableDatabaseConnection,
  logger: FastifyBaseLogger,
  user: User
): PromiseResult<void> => {
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

      const ahoResult = courtCase.aho
      if (isError(ahoResult)) {
        return ahoResult
      }

      const ahoForceOwner = ahoResult.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner
      if (ahoForceOwner === undefined || !ahoForceOwner.OrganisationUnitCode) {
        const organisationUnitCodes = createForceOwner(courtCase.orgForPoliceFilter || "")
        if (isError(organisationUnitCodes)) {
          return organisationUnitCodes
        }

        ahoResult.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner = organisationUnitCodes
      }

      const updatedAho = applyAmendmentsToAho(amendments, ahoResult)
      if (isError(updatedAho)) {
        return updatedAho
      }

      const updateResult = await updateCourtCaseAho(tx, caseId, updatedAho)
      if (isError(updateResult)) {
        return updateResult
      }

      const updatedCourtCase = await fetchCase(tx, user, caseId, logger)
      if (isError(updatedCourtCase)) {
        return updatedCourtCase
      }

      if (!updatedCourtCase) {
        return Error(`Couldn't find the court case id ${caseId}`)
      }

      const systemNotes = getSystemNotes(amendments, user.username)
      const addNoteResult = await insertNotes(tx, systemNotes, "System", caseId)
      if (isError(addNoteResult)) {
        return addNoteResult
      }

      // The original endpoint returns the case, do we need to do that?
      // return updatedCourtCase
    })
    .catch((error: Error) => error)
}
