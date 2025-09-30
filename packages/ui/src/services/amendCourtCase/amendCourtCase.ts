import serialiseToAhoXml from "@moj-bichard7/core/lib/serialise/ahoXml/serialiseToXml"
import serialiseToPncUpdateDatasetXml from "@moj-bichard7/core/lib/serialise/pncUpdateDatasetXml/serialiseToXml"
import { isPncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"
import getCourtCase from "services/getCourtCase"
import insertNotes from "services/insertNotes"
import updateCourtCaseAho from "services/updateCourtCaseAho"
import type { DataSource, EntityManager } from "typeorm"
import type { Amendments } from "types/Amendments"
import type PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
import getSystemNotes from "utils/amendments/getSystemNotes"
import createForceOwner from "utils/createForceOwner"
import { parseHearingOutcome } from "@moj-bichard7/common/aho/parseHearingOutcome"
import type CourtCase from "../entities/CourtCase"
import type User from "../entities/User"
import applyAmendmentsToAho from "./applyAmendmentsToAho"

const amendCourtCase = async (
  dataSource: DataSource | EntityManager,
  amendments: Partial<Amendments>,
  courtCase: CourtCase,
  userDetails: User
): PromiseResult<CourtCase> => {
  if (courtCase.errorLockedByUsername && courtCase.errorLockedByUsername !== userDetails.username) {
    return new Error("Exception is locked by another user")
  }

  const ahoResult = parseHearingOutcome(courtCase.updatedHearingOutcome ?? courtCase.hearingOutcome)
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

  // Depending on the phase, treat the update as either hoUpdate or pncUpdate
  const updatedAhoXml = isPncUpdateDataset(updatedAho)
    ? serialiseToPncUpdateDatasetXml(updatedAho, false)
    : serialiseToAhoXml(updatedAho, false)

  const updateResult = await updateCourtCaseAho(dataSource, courtCase.errorId, updatedAhoXml)
  if (isError(updateResult)) {
    return updateResult
  }

  const updatedCourtCase = await getCourtCase(dataSource, courtCase.errorId)
  if (isError(updatedCourtCase)) {
    return updatedCourtCase
  }

  if (!updatedCourtCase) {
    return Error(`Couldn't find the court case id ${courtCase.errorId}`)
  }

  const addNoteResult = await insertNotes(dataSource, getSystemNotes(amendments, userDetails, courtCase.errorId))
  if (isError(addNoteResult)) {
    return addNoteResult
  }

  return updatedCourtCase
}

export default amendCourtCase
