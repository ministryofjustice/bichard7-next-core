import {
  ADJOURNMENT_SINE_DIE_RESULT_CODE_STRING,
  COMMON_LAWS,
  DONT_KNOW_VALUE,
  ENTERED_IN_ERROR_RESULT_CODE,
  INDICTMENT,
  STOP_LIST,
  TIME_RANGE
} from "src/lib/properties"
import type { Offence, OffenceCode } from "src/types/AnnotatedHearingOutcome"
import type { OffenceParsedXml, ResultedCaseMessageParsedXml } from "src/types/IncomingMessage"
import removeSeconds from "src/utils/removeSeconds"
import { lookupAlcoholLevelMethodBySpiCode, lookupResultQualifierCodeByCjsCode } from "./dataLookup"
import PopulateOffenceResults from "./PopulateOffenceResults"

export interface OffencesResult {
  offences: Offence[]
  bailConditions: string[]
}

export default class {
  adjournmentSineDieConditionMet = false

  bailConditions: string[] = []

  constructor(private courtResult: ResultedCaseMessageParsedXml, private hearingDefendantBailConditions: string[]) {}

  private getOffenceReason = (spiOffenceCode: string): OffenceCode => {
    const spiOffenceCodeLength = spiOffenceCode.length
    const offenceCode = {
      Reason: spiOffenceCodeLength > 4 ? spiOffenceCode.substring(4, Math.min(7, spiOffenceCodeLength)) : "",
      ...(spiOffenceCodeLength > 7 ? { Qualifier: spiOffenceCode.substring(7) } : {})
    } as OffenceCode

    if (spiOffenceCode.startsWith(COMMON_LAWS)) {
      offenceCode.CommonLawOffence = COMMON_LAWS
    } else if (spiOffenceCode.startsWith(INDICTMENT)) {
      offenceCode.Indictment = INDICTMENT
    } else {
      offenceCode.ActOrSource = spiOffenceCodeLength < 2 ? spiOffenceCode : spiOffenceCode.substring(0, 2)

      offenceCode.Year = spiOffenceCodeLength > 2 ? spiOffenceCode.substring(2, Math.min(4, spiOffenceCodeLength)) : ""
    }
    offenceCode.FullCode = spiOffenceCode

    return offenceCode
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

    spiResults.forEach((spiResult) => {
      if (spiResult.ResultCode === ENTERED_IN_ERROR_RESULT_CODE) {
        console.log(`Offence entered in error: ${spiOffenceCode}`)
        return undefined
      }
    })

    const OffenceCode = this.getOffenceReason(spiOffenceCode ?? "")
    offence.CriminalProsecutionReference = {
      OffenceReason: {
        OffenceCode
      }
    }

    offence.ArrestDate = spiArrestDate ? new Date(spiArrestDate) : undefined
    offence.ChargeDate = spiChargeDate ? new Date(spiChargeDate) : undefined
    offence.ActualOffenceDateCode = spiOffenceDateCode?.toString()
    offence.ActualOffenceStartDate = {
      StartDate: new Date(spiOffenceStart.OffenceDateStartDate)
    }
    offence.ActualOffenceEndDate = {
      EndDate: spiOffenceEnd ? new Date(spiOffenceEnd.OffenceEndDate) : undefined
    }
    offence.LocationOfOffence = spiLocationOfOffence
    offence.ActualOffenceWording = spiOffenceWording

    if (spiAlcoholRelatedOffence) {
      offence.AlcoholLevel = {
        Amount: spiAlcoholRelatedOffence.AlcoholLevelAmount.toString(),
        Method:
          lookupAlcoholLevelMethodBySpiCode(spiAlcoholRelatedOffence.AlcoholLevelMethod)?.cjsCode ??
          spiAlcoholRelatedOffence.AlcoholLevelMethod
      }
    }

    if (spiOffenceStart?.OffenceStartTime) {
      const spiOffenceStartTime = removeSeconds(spiOffenceStart.OffenceStartTime)

      const { ON_OR_IN, BEFORE, AFTER, ON_OR_ABOUT, ON_OR_BEFORE, BETWEEN } = TIME_RANGE
      if ([ON_OR_IN, BEFORE, AFTER, ON_OR_ABOUT, ON_OR_BEFORE].includes(spiOffenceDateCode)) {
        offence.OffenceTime = spiOffenceStartTime
      } else if (spiOffenceDateCode === BETWEEN) {
        offence.StartTime = spiOffenceStartTime
      }
    }

    if (spiOffenceEnd?.OffenceEndTime) {
      offence.OffenceEndTime = removeSeconds(spiOffenceEnd.OffenceEndTime)
    }

    offence.ConvictionDate = spiConvictionDate ? new Date(spiConvictionDate) : undefined
    offence.CommittedOnBail = DONT_KNOW_VALUE
    offence.CourtOffenceSequenceNumber = spiOffenceSequenceNumber

    if (!spiConvictionDate) {
      const a2007ResultFound = spiResults.some(
        (spiResult) => spiResult.ResultCode?.toString() === ADJOURNMENT_SINE_DIE_RESULT_CODE_STRING
      )
      const aFailConditionResultFound = spiResults.some((spiResult) => STOP_LIST.includes(spiResult.ResultCode))

      if (a2007ResultFound && !aFailConditionResultFound) {
        this.adjournmentSineDieConditionMet = true
      }

      if (this.adjournmentSineDieConditionMet) {
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
