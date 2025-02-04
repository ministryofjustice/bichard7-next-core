import type { Offence, Result } from "../../../../types/AnnotatedHearingOutcome"
import type { PncOperation } from "../../../../types/PncOperation"
import type { Operation } from "../../../../types/PncUpdateDataset"

import areOrganisationUnitsEqual from "../../../../lib/areOrganisationUnitsEqual"
import isRecordableResult from "../../../../lib/isRecordableResult"
import isRecordableOffence from "../../../../lib/offences/isRecordableOffence"
import ResultClass from "../../../../types/ResultClass"

const noAdjudicationResultClasses = [
  ResultClass.ADJOURNMENT,
  ResultClass.ADJOURNMENT_PRE_JUDGEMENT,
  ResultClass.ADJOURNMENT_WITH_JUDGEMENT
]

const adjudicationResultClasses = [ResultClass.ADJOURNMENT_POST_JUDGEMENT, ResultClass.ADJOURNMENT_WITH_JUDGEMENT]

const isRemandOperationMatchingResult = (result: Result, operation: Operation<PncOperation.REMAND>) => {
  const nextHearingDateMatches =
    (!result.NextHearingDate && !operation.data?.nextHearingDate) ||
    (result.NextHearingDate &&
      new Date(result.NextHearingDate).getTime() === operation.data?.nextHearingDate?.getTime())
  const organisationUnitMatches = areOrganisationUnitsEqual(
    operation.data?.nextHearingLocation,
    result.NextResultSourceOrganisation ?? undefined
  )

  return nextHearingDateMatches && organisationUnitMatches
}

const isRemandRequired = (result: Result) =>
  result.ResultClass &&
  (result.PNCAdjudicationExists ? adjudicationResultClasses : noAdjudicationResultClasses).includes(result.ResultClass)

const getResultsForRemand = (offences: Offence[], operation: Operation<PncOperation.REMAND>): Result[] =>
  offences
    .filter(isRecordableOffence)
    .flatMap((offence) =>
      offence.Result.filter(
        (result) =>
          isRecordableResult(result) && isRemandOperationMatchingResult(result, operation) && isRemandRequired(result)
      )
    )

export default getResultsForRemand
