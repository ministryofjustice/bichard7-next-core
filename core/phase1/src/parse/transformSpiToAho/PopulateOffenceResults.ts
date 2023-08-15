import {
  lookupModeOfTrialReasonBySpiCode,
  lookupOrganisationUnitByThirdLevelPsaCode,
  lookupPleaStatusBySpiCode,
  lookupRemandStatusBySpiCode,
  lookupVerdictBySpiCode
} from "../../dataLookup"
import extractCodesFromOU from "../../dataLookup/extractCodesFromOU"
import countDecimalPlaces from "../../lib/countDecimalPlaces"
import getOrganisationUnit from "../../lib/organisationUnit/getOrganisationUnit"
import type { Duration, OrganisationUnitCodes, Result } from "../../types/AnnotatedHearingOutcome"
import type { CjsPlea } from "../../types/Plea"
import type { ResultedCaseMessageParsedXml, SpiNextHearingDetails, SpiOffence, SpiResult } from "../../types/SpiResult"
import type { CjsVerdict } from "../../types/Verdict"
import getRemandDetailsFromResultText from "./getRemandDetailsFromResultText"
import lookupAmountTypeByCjsCode from "./lookupAmountTypeByCjsCode"

const freeTextResultCode = 1000
const otherValue = "OTHER"
const warrantIssueDateResultCodes = [4505, 4575, 4576, 4577, 4585, 4586]
const offencesTicRegex = /(\d+) other offences admitted and taken into consideration/i
const libraMaxQualifiers = 4
const libraElectronicTaggingText = "to be electronically monitored"
const taggingFixAdd = 3105
const taggingFixRemove = [1115, 1116, 1141, 1142, 1143]
const bailQualifierCode = "BA"
const durationTypes = {
  DURATION: "Duration"
}
const durationUnits = {
  SESSIONS: "S",
  HOURS: "H"
}
const resultPenaltyPoints = 3008
const resultCurfew1 = 1052
const resultCurfew2 = 3105

export interface OffenceResultsResult {
  results: Result[]
  bailQualifiers: string[]
}

const createDuration = (durationUnit: string, durationValue: number): Duration => ({
  DurationType: durationTypes.DURATION,
  DurationUnit: !durationUnit || durationUnit === "." ? durationUnits.SESSIONS : durationUnit,
  DurationLength: durationValue
})

const populateNextHearingDetails = (result: Result, nextHearingDetails: SpiNextHearingDetails): void => {
  result.NextHearingDate = nextHearingDetails.DateOfHearing ? new Date(nextHearingDetails.DateOfHearing) : undefined
  result.NextHearingTime = nextHearingDetails.TimeOfHearing
  // TODO: Currently Bichard looks this up by Third Level PSA code, but the data we receive is actully an org unit code
  if (nextHearingDetails.CourtHearingLocation !== undefined) {
    const codeNeedsPadding =
      nextHearingDetails.CourtHearingLocation.length > 0 && nextHearingDetails.CourtHearingLocation.length < 4
    const paddedCode = codeNeedsPadding
      ? nextHearingDetails.CourtHearingLocation.padEnd(4, "0")
      : nextHearingDetails.CourtHearingLocation
    const ou = lookupOrganisationUnitByThirdLevelPsaCode(paddedCode)
    if (ou) {
      result.NextResultSourceOrganisation = extractCodesFromOU(ou)
    }
  }
}

export default class {
  private baResultCodeQualifierHasBeenExcluded = false

  private bailQualifiers = new Set<string>()

  private baQualifierAdded = false

  constructor(
    private courtResult: ResultedCaseMessageParsedXml,
    private spiOffence: SpiOffence
  ) {}

  private populateResult(spiResult: SpiResult): Result {
    const {
      Session: {
        Case: {
          Defendant: { CourtIndividualDefendant: spiCourtIndividualDefendant }
        },
        CourtHearing: {
          Hearing: { DateOfHearing: spiDateOfHearing }
        }
      }
    } = this.courtResult
    const { ConvictingCourt: spiConvictingCourt, ConvictionDate: spiConvictionDate } = this.spiOffence
    const {
      ResultCode: spiResultCode,
      NextHearing: spiNextHearing,
      ResultCodeQualifier: spiResultCodeQualifier,
      Outcome: spiOutcome
    } = spiResult
    const result = {} as Result
    const spiResultCodeNumber = spiResultCode ? Number(spiResultCode) : freeTextResultCode
    result.CJSresultCode = spiResultCodeNumber

    if (spiNextHearing?.BailStatusOffence) {
      result.OffenceRemandStatus =
        lookupRemandStatusBySpiCode(spiNextHearing.BailStatusOffence)?.cjsCode ?? spiNextHearing.BailStatusOffence
    }

    result.SourceOrganisation = getOrganisationUnit(this.courtResult.Session.CourtHearing.Hearing.CourtHearingLocation)

    result.ConvictingCourt = spiConvictingCourt
    result.ResultHearingType = otherValue
    result.ResultHearingDate = new Date(spiConvictionDate ?? spiDateOfHearing)

    if (typeof spiCourtIndividualDefendant?.ReasonForBailConditionsOrCustody === "string") {
      result.ReasonForOffenceBailConditions = spiCourtIndividualDefendant.ReasonForBailConditionsOrCustody
    }

    if (spiNextHearing && spiNextHearing.NextHearingDetails) {
      populateNextHearingDetails(result, spiNextHearing.NextHearingDetails)
    }

    if (spiOutcome) {
      const {
        Duration: spiDuration,
        ResultAmountSterling: spiResultAmountSterling,
        PenaltyPoints: spiPenaltyPoints
      } = spiOutcome
      result.Duration = result.Duration ?? []
      if (spiDuration) {
        const {
          DurationUnit: spiDurationUnit,
          DurationValue: spiDurationValue,
          SecondaryDurationValue: spiSecondaryDurationValue,
          SecondaryDurationUnit: spiSecondaryDurationUnit,
          DurationStartDate: spiDurationStartDate,
          DurationEndDate: spiDurationEndDate
        } = spiDuration
        if (spiDurationUnit && spiDurationValue !== undefined) {
          result.Duration.push(createDuration(spiDurationUnit, Number(spiDurationValue)))
        }

        if (spiSecondaryDurationUnit && spiSecondaryDurationValue !== undefined) {
          result.Duration.push(createDuration(spiSecondaryDurationUnit, Number(spiSecondaryDurationValue)))
        }

        result.DateSpecifiedInResult = result.DateSpecifiedInResult ?? []
        spiDurationStartDate.forEach((durationStartDate) => {
          result.DateSpecifiedInResult?.push({ Date: new Date(durationStartDate), Sequence: 1 })
        })
        spiDurationEndDate.forEach((durationEndDate) => {
          result.DateSpecifiedInResult?.push({ Date: new Date(durationEndDate), Sequence: 2 })
        })
      }

      if (spiResultAmountSterling) {
        result.AmountSpecifiedInResult = result.AmountSpecifiedInResult ?? []
        const amountType = lookupAmountTypeByCjsCode(result.CJSresultCode)
        result.AmountSpecifiedInResult.push({
          Amount: Number(spiResultAmountSterling),
          DecimalPlaces: countDecimalPlaces(spiResultAmountSterling),
          Type: amountType
        })
      }

      if (spiResultCode) {
        const resultCode = Number(spiResultCode)
        result.NumberSpecifiedInResult = result.NumberSpecifiedInResult ?? []
        if (resultCode === resultPenaltyPoints && spiPenaltyPoints) {
          result.NumberSpecifiedInResult.push({ Number: Number(spiPenaltyPoints), Type: "P" })
        } else if (
          (resultCode === resultCurfew1 || resultCode === resultCurfew2) &&
          spiDuration?.SecondaryDurationUnit === durationUnits.HOURS &&
          spiDuration?.SecondaryDurationValue
        ) {
          result.NumberSpecifiedInResult.push({ Number: Number(spiDuration.SecondaryDurationValue), Type: "P" })
        }
      }
    }

    if (spiNextHearing) {
      const {
        NextHearingDetails: {
          CourtHearingLocation: spiNextCourtHearingLocation,
          DateOfHearing: spiNextDateOfHearing,
          TimeOfHearing: spiNextTimeOfHearing
        }
      } = spiNextHearing
      if (spiNextCourtHearingLocation) {
        result.NextResultSourceOrganisation = {
          OrganisationUnitCode:
            lookupOrganisationUnitByThirdLevelPsaCode(spiNextCourtHearingLocation)?.thirdLevelCode ??
            spiNextCourtHearingLocation
        } as OrganisationUnitCodes

        result.NextHearingDate = new Date(spiNextDateOfHearing)
        result.NextHearingTime = spiNextTimeOfHearing
      }
    }

    if (this.spiOffence.Plea) {
      result.PleaStatus =
        (lookupPleaStatusBySpiCode(this.spiOffence.Plea)?.cjsCode as CjsPlea) ?? this.spiOffence.Plea.toString()
    }

    if (this.spiOffence.Finding) {
      result.Verdict =
        (lookupVerdictBySpiCode(this.spiOffence.Finding)?.cjsCode as CjsVerdict) ?? this.spiOffence.Finding
    }

    if (this.spiOffence.ModeOfTrial !== undefined) {
      const modeOfTrial = Number(this.spiOffence.ModeOfTrial).toString()
      result.ModeOfTrialReason = lookupModeOfTrialReasonBySpiCode(modeOfTrial)?.cjsCode ?? modeOfTrial
    }

    if (spiResult.ResultText?.length > 0) {
      result.ResultVariableText = spiResult.ResultText
    }

    if (warrantIssueDateResultCodes.includes(spiResultCodeNumber)) {
      result.WarrantIssueDate = new Date(spiDateOfHearing)
    }

    const offencesTicMatch = spiResult.ResultText.match(offencesTicRegex)
    if (offencesTicMatch) {
      result.NumberOfOffencesTIC = Number(offencesTicMatch[1])
    }

    if (
      spiResultCodeQualifier.length === libraMaxQualifiers &&
      !spiResultCodeQualifier.some((resultCodeQualifier) => /BA/i.test(resultCodeQualifier)) &&
      spiResult.ResultText.toLowerCase().includes(libraElectronicTaggingText.toLowerCase())
    ) {
      if (taggingFixRemove.includes(spiResultCodeNumber)) {
        this.baResultCodeQualifierHasBeenExcluded = true
      } else {
        this.bailQualifiers.add(bailQualifierCode)
      }
    }

    result.ResultQualifierVariable = []
    spiResultCodeQualifier.forEach((resultCodeQualifier) => {
      if (/BA/i.test(resultCodeQualifier) && taggingFixRemove.includes(spiResultCodeNumber)) {
        this.baResultCodeQualifierHasBeenExcluded = true
      } else {
        if (resultCodeQualifier === bailQualifierCode) {
          this.bailQualifiers.add(bailQualifierCode)
        }

        result.ResultQualifierVariable?.push({ Code: resultCodeQualifier })
      }
    })

    if (!result.NextResultSourceOrganisation || !result.NextHearingDate) {
      const remandDetails = getRemandDetailsFromResultText(result)
      if (remandDetails.location && !result.NextResultSourceOrganisation) {
        result.NextResultSourceOrganisation = remandDetails.location
      }
      if (!result.NextHearingDate && remandDetails.date) {
        result.NextHearingDate = remandDetails.date
      }
    }

    return result
  }

  addBailResultQualifierVariable(results: Result[]): void {
    if (this.baResultCodeQualifierHasBeenExcluded) {
      results.forEach((result) => {
        if (
          result.CJSresultCode === taggingFixAdd &&
          !result.ResultQualifierVariable.some((r) => r.Code === bailQualifierCode)
        ) {
          result.ResultQualifierVariable.push({ Code: bailQualifierCode })
          this.baQualifierAdded = true
        }
      })
    }
  }

  execute(): OffenceResultsResult {
    const { Result: spiResults } = this.spiOffence

    const results = spiResults.map((spiResult) => this.populateResult(spiResult))
    this.addBailResultQualifierVariable(results)

    if (this.baResultCodeQualifierHasBeenExcluded && this.baQualifierAdded) {
      this.bailQualifiers.add(bailQualifierCode)
    }

    return { results, bailQualifiers: Array.from(this.bailQualifiers) }
  }
}
