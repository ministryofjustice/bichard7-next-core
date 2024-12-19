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
  let pncDisposals: PncDisposal[] = []

  let found3027 = false
  const adjournmentExists = results.some((result) => result.ResultClass?.includes("Adjournment"))
  let disposalFor2060Result: null | PncDisposal[] = null
  let found2050Result = false
  let found2063Result = false
  let converted2060Result = false

  const recordableResults = results.filter(isRecordableResult).sort((a, b) => a.CJSresultCode - b.CJSresultCode)

  for (const recordableResult of recordableResults) {
    const disposalCode = recordableResult.PNCDisposalType
    const resultCode = recordableResult.CJSresultCode
    let ignore2063Disposal = false
    found3027 ||= disposalCode === 3027
    const pncDisposalsFromResult = createPncDisposalsFromResult(recordableResult)

    if (disposalCode === 2060 && disposalFor2060Result == null) {
      disposalFor2060Result = pncDisposalsFromResult
    } else if (disposalCode === 2050) {
      found2050Result = true
    } else if (disposalCode === 2063) {
      if (resultCode === 2060) {
        converted2060Result = true
        disposalFor2060Result = pncDisposalsFromResult
      } else {
        found2063Result = true
      }

      if (converted2060Result && found2063Result) {
        ignore2063Disposal = true
      }
    }

    if ((disposalCode !== 3052 || !adjournmentExists) && !ignore2063Disposal) {
      pncDisposals.push(...pncDisposalsFromResult)
    }
  }

  if (disposalFor2060Result && (found2050Result || found2063Result) && pncDisposals.length == 2) {
    pncDisposals = disposalFor2060Result
  }

  if (found3027 || adjournmentExists) {
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
