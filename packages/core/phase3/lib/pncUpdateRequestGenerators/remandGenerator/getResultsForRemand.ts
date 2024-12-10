import areOrganisationUnitsEqual from "../../../../lib/areOrganisationUnitsEqual"
import isRecordableOffence from "../../../../phase2/lib/isRecordableOffence"
import isRecordableResult from "../../../../phase2/lib/isRecordableResult"
import { Offence, Result } from "../../../../types/AnnotatedHearingOutcome"
import { PncOperation } from "../../../../types/PncOperation"
import { Operation } from "../../../../types/PncUpdateDataset"
import ResultClass from "../../../../types/ResultClass"

const noAdjudicationResultClasses = [
  ResultClass.ADJOURNMENT,
  ResultClass.ADJOURNMENT_PRE_JUDGEMENT,
  ResultClass.ADJOURNMENT_WITH_JUDGEMENT
]

const adjudicationResultClasses = [ResultClass.ADJOURNMENT_POST_JUDGEMENT, ResultClass.ADJOURNMENT_WITH_JUDGEMENT]

const getResultsForRemand = (offences: Offence[], operation: Operation<PncOperation.REMAND>): Result[] => {
  const matchingResults: Result[] = []

  for (const offence of offences.filter(isRecordableOffence)) {
    for (const result of offence.Result.filter(isRecordableResult)) {
      const nextHearingDateMatches =
        (!result.NextHearingDate && !operation.data?.nextHearingDate) ||
        (result.NextHearingDate &&
          new Date(result.NextHearingDate).getTime() === operation.data?.nextHearingDate?.getTime())
      const organisationUnitMatches = areOrganisationUnitsEqual(
        operation.data?.nextHearingLocation,
        result.NextResultSourceOrganisation ?? undefined
      )

      if (!nextHearingDateMatches || !organisationUnitMatches) {
        continue
      }

      const adjudicationExists = result.PNCAdjudicationExists
      const requiresRemand =
        result.ResultClass &&
        (adjudicationExists ? adjudicationResultClasses : noAdjudicationResultClasses).includes(result.ResultClass)

      if (requiresRemand) {
        matchingResults.push(result)
      }
    }
  }

  return matchingResults
}

export default getResultsForRemand
