import type { Offence, OffenceCode } from "../../../types/AnnotatedHearingOutcome"
import { lookupAlcoholLevelMethodBySpiCode, lookupResultQualifierCodeByCjsCode } from "../../dataLookup"
import { COMMON_LAWS, INDICTMENT } from "../../lib/offenceTypes"
import resultCodeIsOnStopList from "../../lib/result/resultCodeIsOnStopList"
import type { OffenceParsedXml, ResultedCaseMessageParsedXml, SpiResult } from "../../types/SpiResult"
import PopulateOffenceResults from "./PopulateOffenceResults"
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
  offences: Offence[]
  bailConditions: string[]
}

const adjournmentSineDieConditionMet = (spiResults: SpiResult[]) => {
  let a2007ResultFound = false
  let aFailConditionResultFound = false

  spiResults.forEach((result) => {
    const resultCode = result.ResultCode !== undefined ? Number(result.ResultCode) : undefined
    if (resultCode === adjournmentSineDieResultCode) {
      a2007ResultFound = true
    } else if (!resultCodeIsOnStopList(resultCode ?? 1000)) {
      aFailConditionResultFound = true
    }
  })

  return a2007ResultFound && !aFailConditionResultFound
}

const hasEnteredInErrorResult = (spiOffence: OffenceParsedXml): boolean =>
  spiOffence.Result.some(
    (result) => result.ResultCode !== undefined && Number(result.ResultCode) === enteredInErrorResultCode
  )

export default class {
  private bailConditions: string[] = []

  private isAdjournmentSineDieConditionMet = false

  constructor(private courtResult: ResultedCaseMessageParsedXml) {}

  private getOffenceReason = (spiOffenceCode: string): OffenceCode => {
    const spiOffenceCodeLength = spiOffenceCode.length
    const offenceCode: Pick<OffenceCode, "Reason" | "FullCode"> = {
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

  private populateOffence = (spiOffence: OffenceParsedXml): Offence => {
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

    const { results, bailQualifiers } = new PopulateOffenceResults(this.courtResult, spiOffence).execute()

    if (bailQualifiers.length > 0) {
      bailQualifiers.forEach((bailQualifier) => {
        const description = lookupResultQualifierCodeByCjsCode(bailQualifier)?.description
        if (description) {
          this.bailConditions.push(description)
        }
      })
    }

    const offence: Offence = {
      CriminalProsecutionReference: {
        OffenceReason: {
          OffenceCode: this.getOffenceReason(spiOffenceCode ?? ""),
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
      if ([ON_OR_IN, BEFORE, AFTER, ON_OR_ABOUT, ON_OR_BEFORE].includes(offenceDateCode)) {
        offence.OffenceTime = spiOffenceStartTime
      } else if (offenceDateCode === BETWEEN) {
        offence.StartTime = spiOffenceStartTime
      }
    }

    if (spiOffenceEnd?.OffenceEndTime) {
      offence.OffenceEndTime = removeSeconds(spiOffenceEnd.OffenceEndTime)
    }

    if (!spiConvictionDate) {
      this.isAdjournmentSineDieConditionMet ||= adjournmentSineDieConditionMet(spiResults)

      if (this.isAdjournmentSineDieConditionMet) {
        offence.ConvictionDate = new Date(this.courtResult.Session.CourtHearing.Hearing.DateOfHearing)
      }
    }

    return offence
  }

  execute(): OffencesResult {
    const spiOffences = this.courtResult.Session.Case.Defendant.Offence
    const offences = spiOffences.filter((o) => !hasEnteredInErrorResult(o)).map(this.populateOffence)

    return { offences, bailConditions: this.bailConditions }
  }
}
