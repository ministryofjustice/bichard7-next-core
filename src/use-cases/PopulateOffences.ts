import type { Offence, OffenceCode } from "src/types/HearingOutcome"
import type { OffenceParsedXml } from "src/types/IncomingMessage"
import { createElement } from "src/types/XmlElement"
import formatXmlDate from "src/utils/formatXmlDate"

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

export default class {
  adjournmentSineDieConditionMet: boolean

  bailQualifiers: []

  constructor(private spiOffences: OffenceParsedXml[], private spiDateOfHearing: string) {}

  private getOffenceReason = (spiOffenceCode: string): OffenceCode => {
    const spiOffenceCodeLength = spiOffenceCode.length
    const offenceCode = {
      Reason: createElement(
        spiOffenceCodeLength > 4 ? spiOffenceCode.substring(4, Math.min(7, spiOffenceCodeLength)) : ""
      ),
      ...(spiOffenceCodeLength > 7 ? { Qualifier: createElement(spiOffenceCode.substring(7)) } : {})
    } as OffenceCode

    if (spiOffenceCode.startsWith(COMMON_LAWS)) {
      offenceCode.CommonLawOffence = COMMON_LAWS
    } else if (spiOffenceCode.startsWith(INDICTMENT)) {
      offenceCode.Indictment = INDICTMENT
    } else {
      offenceCode.ActOrSource = createElement(
        spiOffenceCodeLength < 2 ? spiOffenceCode : spiOffenceCode.substring(0, 2)
      )
      offenceCode.Year = createElement(
        spiOffenceCodeLength > 2 ? spiOffenceCode.substring(2, Math.min(4, spiOffenceCodeLength)) : ""
      )
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

    offence.ArrestDate = createElement(formatXmlDate(spiArrestDate))
    offence.ChargeDate = createElement(formatXmlDate(spiChargeDate))
    offence.ActualOffenceDateCode = createElement(spiOffenceDateCode?.toString())
    offence.ActualOffenceStartDate = {
      StartDate: createElement(formatXmlDate(spiOffenceStart?.OffenceDateStartDate))
    }
    offence.ActualOffenceEndDate = {
      EndDate: createElement(formatXmlDate(spiOffenceEnd?.OffenceEndDate))
    }
    offence.LocationOfOffence = createElement(spiLocationOfOffence)
    offence.ActualOffenceWording = createElement(spiOffenceWording)

    if (spiAlcoholRelatedOffence) {
      offence.AlcoholLevel = {
        Amount: createElement(spiAlcoholRelatedOffence.AlcoholLevelAmount.toString()),
        Method: createElement("?????")
      }
    }

    offence.ConvictionDate = createElement(formatXmlDate(spiConvictionDate))
    offence.CommittedOnBail = createElement(DONT_KNOW_VALUE)
    offence.CourtOffenceSequenceNumber = createElement(spiOffenceSequenceNumber?.toString())

    if (!spiConvictionDate) {
      const a2007ResultFound = spiResults.some(
        (spiResult) => spiResult.ResultCode?.toString() === ADJOURNMENT_SINE_DIE_RESULT_CODE_STRING
      )
      const aFailConditionResultFound = spiResults.some((spiResult) => STOP_LIST.includes(spiResult.ResultCode))

      if (a2007ResultFound && !aFailConditionResultFound) {
        this.adjournmentSineDieConditionMet = true
      }

      if (this.adjournmentSineDieConditionMet) {
        offence.ConvictionDate = createElement(formatXmlDate(this.spiDateOfHearing))
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
