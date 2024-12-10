import type { AnnotatedHearingOutcome, Offence } from "../../types/AnnotatedHearingOutcome"
import type { PncDisposal } from "../../types/PncQueryResult"

import { createPncDisposalsFromResult } from "../../phase2/lib/createPncDisposalsFromResult"
import createPncDisposal from "../../phase2/lib/createPncDisposalsFromResult/createPncDisposal"
import findPncCourtCase from "../../phase2/lib/findPncCourtCase"
import isRecordableResult from "../../phase2/lib/isRecordableResult"

const ADJOURNED_SINE_DIE_DISPOSAL_CODE = 2007
const getConvictionDateFromPncAdjudicationIfOffenceIsAdjournedSineDie = (
  aho: AnnotatedHearingOutcome,
  offence: Offence
) => {
  if (
    !offence.CriminalProsecutionReference.OffenceReasonSequence ||
    !aho.PncQuery ||
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.PenaltyNoticeCaseReferenceNumber
  ) {
    return undefined
  }

  const courtCase = findPncCourtCase(aho, offence)
  const matchingOffence = courtCase?.offences.find(
    (pncOffence) =>
      pncOffence.offence.sequenceNumber === Number(offence.CriminalProsecutionReference.OffenceReasonSequence)
  )

  const areAllDisposals2007 =
    matchingOffence?.disposals &&
    matchingOffence.disposals.length > 0 &&
    matchingOffence.disposals.every((disposal) => disposal.type === ADJOURNED_SINE_DIE_DISPOSAL_CODE)

  return areAllDisposals2007 ? matchingOffence.adjudication?.sentenceDate : undefined
}

const createPncDisposalFromOffence = (aho: AnnotatedHearingOutcome, offence: Offence): PncDisposal[] => {
  const results = offence.Result
  let pncDisposals: PncDisposal[] = []

  let found3027 = false
  const adjournmentExists = results.some((result) => result.ResultClass?.includes("Adjournment"))
  let disposalFor2060Result: null | PncDisposal[] = null
  let found2050Result = false
  let found2063Result = false
  let converted2060Result = false

  results
    .filter(isRecordableResult)
    .sort((a, b) => a.CJSresultCode - b.CJSresultCode)
    .forEach((result) => {
      const disposalCode = result.PNCDisposalType
      const resultCode = result.CJSresultCode
      let ignore2063Disposal = false
      found3027 ||= disposalCode === 3027
      const generatedDisposals = createPncDisposalsFromResult(result)

      if (disposalCode === 2060 && disposalFor2060Result == null) {
        disposalFor2060Result = generatedDisposals
      } else if (disposalCode === 2050) {
        found2050Result = true
      } else if (disposalCode === 2063) {
        if (resultCode === 2060) {
          converted2060Result = true
          disposalFor2060Result = generatedDisposals
        } else {
          found2063Result = true
        }

        if (converted2060Result && found2063Result) {
          ignore2063Disposal = true
        }
      }

      if ((disposalCode !== 3052 || !adjournmentExists) && !ignore2063Disposal) {
        pncDisposals.push(...generatedDisposals)
      }
    })

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

export default createPncDisposalFromOffence
