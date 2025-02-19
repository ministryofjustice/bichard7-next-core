import serialiseToAhoXml from "@moj-bichard7/core/lib/serialise/ahoXml/serialiseToXml"
import serialiseToPncUpdateDatasetXml from "@moj-bichard7/core/lib/serialise/pncUpdateDatasetXml/serialiseToXml"
import type { AnnotatedHearingOutcome } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import { isPncUpdateDataset } from "@moj-bichard7/core/types/PncUpdateDataset"
import insertNotes from "services/insertNotes"
import updateCourtCaseAho from "services/updateCourtCaseAho"
import type { DataSource, EntityManager } from "typeorm"
import type { Amendments } from "types/Amendments"
import { isError } from "types/Result"
import getSystemNotes from "utils/amendments/getSystemNotes"
import createForceOwner from "utils/createForceOwner"
import parseHearingOutcome from "utils/parseHearingOutcome"
import type CourtCase from "../entities/CourtCase"
import type User from "../entities/User"
import applyAmendmentsToAho from "./applyAmendmentsToAho"

const amendCourtCase = async (
  dataSource: DataSource | EntityManager,
  amendments: Partial<Amendments>,
  courtCase: CourtCase,
  userDetails: User
): Promise<AnnotatedHearingOutcome | Error> => {
  if (courtCase.errorLockedByUsername && courtCase.errorLockedByUsername !== userDetails.username) {
    return new Error("Exception is locked by another user")
  }

  // check if pnc annotated data set before trying to parse as aho
  // we need to parse the annotated message due to being xml in db
  const aho = parseHearingOutcome(courtCase.updatedHearingOutcome ?? courtCase.hearingOutcome)
  if (isError(aho)) {
    return aho
  }

  const ahoForceOwner = aho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner
  if (ahoForceOwner === undefined || !ahoForceOwner.OrganisationUnitCode) {
    const organisationUnitCodes = createForceOwner(courtCase.orgForPoliceFilter || "")
    if (isError(organisationUnitCodes)) {
      return organisationUnitCodes
    }

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner = organisationUnitCodes
  }

  const updatedAho = applyAmendmentsToAho(amendments, aho)
  if (isError(updatedAho)) {
    return updatedAho
  }

  // Depending on the phase, treat the update as either hoUpdate or pncUpdate
  const generatedXml = isPncUpdateDataset(updatedAho)
    ? serialiseToPncUpdateDatasetXml(updatedAho, false)
    : serialiseToAhoXml(updatedAho, false)

  const updateResult = await updateCourtCaseAho(
    dataSource,
    courtCase.errorId,
    generatedXml,
    !amendments.noUpdatesResubmit
  )
  if (isError(updateResult)) {
    return updateResult
  }

  const addNoteResult = await insertNotes(dataSource, getSystemNotes(amendments, userDetails, courtCase.errorId))
  if (isError(addNoteResult)) {
    return addNoteResult
  }

  return updatedAho
}

export default amendCourtCase
