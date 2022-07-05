import {
  lookupModeOfTrialReasonBySpiCode,
  lookupOrganisationUnitByThirdLevelPsaCode,
  lookupPleaStatusBySpiCode,
  lookupRemandStatusBySpiCode,
  lookupVerdictBySpiCode
} from "src/dataLookup"
import lookupCrownCourtByName from "src/dataLookup/lookupCrownCourtByName"
import getOrganisationUnit from "src/lib/organisationUnit/getOrganisationUnit"
import {
  BAIL_QUALIFIER_CODE,
  CROWN_COURT_NAME_MAPPING_OVERRIDES,
  DURATION_TYPES,
  DURATION_UNITS,
  FREE_TEXT_RESULT_CODE,
  LIBRA_ELECTRONIC_TAGGING_TEXT,
  LIBRA_MAX_QUALIFIERS,
  OFFENCES_TIC_RESULT_CODE,
  OFFENCES_TIC_RESULT_TEXT,
  OTHER_VALUE,
  RESULT_CURFEW1,
  RESULT_CURFEW2,
  RESULT_PENALTY_POINTS,
  RESULT_TEXT_PATTERN_CODES,
  RESULT_TEXT_PATTERN_REGEX,
  TAGGING_FIX_ADD,
  TAGGING_FIX_REMOVE,
  WARRANT_ISSUE_DATE_RESULT_CODES
} from "src/lib/properties"
import type { Duration, OrganisationUnitCodes, Result } from "src/types/AnnotatedHearingOutcome"
import type { CjsPlea } from "src/types/Plea"
import type { ResultedCaseMessageParsedXml, SpiOffence, SpiResult } from "src/types/SpiResult"
import type { CjsVerdict } from "src/types/Verdict"
import lookupAmountTypeByCjsCode from "./lookupAmountTypeByCjsCode"

interface RemandDetails {
  location?: OrganisationUnitCodes
  date?: Date
}

interface ExtractedResultTextDate {
  courtName?: string
  date?: string
}

export interface OffenceResultsResult {
  results: Result[]
  bailQualifiers: string[]
}

const createDuration = (durationUnit: string, durationValue: number): Duration => ({
  DurationType: DURATION_TYPES.DURATION,
  DurationUnit: !durationUnit || durationUnit === "." ? DURATION_UNITS.SESSIONS : durationUnit,
  DurationLength: durationValue
})

export default class {
  private baResultCodeQualifierHasBeenExcluded = false

  private bailQualifiers = new Set<string>()

  private baQualifierAdded = false

  constructor(private courtResult: ResultedCaseMessageParsedXml, private spiOffence: SpiOffence) {}

  private extractResultTextData(patterns: string[], resultText: string): ExtractedResultTextDate {
    if (patterns.length === 0) {
      return {}
    }

    let courtName: string | undefined
    let date: string | undefined

    for (const pattern of patterns) {
      const patternRegex = RESULT_TEXT_PATTERN_REGEX[pattern]
      const matchedGroups = resultText.match(patternRegex)?.groups

      if (matchedGroups) {
        const { Court, Court2, Date } = matchedGroups

        courtName = courtName ?? Court ?? Court2
        date = date ?? Date

        if (courtName && date) {
          return { courtName, date }
        }
      }
    }

    return {}
  }

  private parseDate(extractedDate: string): Date | undefined {
    const dateString = extractedDate.match(/(\d{2})\/(\d{2})\/(\d{4})/)

    if (dateString) {
      return new Date(parseInt(dateString[3], 10), parseInt(dateString[2], 10) - 1, parseInt(dateString[1], 10))
    }
  }

  private getRemandDetailsFromResultText(result: Result): RemandDetails {
    let location: OrganisationUnitCodes | undefined
    let date: Date | undefined
    if (result.CJSresultCode) {
      const patterns = RESULT_TEXT_PATTERN_CODES[result.CJSresultCode] ?? []
      if (result.ResultVariableText) {
        const { courtName, date: extractedDate } = this.extractResultTextData(patterns, result.ResultVariableText)
        if (courtName) {
          location = CROWN_COURT_NAME_MAPPING_OVERRIDES[courtName] ?? lookupCrownCourtByName(courtName)
        }
        if (extractedDate) {
          date = this.parseDate(extractedDate)
        }
      }
    }

    return { location, date }
  }

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
    const spiResultCodeNumber = spiResultCode ?? FREE_TEXT_RESULT_CODE
    result.CJSresultCode = spiResultCodeNumber

    if (spiNextHearing?.BailStatusOffence) {
      result.OffenceRemandStatus =
        lookupRemandStatusBySpiCode(spiNextHearing.BailStatusOffence)?.cjsCode ?? spiNextHearing.BailStatusOffence
    }

    result.SourceOrganisation = getOrganisationUnit(this.courtResult.Session.CourtHearing.Hearing.CourtHearingLocation)

    result.ConvictingCourt = spiConvictingCourt
    result.ResultHearingType = OTHER_VALUE
    result.ResultHearingDate = new Date(spiConvictionDate ?? spiDateOfHearing)

    if (typeof spiCourtIndividualDefendant?.ReasonForBailConditionsOrCustody === "string") {
      result.ReasonForOffenceBailConditions = spiCourtIndividualDefendant.ReasonForBailConditionsOrCustody
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
          result.Duration.push(createDuration(spiDurationUnit, spiDurationValue))
        }

        if (spiSecondaryDurationUnit && spiSecondaryDurationValue !== undefined) {
          result.Duration.push(createDuration(spiSecondaryDurationUnit, spiSecondaryDurationValue))
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
        result.AmountSpecifiedInResult.push({ Amount: spiResultAmountSterling, Type: amountType })
      }

      if (spiResultCode) {
        result.NumberSpecifiedInResult = result.NumberSpecifiedInResult ?? []
        if (spiResultCode === RESULT_PENALTY_POINTS && spiPenaltyPoints) {
          result.NumberSpecifiedInResult.push({ Number: spiPenaltyPoints, Type: "P" })
        } else if (
          (spiResultCode === RESULT_CURFEW1 || spiResultCode === RESULT_CURFEW2) &&
          spiDuration?.SecondaryDurationUnit === DURATION_UNITS.HOURS &&
          spiDuration?.SecondaryDurationValue
        ) {
          result.NumberSpecifiedInResult.push({ Number: spiDuration.SecondaryDurationValue, Type: "P" })
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
      result.ModeOfTrialReason =
        lookupModeOfTrialReasonBySpiCode(this.spiOffence.ModeOfTrial.toString())?.cjsCode ??
        this.spiOffence.ModeOfTrial.toString()
    }

    if (spiResult.ResultText?.length > 0) {
      result.ResultVariableText = spiResult.ResultText
    }

    if (WARRANT_ISSUE_DATE_RESULT_CODES.includes(spiResultCodeNumber)) {
      result.WarrantIssueDate = new Date(spiDateOfHearing)
    }

    const containsNumberOfOffencesTIC = (resultText: string): boolean =>
      resultText.toLowerCase().includes(OFFENCES_TIC_RESULT_TEXT)

    if (containsNumberOfOffencesTIC(spiResult.ResultText) || spiResultCodeNumber === OFFENCES_TIC_RESULT_CODE) {
      result.NumberOfOffencesTIC = parseInt(spiResult.ResultText.trim().split(" ")[0], 10)
    }

    if (
      spiResultCodeQualifier.length === LIBRA_MAX_QUALIFIERS &&
      !spiResultCodeQualifier.some((resultCodeQualifier) => /BA/i.test(resultCodeQualifier)) &&
      spiResult.ResultText.toLowerCase().includes(LIBRA_ELECTRONIC_TAGGING_TEXT.toLowerCase())
    ) {
      if (TAGGING_FIX_REMOVE.includes(spiResultCodeNumber)) {
        this.baResultCodeQualifierHasBeenExcluded = true
      } else {
        this.bailQualifiers.add(BAIL_QUALIFIER_CODE)
      }
    }

    result.ResultQualifierVariable = []
    spiResultCodeQualifier.forEach((resultCodeQualifier) => {
      if (/BA/i.test(resultCodeQualifier) && TAGGING_FIX_REMOVE.includes(spiResultCodeNumber)) {
        this.baResultCodeQualifierHasBeenExcluded = true
      } else {
        if (resultCodeQualifier === BAIL_QUALIFIER_CODE) {
          this.bailQualifiers.add(BAIL_QUALIFIER_CODE)
        }

        result.ResultQualifierVariable?.push({ Code: resultCodeQualifier })
      }
    })

    if (!result.NextResultSourceOrganisation || !result.NextHearingDate) {
      const remandDetails = this.getRemandDetailsFromResultText(result)
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
          result.CJSresultCode === TAGGING_FIX_ADD &&
          !result.ResultQualifierVariable.some((r) => r.Code === BAIL_QUALIFIER_CODE)
        ) {
          result.ResultQualifierVariable.push({ Code: BAIL_QUALIFIER_CODE })
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
      this.bailQualifiers.add(BAIL_QUALIFIER_CODE)
    }

    return { results, bailQualifiers: Array.from(this.bailQualifiers) }
  }
}
