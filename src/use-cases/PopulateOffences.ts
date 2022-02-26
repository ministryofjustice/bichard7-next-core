import type { Offence, OffenceCode } from "src/types/AnnotatedHearingOutcome"
import type { OffenceParsedXml } from "src/types/IncomingMessage"
import removeSeconds from "src/utils/removeSeconds"

const ENTERED_IN_ERROR_RESULT_CODE = 4583 // Hearing Removed
const STOP_LIST = [
  1000, 1505, 1509, 1510, 1511, 1513, 1514, 2069, 2501, 2505, 2507, 2508, 2509, 2511, 2514, 3501, 3502, 3503, 3504,
  3508, 3509, 3510, 3512, 3514, 4049, 4505, 4507, 4509, 4510, 4532, 4534, 4544, 4584, 4585, 4586, 3118, 4592, 4593,
  4594, 4595, 4596, 4597
]
const COMMON_LAWS = "COML"
const INDICTMENT = "XX00"
const DONT_KNOW_VALUE = "D"
const ADJOURNMENT_SINE_DIE_RESULT_CODE_STRING = "2007"

const ON_OR_IN = 1
const BEFORE = 2
const AFTER = 3
const BETWEEN = 4
const ON_OR_ABOUT = 5
const ON_OR_BEFORE = 6

export default class {
  adjournmentSineDieConditionMet: boolean

  bailQualifiers: []

  constructor(private spiOffences: OffenceParsedXml[], private spiDateOfHearing: string) {}

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

    offence.ArrestDate = spiArrestDate
    offence.ChargeDate = spiChargeDate
    offence.ActualOffenceDateCode = spiOffenceDateCode?.toString()
    offence.ActualOffenceStartDate = {
      StartDate: spiOffenceStart?.OffenceDateStartDate
    }
    offence.ActualOffenceEndDate = {
      EndDate: spiOffenceEnd?.OffenceEndDate
    }
    offence.LocationOfOffence = spiLocationOfOffence
    offence.ActualOffenceWording = spiOffenceWording

    if (spiAlcoholRelatedOffence) {
      offence.AlcoholLevel = {
        Amount: spiAlcoholRelatedOffence.AlcoholLevelAmount.toString(),
        Method: "?????"
      }
    }

    if (spiOffenceStart?.OffenceStartTime) {
      const spiOffenceStartTime = removeSeconds(spiOffenceStart.OffenceStartTime)

      if ([ON_OR_IN, BEFORE, AFTER, ON_OR_ABOUT, ON_OR_BEFORE].includes(spiOffenceDateCode)) {
        offence.OffenceTime = spiOffenceStartTime
      } else if (spiOffenceDateCode === BETWEEN) {
        offence.StartTime = spiOffenceStartTime
      }
    }

    if (spiOffenceEnd?.OffenceEndTime) {
      offence.OffenceEndTime = removeSeconds(spiOffenceEnd.OffenceEndTime)
    }

    offence.ConvictionDate = spiConvictionDate
    offence.CommittedOnBail = DONT_KNOW_VALUE
    offence.CourtOffenceSequenceNumber = spiOffenceSequenceNumber?.toString()

    if (!spiConvictionDate) {
      const a2007ResultFound = spiResults.some(
        (spiResult) => spiResult.ResultCode?.toString() === ADJOURNMENT_SINE_DIE_RESULT_CODE_STRING
      )
      const aFailConditionResultFound = spiResults.some((spiResult) => STOP_LIST.includes(spiResult.ResultCode))

      if (a2007ResultFound && !aFailConditionResultFound) {
        this.adjournmentSineDieConditionMet = true
      }

      if (this.adjournmentSineDieConditionMet) {
        offence.ConvictionDate = this.spiDateOfHearing
      }
    }

    return offence
  }

  execute(): Offence[] {
    this.adjournmentSineDieConditionMet = false
    this.bailQualifiers = []
    return this.spiOffences.map(this.populateOffence).filter((offence) => !!offence) as Offence[]
  }
}
