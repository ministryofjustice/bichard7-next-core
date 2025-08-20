import type { Offence, OffenceCode } from "../../../types/AnnotatedHearingOutcome"
import type { OffenceParsedXml, ResultedCaseMessageParsedXml, SpiResult } from "../../../types/SpiResult"

import { lookupAlcoholLevelMethodBySpiCode, lookupResultQualifierCodeByCjsCode } from "../../dataLookup"
import nonRecordableResultCodes from "../../offences/nonRecordableResultCodes"
import { COMMON_LAWS, INDICTMENT } from "../../offences/offenceTypes"
import populateOffenceResults from "./populateOffenceResults"
import removeSeconds from "./removeSeconds"

const enteredInErrorResultCode = 4583 // Hearing Removed
const dontKnowValue = "D"
const adjournmentSineDieResultCode = 2007
// TODO: Refactor into an enum
const timeRange = {
  AFTER: 3,
  BEFORE: 2,
  BETWEEN: 4,
  ON_OR_ABOUT: 5,
  ON_OR_BEFORE: 6,
  ON_OR_IN: 1
}

export interface OffencesResult {
  bailConditions: string[]
  offences: Offence[]
}

const adjournmentSineDieConditionMet = (spiResults: SpiResult[]) => {
  let a2007ResultFound = false
  let aFailConditionResultFound = false

  spiResults.forEach((result) => {
    const resultCode = result.ResultCode !== undefined ? Number(result.ResultCode) : undefined
    if (resultCode === adjournmentSineDieResultCode) {
      a2007ResultFound = true
    } else if (!nonRecordableResultCodes.includes(resultCode ?? 1000)) {
      aFailConditionResultFound = true
    }
  })

  return a2007ResultFound && !aFailConditionResultFound
}

const hasEnteredInErrorResult = (spiOffence: OffenceParsedXml): boolean =>
  spiOffence.Result.some(
    (result) => result.ResultCode !== undefined && Number(result.ResultCode) === enteredInErrorResultCode
  )

const getOffenceReason = (spiOffenceCode: string): OffenceCode => {
  const spiOffenceCodeLength = spiOffenceCode.length
  const offenceCode: Pick<OffenceCode, "FullCode" | "Reason"> = {
    Reason: spiOffenceCodeLength > 4 ? spiOffenceCode.substring(4, Math.min(7, spiOffenceCodeLength)) : "",
    ...(spiOffenceCodeLength > 7 ? { Qualifier: spiOffenceCode.substring(7) } : {}),
    FullCode: spiOffenceCode
  }

  if (spiOffenceCode.startsWith(COMMON_LAWS)) {
    return {
      __type: "CommonLawOffenceCode",
      CommonLawOffence: COMMON_LAWS,
      ...offenceCode
    }
  }

  // Note: We do not receive indictment offences in magistrate courts but this is left for completeness
  if (spiOffenceCode.startsWith(INDICTMENT)) {
    return {
      __type: "IndictmentOffenceCode",
      Indictment: INDICTMENT,
      ...offenceCode
    }
  }

  return {
    __type: "NonMatchingOffenceCode",
    ActOrSource: spiOffenceCodeLength < 2 ? spiOffenceCode : spiOffenceCode.substring(0, 2),
    Year: spiOffenceCodeLength > 2 ? spiOffenceCode.substring(2, Math.min(4, spiOffenceCodeLength)) : "",
    ...offenceCode
  }
}

const populateOffence = (
  spiOffence: OffenceParsedXml,
  courtResult: ResultedCaseMessageParsedXml,
  isAdjournmentSineDieConditionMet: boolean
) => {
  let adjournmentSineDieConditionWasMet = isAdjournmentSineDieConditionMet
  const bailConditions: string[] = []

  const {
    BaseOffenceDetails: {
      AlcoholRelatedOffence: spiAlcoholRelatedOffence,
      ArrestDate: spiArrestDate,
      ChargeDate: spiChargeDate,
      LocationOfOffence: spiLocationOfOffence,
      OffenceCode: spiOffenceCode,
      OffenceSequenceNumber: spiOffenceSequenceNumber,
      OffenceTiming: { OffenceDateCode: spiOffenceDateCode, OffenceEnd: spiOffenceEnd, OffenceStart: spiOffenceStart },
      OffenceWording: spiOffenceWording
    },
    ConvictionDate: spiConvictionDate,
    Result: spiResults
  } = spiOffence

  const { bailQualifiers, results } = populateOffenceResults(spiOffence, courtResult)

  if (bailQualifiers.length > 0) {
    bailQualifiers.forEach((bailQualifier) => {
      const description = lookupResultQualifierCodeByCjsCode(bailQualifier)?.description
      if (description) {
        bailConditions.push(description)
      }
    })
  }

  const offence: Offence = {
    ActualOffenceDateCode: spiOffenceDateCode?.toString(),
    ActualOffenceEndDate: spiOffenceEnd ? { EndDate: new Date(spiOffenceEnd.OffenceEndDate) } : undefined,
    ActualOffenceStartDate: {
      StartDate: new Date(spiOffenceStart.OffenceDateStartDate)
    },
    ActualOffenceWording: spiOffenceWording,
    ArrestDate: spiArrestDate ? new Date(spiArrestDate) : undefined,
    ChargeDate: spiChargeDate ? new Date(spiChargeDate) : undefined,
    CommittedOnBail: dontKnowValue,
    ConvictionDate: spiConvictionDate ? new Date(spiConvictionDate) : undefined,
    CourtOffenceSequenceNumber: Number(spiOffenceSequenceNumber),
    CriminalProsecutionReference: {
      OffenceReason: {
        __type: "NationalOffenceReason",
        OffenceCode: getOffenceReason(spiOffenceCode ?? "")
      }
    },
    LocationOfOffence: spiLocationOfOffence,
    Result: results
  }

  if (spiAlcoholRelatedOffence) {
    offence.AlcoholLevel = {
      Amount: Number(spiAlcoholRelatedOffence.AlcoholLevelAmount),
      Method:
        lookupAlcoholLevelMethodBySpiCode(spiAlcoholRelatedOffence.AlcoholLevelMethod)?.cjsCode ??
        spiAlcoholRelatedOffence.AlcoholLevelMethod
    }
  }

  if (spiOffenceStart?.OffenceStartTime) {
    const spiOffenceStartTime = removeSeconds(spiOffenceStart.OffenceStartTime)

    const offenceDateCode = Number(spiOffenceDateCode)
    const { AFTER, BEFORE, BETWEEN, ON_OR_ABOUT, ON_OR_BEFORE, ON_OR_IN } = timeRange
    if ([AFTER, BEFORE, ON_OR_ABOUT, ON_OR_BEFORE, ON_OR_IN].includes(offenceDateCode)) {
      offence.OffenceTime = spiOffenceStartTime
    } else if (offenceDateCode === BETWEEN) {
      offence.StartTime = spiOffenceStartTime
    }
  }

  if (spiOffenceEnd?.OffenceEndTime) {
    offence.OffenceEndTime = removeSeconds(spiOffenceEnd.OffenceEndTime)
  }

  if (!spiConvictionDate) {
    adjournmentSineDieConditionWasMet ||= adjournmentSineDieConditionMet(spiResults)

    if (adjournmentSineDieConditionWasMet) {
      offence.ConvictionDate = new Date(courtResult.Session.CourtHearing.Hearing.DateOfHearing)
    }
  }

  return { adjournmentSineDieConditionWasMet, bailConditions, offence }
}

const populateOffences = (courtResult: ResultedCaseMessageParsedXml): OffencesResult => {
  const spiOffences = courtResult.Session.Case.Defendant.Offence.filter((o) => !hasEnteredInErrorResult(o))
  const offences: Offence[] = []
  const allBailConditions: string[] = []
  let isAdjournmentSineDieConditionMet: boolean = false

  for (const spiOffence of spiOffences) {
    const { adjournmentSineDieConditionWasMet, bailConditions, offence } = populateOffence(
      spiOffence,
      courtResult,
      isAdjournmentSineDieConditionMet
    )
    isAdjournmentSineDieConditionMet ||= adjournmentSineDieConditionWasMet
    allBailConditions.push(...bailConditions)
    offences.push(offence)
  }

  return { bailConditions: allBailConditions, offences }
}

export default populateOffences
