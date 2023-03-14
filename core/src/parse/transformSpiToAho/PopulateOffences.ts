import { lookupAlcoholLevelMethodBySpiCode, lookupResultQualifierCodeByCjsCode } from "../../dataLookup"
import { COMMON_LAWS, INDICTMENT } from "../../lib/offenceTypes"
import resultCodeIsOnStopList from "../../lib/result/resultCodeIsOnStopList"
import type { CriminalProsecutionReference, Offence, OffenceCode } from "../../types/AnnotatedHearingOutcome"
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

export default class {
  private bailConditions: string[] = []

  constructor(
    private courtResult: ResultedCaseMessageParsedXml,
    private hearingDefendantBailConditions: string[] = [],
    private isAdjournmentSineDieConditionMet = false
  ) {}

  private getOffenceReason = (spiOffenceCode: string): OffenceCode => {
    const spiOffenceCodeLength = spiOffenceCode.length
    const offenceCode: Partial<OffenceCode> = {
      Reason: spiOffenceCodeLength > 4 ? spiOffenceCode.substring(4, Math.min(7, spiOffenceCodeLength)) : "",
      ...(spiOffenceCodeLength > 7 ? { Qualifier: spiOffenceCode.substring(7) } : {}),
      FullCode: spiOffenceCode
    }

    if (spiOffenceCode.startsWith(COMMON_LAWS)) {
      offenceCode.__type = "CommonLawOffenceCode"
      if (offenceCode.__type === "CommonLawOffenceCode") {
        offenceCode.CommonLawOffence = COMMON_LAWS
      }
    } else if (spiOffenceCode.startsWith(INDICTMENT)) {
      offenceCode.__type = "IndictmentOffenceCode"
      if (offenceCode.__type === "IndictmentOffenceCode") {
        offenceCode.Indictment = INDICTMENT
      }
    } else {
      offenceCode.__type = "NonMatchingOffenceCode"
      if (offenceCode.__type === "NonMatchingOffenceCode") {
        offenceCode.ActOrSource = spiOffenceCodeLength < 2 ? spiOffenceCode : spiOffenceCode.substring(0, 2)

        offenceCode.Year =
          spiOffenceCodeLength > 2 ? spiOffenceCode.substring(2, Math.min(4, spiOffenceCodeLength)) : ""
      }
    }

    return offenceCode as OffenceCode
  }

  private populateOffence = (spiOffence: OffenceParsedXml): Offence | undefined => {
    const offence = {} as Offence
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

    const enteredInError = spiResults.some(
      (result) => result.ResultCode !== undefined && Number(result.ResultCode) === enteredInErrorResultCode
    )
    if (enteredInError) {
      return undefined
    }

    const OffenceCode = this.getOffenceReason(spiOffenceCode ?? "")
    offence.CriminalProsecutionReference = {
      OffenceReason: {
        OffenceCode,
        __type: "NationalOffenceReason"
      }
    } as CriminalProsecutionReference

    offence.ArrestDate = spiArrestDate ? new Date(spiArrestDate) : undefined
    offence.ChargeDate = spiChargeDate ? new Date(spiChargeDate) : undefined
    offence.ActualOffenceDateCode = spiOffenceDateCode?.toString()
    offence.ActualOffenceStartDate = {
      StartDate: new Date(spiOffenceStart.OffenceDateStartDate)
    }
    offence.ActualOffenceEndDate = spiOffenceEnd ? { EndDate: new Date(spiOffenceEnd.OffenceEndDate) } : undefined
    offence.LocationOfOffence = spiLocationOfOffence
    offence.ActualOffenceWording = spiOffenceWording

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

    offence.CommittedOnBail = dontKnowValue
    offence.CourtOffenceSequenceNumber = Number(spiOffenceSequenceNumber)

    offence.ConvictionDate = spiConvictionDate ? new Date(spiConvictionDate) : undefined

    if (!spiConvictionDate) {
      this.isAdjournmentSineDieConditionMet ||= adjournmentSineDieConditionMet(spiResults)

      if (this.isAdjournmentSineDieConditionMet) {
        offence.ConvictionDate = new Date(this.courtResult.Session.CourtHearing.Hearing.DateOfHearing)
      }
    }

    const { results, bailQualifiers } = new PopulateOffenceResults(this.courtResult, spiOffence).execute()
    offence.Result = results

    if (this.hearingDefendantBailConditions.length > 0 && bailQualifiers.length > 0) {
      bailQualifiers.forEach((bailQualifier) => {
        const description = lookupResultQualifierCodeByCjsCode(bailQualifier)?.description
        if (description) {
          this.bailConditions.push(description)
        }
      })
    }

    return offence
  }

  execute(): OffencesResult {
    const spiOffences = this.courtResult.Session.Case.Defendant.Offence
    const offences = spiOffences.map(this.populateOffence).filter((offence) => !!offence) as Offence[]
    this.bailConditions = this.hearingDefendantBailConditions.concat(this.bailConditions)

    return { offences, bailConditions: this.bailConditions }
  }
}
