import {
  lookupModeOfTrialReasonBySpiCode,
  lookupOrganisationUnitByThirdLevelPsaCode,
  lookupPleaStatusBySpiCode,
  lookupRemandStatusBySpiCode,
  lookupVerdictBySpiCode
} from "src/dataLookup"
import extractCodesFromOU from "src/dataLookup/extractCodesFromOU"
import lookupCrownCourtByName from "src/dataLookup/lookupCrownCourtByName"
import getOrganisationUnit from "src/lib/organisationUnit/getOrganisationUnit"
import type { Duration, OrganisationUnitCodes, Result } from "src/types/AnnotatedHearingOutcome"
import type { KeyValue } from "src/types/KeyValue"
import type { CjsPlea } from "src/types/Plea"
import type { ResultedCaseMessageParsedXml, SpiOffence, SpiResult } from "src/types/SpiResult"
import type { CjsVerdict } from "src/types/Verdict"
import lookupAmountTypeByCjsCode from "./lookupAmountTypeByCjsCode"

const freeTextResultCode = 1000
const otherValue = "OTHER"
const warrantIssueDateResultCodes = [4505, 4575, 4576, 4577, 4585, 4586]
const offencesTicResultText = "other offences admitted and taken into consideration"
const offencesTicResultCode = -1
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

const resultTextPatternCodes: KeyValue<string[]> = {
  "4014": ["1"],
  "4015": ["1"],
  "4016": ["1"],
  "4017": ["1"],
  "4020": ["1"],
  "4021": ["1"],
  "4025": ["1"],
  "4027": ["2ab", "2c3b"],
  "4028": ["3a", "2c3b"],
  "4029": ["3a", "2c3b"],
  "4030": ["3a", "2c3b"],
  "4046": ["3a", "2c3b"],
  "4047": ["2ab"],
  "4048": ["1", "4"],
  "4053": ["1"],
  "4570": ["1"],
  "4571": ["1"],
  "4530": ["2ab", "2c3b"],
  "4542": ["2ab"],
  "4531": ["3a", "2c3b"],
  "4533": ["3a", "2c3b"],
  "4537": ["3a", "2c3b"],
  "4539": ["3a", "2c3b"],
  "4558": ["4"],
  "4559": ["4"],
  "4560": ["4"],
  "4561": ["4"],
  "4562": ["4"],
  "4563": ["4"],
  "4564": ["4"],
  "4565": ["1", "4"],
  "4566": ["1"],
  "4567": ["4"]
}

const resultTextPatternRegex: KeyValue<RegExp> = {
  "1": /[Cc]ommitted to (?<Court>.*? (?:Crown|Criminal) Court)(?:.*on (?<Date>.*) or such other date)?/,
  "2ab": /to appear (?:at|before) (?<Court>.*? (?:Crown|Criminal) Court)(?:.*on (?<Date>.*) or such other date)?/,
  "4": /Act \\d{4} to (?<Court>.*? (?:Crown|Criminal) Court)(?:.*on (?<Date>.*) or such other date)?/,
  "3a": /[tT]o be brought before (?<Court>.*? (?:Crown|Criminal) Court)(?:.*on (?<Date>.*) or such other date)?/,
  "2c3b":
    /until the Crown Court hearing (?:(?:.*on (?<Date>.*) or such other date.*as the Crown Court directs,? (?<Court>.*? (?:Crown|Criminal) Court))|(?:.*time to be fixed,? (?<Court2>.*? (?:Crown|Criminal) Court)))/
}

const grimsby = lookupOrganisationUnitByThirdLevelPsaCode("0441")
const newport = lookupOrganisationUnitByThirdLevelPsaCode("0425")

const crownCourtNameMappingOverrides: KeyValue<OrganisationUnitCodes | undefined> = {
  "Newport (South Wales) Crown Court": newport ? extractCodesFromOU(newport) : undefined,
  "Great Grimsby Crown Court": grimsby ? extractCodesFromOU(grimsby) : undefined
}

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
  DurationType: durationTypes.DURATION,
  DurationUnit: !durationUnit || durationUnit === "." ? durationUnits.SESSIONS : durationUnit,
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
      const patternRegex = resultTextPatternRegex[pattern]
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
      const patterns = resultTextPatternCodes[result.CJSresultCode] ?? []
      if (result.ResultVariableText) {
        const { courtName, date: extractedDate } = this.extractResultTextData(patterns, result.ResultVariableText)
        if (courtName) {
          location = crownCourtNameMappingOverrides[courtName] ?? lookupCrownCourtByName(courtName)
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
    const spiResultCodeNumber = spiResultCode ?? freeTextResultCode
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
        if (spiResultCode === resultPenaltyPoints && spiPenaltyPoints) {
          result.NumberSpecifiedInResult.push({ Number: spiPenaltyPoints, Type: "P" })
        } else if (
          (spiResultCode === resultCurfew1 || spiResultCode === resultCurfew2) &&
          spiDuration?.SecondaryDurationUnit === durationUnits.HOURS &&
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

    if (warrantIssueDateResultCodes.includes(spiResultCodeNumber)) {
      result.WarrantIssueDate = new Date(spiDateOfHearing)
    }

    const containsNumberOfOffencesTIC = (resultText: string): boolean =>
      resultText.toLowerCase().includes(offencesTicResultText)

    if (containsNumberOfOffencesTIC(spiResult.ResultText) || spiResultCodeNumber === offencesTicResultCode) {
      result.NumberOfOffencesTIC = parseInt(spiResult.ResultText.trim().split(" ")[0], 10)
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
