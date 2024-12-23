import type { AnnotatedHearingOutcome, Offence } from "../../../types/AnnotatedHearingOutcome"
import type { PncDisposal } from "../../../types/PncQueryResult"
import type { Disposal } from "../../types/HearingDetails"

import { createPncDisposalsFromResult } from "../../../phase2/lib/createPncDisposalsFromResult"
import createPncDisposal from "../../../phase2/lib/createPncDisposalsFromResult/createPncDisposal"
import isRecordableResult from "../../../phase2/lib/isRecordableResult"
import { HearingDetailsType } from "../../types/HearingDetails"
import getConvictionDateFromPncAdjudicationIfOffenceIsAdjournedSineDie from "../getConvictionDateFromPncAdjudicationIfOffenceIsAdjournedSineDie"

const toDisposal = (pncDisposal: PncDisposal): Disposal => ({
  disposalType: pncDisposal.type?.toString() ?? "",
  disposalQuantity: pncDisposal.qtyUnitsFined ?? "",
  disposalQualifiers: pncDisposal.qualifiers ?? "",
  disposalText: pncDisposal.text ?? "",
  type: HearingDetailsType.DISPOSAL
})

const createDisposalsFromOffence = (aho: AnnotatedHearingOutcome, offence: Offence): Disposal[] => {
  const results = offence.Result
  const recordableResults = results.filter(isRecordableResult).sort((a, b) => a.CJSresultCode - b.CJSresultCode)
  const hasAdjournmentResult = results.some((result) => result.ResultClass?.includes("Adjournment"))

  let pncDisposals: PncDisposal[] = []
  let disposalsFor2060Result: PncDisposal[] = []
  let has2063Result = false

  for (const recordableResult of recordableResults) {
    const pncDisposalsFromResult = createPncDisposalsFromResult(recordableResult)
    const { PNCDisposalType: disposalCode, CJSresultCode: resultCode } = recordableResult

    const hasConverted2060Result = disposalCode === 2063 && resultCode === 2060
    if ((disposalCode === 2060 && disposalsFor2060Result.length === 0) || hasConverted2060Result) {
      disposalsFor2060Result = pncDisposalsFromResult
    }

    if (disposalCode === 2063 && resultCode !== 2060) {
      has2063Result = true
    }

    const shouldAdd2063Disposal = !hasConverted2060Result || !has2063Result
    if ((disposalCode !== 3052 || !hasAdjournmentResult) && shouldAdd2063Disposal) {
      pncDisposals.push(...pncDisposalsFromResult)
    }
  }

  const has2050Result = recordableResults.some((result) => result.PNCDisposalType === 2050)
  if (disposalsFor2060Result.length > 0 && (has2050Result || has2063Result) && pncDisposals.length == 2) {
    pncDisposals = disposalsFor2060Result
  }

  const has3027Disposal = recordableResults.some((result) => result.PNCDisposalType === 3027)
  if (has3027Disposal || hasAdjournmentResult) {
    return pncDisposals.map(toDisposal)
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

  return pncDisposals.map(toDisposal)
}

export default createDisposalsFromOffence
