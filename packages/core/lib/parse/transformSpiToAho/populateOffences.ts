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
  ON_OR_IN: 1,
  BEFORE: 2,
  AFTER: 3,
  BETWEEN: 4,
  ON_OR_ABOUT: 5,
  ON_OR_BEFORE: 6
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
      OffenceCode: spiOffenceCode,
      OffenceSequenceNumber: spiOffenceSequenceNumber,
      ArrestDate: spiArrestDate,
      ChargeDate: spiChargeDate,
      LocationOfOffence: spiLocationOfOffence,
      OffenceWording: spiOffenceWording,
      AlcoholRelatedOffence: spiAlcoholRelatedOffence,
      OffenceTiming: { OffenceDateCode: spiOffenceDateCode, OffenceStart: spiOffenceStart, OffenceEnd: spiOffenceEnd }
    },
    ConvictionDate: spiConvictionDate,
    Result: spiResults
  } = spiOffence

  const { results, bailQualifiers } = populateOffenceResults(spiOffence, courtResult)

  if (bailQualifiers.length > 0) {
    bailQualifiers.forEach((bailQualifier) => {
      const description = lookupResultQualifierCodeByCjsCode(bailQualifier)?.description
      if (description) {
        bailConditions.push(description)
      }
    })
  }

  const offence: Offence = {
    CriminalProsecutionReference: {
      OffenceReason: {
        OffenceCode: getOffenceReason(spiOffenceCode ?? ""),
        __type: "NationalOffenceReason"
      }
    },
    ArrestDate: spiArrestDate ? new Date(spiArrestDate) : undefined,
    ChargeDate: spiChargeDate ? new Date(spiChargeDate) : undefined,
    ActualOffenceDateCode: spiOffenceDateCode?.toString(),
    ActualOffenceStartDate: {
      StartDate: new Date(spiOffenceStart.OffenceDateStartDate)
    },
    ActualOffenceEndDate: spiOffenceEnd ? { EndDate: new Date(spiOffenceEnd.OffenceEndDate) } : undefined,
    LocationOfOffence: spiLocationOfOffence,
    ActualOffenceWording: spiOffenceWording,
    CommittedOnBail: dontKnowValue,
    CourtOffenceSequenceNumber: Number(spiOffenceSequenceNumber),
    ConvictionDate: spiConvictionDate ? new Date(spiConvictionDate) : undefined,
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
    const { ON_OR_IN, BEFORE, AFTER, ON_OR_ABOUT, ON_OR_BEFORE, BETWEEN } = timeRange
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

  return { offence, bailConditions, adjournmentSineDieConditionWasMet }
}

const populateOffences = (courtResult: ResultedCaseMessageParsedXml): OffencesResult => {
  const spiOffences = courtResult.Session.Case.Defendant.Offence.filter((o) => !hasEnteredInErrorResult(o))
  const offences: Offence[] = []
  const allBailConditions: string[] = []
  let isAdjournmentSineDieConditionMet: boolean = false

  for (const spiOffence of spiOffences) {
    const { offence, bailConditions, adjournmentSineDieConditionWasMet } = populateOffence(
      spiOffence,
      courtResult,
      isAdjournmentSineDieConditionMet
    )
    isAdjournmentSineDieConditionMet ||= adjournmentSineDieConditionWasMet
    allBailConditions.push(...bailConditions)
    offences.push(offence)
  }

  return { offences, bailConditions: allBailConditions }
}

export default populateOffences
