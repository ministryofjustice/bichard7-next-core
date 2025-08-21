import type { AnnotatedHearingOutcome, Offence } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type { PncDisposal } from "@moj-bichard7/common/types/PncQueryResult"

import type { PncUpdateDisposal } from "../../types/HearingDetails"

import { createPncDisposalsFromResult } from "../../../lib/results/createPncDisposalsFromResult"
import createPncDisposal from "../../../lib/results/createPncDisposalsFromResult/createPncDisposal"
import isRecordableResult from "../../../lib/results/isRecordableResult"
import { PncUpdateType } from "../../types/HearingDetails"
import getConvictionDateFromPncAdjudicationIfOffenceIsAdjournedSineDie from "./getConvictionDateFromPncAdjudicationIfOffenceIsAdjournedSineDie"

const toDisposal = (pncDisposal: PncDisposal): PncUpdateDisposal => ({
  disposalType: pncDisposal.type?.toString() ?? "",
  disposalQuantity: pncDisposal.qtyUnitsFined ?? "",
  disposalQualifiers: pncDisposal.qualifiers ?? "",
  disposalText: pncDisposal.type === 3027 ? null : (pncDisposal.text ?? ""),
  type: PncUpdateType.DISPOSAL
})

const createDisposalsFromOffence = (aho: AnnotatedHearingOutcome, offence: Offence): PncUpdateDisposal[] => {
  const results = offence.Result
  const recordableResults = results.filter(isRecordableResult).sort((a, b) => a.CJSresultCode - b.CJSresultCode)
  const hasAdjournmentResult = results.some((result) => result.ResultClass?.includes("Adjournment"))

  let pncDisposals: PncDisposal[] = []
  let pncDisposalsFor2060Result: PncDisposal[] = []
  let has2063Result = false

  for (const recordableResult of recordableResults) {
    const pncDisposalsFromResult = createPncDisposalsFromResult(recordableResult)
    const { PNCDisposalType: disposalCode, CJSresultCode: resultCode } = recordableResult

    const isConverted2060To2063Result = disposalCode === 2063 && resultCode === 2060
    if ((disposalCode === 2060 && pncDisposalsFor2060Result.length === 0) || isConverted2060To2063Result) {
      pncDisposalsFor2060Result = pncDisposalsFromResult
    }

    if (disposalCode === 2063 && resultCode !== 2060) {
      has2063Result = true
    }

    const shouldAdd2063Disposal = !isConverted2060To2063Result || !has2063Result
    if ((disposalCode !== 3052 || !hasAdjournmentResult) && shouldAdd2063Disposal) {
      pncDisposals.push(...pncDisposalsFromResult)
    }
  }

  const has2050Result = recordableResults.some((result) => result.PNCDisposalType === 2050)
  if (pncDisposalsFor2060Result.length > 0 && (has2050Result || has2063Result) && pncDisposals.length == 2) {
    pncDisposals = pncDisposalsFor2060Result
  }

  const has3027Result = recordableResults.some((result) => result.PNCDisposalType === 3027)
  if (has3027Result || hasAdjournmentResult) {
    return pncDisposals.map(toDisposal)
  }

  const convictionDate = getConvictionDateFromPncAdjudicationIfOffenceIsAdjournedSineDie(aho, offence)
  if (convictionDate) {
    pncDisposals.push(createPncDisposal({ pncDisposalType: 3027, dateSpecifiedInResult: convictionDate }))
  }

  return pncDisposals.map(toDisposal)
}

export default createDisposalsFromOffence
