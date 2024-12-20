import type { AnnotatedHearingOutcome, Offence } from "../../../types/AnnotatedHearingOutcome"
import type { PncDisposal } from "../../../types/PncQueryResult"
import type { Disposal } from "../../types/HearingDetails"

import { createPncDisposalsFromResult } from "../../../phase2/lib/createPncDisposalsFromResult"
import createPncDisposal from "../../../phase2/lib/createPncDisposalsFromResult/createPncDisposal"
import isRecordableResult from "../../../phase2/lib/isRecordableResult"
import { HearingDetailsType } from "../../types/HearingDetails"
import getConvictionDateFromPncAdjudicationIfOffenceIsAdjournedSineDie from "../getConvictionDateFromPncAdjudicationIfOffenceIsAdjournedSineDie"

const createPncDisposalFromOffence = (aho: AnnotatedHearingOutcome, offence: Offence): PncDisposal[] => {
  const results = offence.Result
  const hasAdjournmentResult = results.some((result) => result.ResultClass?.includes("Adjournment"))

  const recordableResults = results.filter(isRecordableResult).sort((a, b) => a.CJSresultCode - b.CJSresultCode)
  const has2050Result = recordableResults.some((result) => result.PNCDisposalType === 2050)
  const hasConverted2060Result = recordableResults.some(
    (result) => result.PNCDisposalType === 2063 && result.CJSresultCode === 2060
  )

  let pncDisposals: PncDisposal[] = []
  let disposalsFor2060Result: PncDisposal[] = []
  let has3027Disposal = false
  let has2063Result = false

  for (const recordableResult of recordableResults) {
    const disposalCode = recordableResult.PNCDisposalType
    const resultCode = recordableResult.CJSresultCode
    let shouldIgnore2063Disposal = false
    has3027Disposal ||= disposalCode === 3027
    const pncDisposalsFromResult = createPncDisposalsFromResult(recordableResult)

    if (disposalCode === 2060 && disposalsFor2060Result.length === 0) {
      disposalsFor2060Result = pncDisposalsFromResult
    } else if (disposalCode === 2063) {
      if (resultCode === 2060) {
        disposalsFor2060Result = pncDisposalsFromResult
      } else {
        has2063Result = true
      }

      shouldIgnore2063Disposal = hasConverted2060Result && has2063Result
    }

    if ((disposalCode !== 3052 || !hasAdjournmentResult) && !shouldIgnore2063Disposal) {
      pncDisposals.push(...pncDisposalsFromResult)
    }
  }

  if (disposalsFor2060Result.length > 0 && (has2050Result || has2063Result) && pncDisposals.length == 2) {
    pncDisposals = disposalsFor2060Result
  }

  if (has3027Disposal || hasAdjournmentResult) {
    return pncDisposals
  }

  const convictionDate = getConvictionDateFromPncAdjudicationIfOffenceIsAdjournedSineDie(aho, offence)
  if (convictionDate) {
    pncDisposals.push(
      createPncDisposal(
        3027,
        undefined,
        undefined,
        undefined,
        undefined,
        convictionDate,
        undefined,
        undefined,
        undefined
      )
    )
  }

  return pncDisposals
}

const createDisposalsFromOffence = (aho: AnnotatedHearingOutcome, offence: Offence): Disposal[] =>
  createPncDisposalFromOffence(aho, offence).map((disposal) => ({
    disposalType: disposal.type?.toString() ?? "",
    disposalQuantity: disposal.qtyUnitsFined ?? "",
    disposalQualifiers: disposal.qualifiers ?? "",
    disposalText: disposal.text ?? "",
    type: HearingDetailsType.DISPOSAL
  }))

export default createDisposalsFromOffence
