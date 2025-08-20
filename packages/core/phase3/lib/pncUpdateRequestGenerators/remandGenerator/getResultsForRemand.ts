import type { Offence, Result } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type { PncOperation } from "@moj-bichard7/common/types/PncOperation"
import type { Operation } from "@moj-bichard7/common/types/PncUpdateDataset"

import ResultClass from "@moj-bichard7/common/types/ResultClass"

import areOrganisationUnitsEqual from "../../../../lib/areOrganisationUnitsEqual"
import isRecordableOffence from "../../../../lib/offences/isRecordableOffence"
import isRecordableResult from "../../../../lib/results/isRecordableResult"

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
