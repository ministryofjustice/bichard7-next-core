import type { Result } from "src/types/AnnotatedHearingOutcome"
import type { ResultedCaseMessageParsedXml, SpiOffence, SpiResult } from "src/types/IncomingMessage"
import type { KeyValue } from "src/types/KeyValue"
import {
  lookupModeOfTrialReasonBySpiCode,
  lookupPleaStatusBySpiCode,
  lookupPSACodeByCrownCourtName,
  lookupRemandStatusBySpiCode,
  lookupVerdictBySpiCode
} from "./dataLookup"
import getOrganisationUnit from "./getOrganisationUnit"

const FREE_TEXT_RESULT_CODE = 1000
const OTHER_VALUE = "OTHER"
const WARRANT_ISSUE_DATE_RESULT_CODES = [4505, 4575, 4576, 4577, 4585, 4586]
// offencesTICResultText in "bichard-backend/src/main/resources/inputFormatTranslator.properties"
const OFFENCES_TIC_RESULT_TEXT = "other offences admitted and taken into consideration"
const OFFENCES_TIC_RESULT_CODE = -1
const LIBRA_MAX_QUALIFIERS = 4
const LIBRA_ELECTRONIC_TAGGING_TEXT = "to be electronically monitored"
const TAGGING_FIX_REMOVE = [1115, 1116, 1141, 1142, 1143]
const BAIL_QUALIFIER_CODE = "BA"
const RESULT_TEXT_PATTERN_CODES: KeyValue<string[]> = {
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
const CROWN_COURT_NAME_MAPPING_OVERRIDES: KeyValue<string> = {
  "Newport (South Wales) Crown Court": "0441",
  "Great Grimsby Crown Court": "0425"
}
const TAGGING_FIX_ADD = "3105"

const RESULT_TEXT_PATTERN_REGEX: KeyValue<RegExp> = {
  "1": /[Cc]ommitted to (?<Court>.*? (?:Crown|Criminal) Court)(?:.*on (?<Date>.*) or such other date)?/,
  "2ab": /to appear (?:at|before) (?<Court>.*? (?:Crown|Criminal) Court)(?:.*on (?<Date>.*) or such other date)?/,
  "4": /Act \\d{4} to (?<Court>.*? (?:Crown|Criminal) Court)(?:.*on (?<Date>.*) or such other date)?/,
  "3a": /[tT]o be brought before (?<Court>.*? (?:Crown|Criminal) Court)(?:.*on (?<Date>.*) or such other date)?/,
  "2c3b":
    /until the Crown Court hearing (?:(?:.*on (?<Date>.*) or such other date.*as the Crown Court directs,? (?<Court>.*? (?:Crown|Criminal) Court))|(?:.*time to be fixed,? (?<Court2>.*? (?:Crown|Criminal) Court)))/
}

interface RemandDetails {
  location?: string
  date?: string
}

interface ExtractedResultTextDate {
  courtName?: string
  date?: string
}

export interface OffenceResultsResult {
  results: Result[]
  bailQualifiers: string[]
}

export default class {
  baResultCodeQualifierHasBeenExcluded = false

  bailQualifiers = new Set<string>()

  results: Result[] = []

  constructor(private courtResult: ResultedCaseMessageParsedXml, private spiOffence: SpiOffence) {}

  private extractResultTextData(patterns: string[], resultText: string): ExtractedResultTextDate {
    if (patterns.length === 0) {
      return {}
    }

    let courtName: string | undefined
    let date: string | undefined

    patterns.forEach((pattern) => {
      const patternRegex = RESULT_TEXT_PATTERN_REGEX[pattern]
      const matcheGroups = resultText.match(patternRegex)?.groups

      if (matcheGroups) {
        const { Court, Court2, Date } = matcheGroups

        courtName = courtName ?? Court ?? Court2
        date = date ?? Date

        if (courtName && date) {
          return { courtName, date }
        }
      }
    })

    return {}
  }

  private getRemandDetailsFromResultText(result: Result): RemandDetails {
    let psaCode: string | undefined
    let date: string | undefined
    if (result.CJSresultCode) {
      const patterns = RESULT_TEXT_PATTERN_CODES[result.CJSresultCode] ?? []
      if (result.ResultVariableText) {
        const { courtName, date: extractedDate } = this.extractResultTextData(patterns, result.ResultVariableText)
        if (courtName) {
          psaCode = CROWN_COURT_NAME_MAPPING_OVERRIDES[courtName] ?? lookupPSACodeByCrownCourtName(courtName)
        }
        date = extractedDate
      }
    }

    return { location: psaCode, date }
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
      ResultCodeQualifier: spiResultCodeQualifier
    } = spiResult
    const result = {} as Result
    const spiResultCodeNumber = spiResultCode ? FREE_TEXT_RESULT_CODE : spiResultCode
    result.CJSresultCode = String(spiResultCodeNumber)

    if (spiNextHearing?.BailStatusOffence) {
      const remandStatus = lookupRemandStatusBySpiCode(spiNextHearing.BailStatusOffence)
      result.OffenceRemandStatus = remandStatus.isPresent ? remandStatus.CjsCode : spiNextHearing.BailStatusOffence
    }

    result.SourceOrganisation = getOrganisationUnit(this.courtResult.Session.CourtHearing.Hearing.CourtHearingLocation)

    result.ConvictingCourt = spiConvictingCourt
    result.ResultHearingType = OTHER_VALUE
    result.ResultHearingDate = spiConvictionDate ?? spiDateOfHearing

    if (spiCourtIndividualDefendant?.ReasonForBailConditionsOrCustody) {
      result.ReasonForOffenceBailConditions = spiCourtIndividualDefendant.ReasonForBailConditionsOrCustody
    }

    if (this.spiOffence.Plea) {
      const pleaStatus = lookupPleaStatusBySpiCode(this.spiOffence.Plea)
      result.PleaStatus = pleaStatus.isPresent ? pleaStatus.CjsCode : this.spiOffence.Plea.toString()
    }

    if (this.spiOffence.Finding) {
      const verdict = lookupVerdictBySpiCode(this.spiOffence.Finding)
      result.PleaStatus = verdict.isPresent ? verdict.cjsCode : this.spiOffence.Finding
    }

    if (this.spiOffence.ModeOfTrial) {
      const modeOfTrialReason = lookupModeOfTrialReasonBySpiCode(this.spiOffence.ModeOfTrial.toString())
      result.ModeOfTrialReason = modeOfTrialReason.isPresent
        ? modeOfTrialReason.cjsCode
        : this.spiOffence.ModeOfTrial.toString()
    }

    if (spiResult.ResultText?.length > 0) {
      result.ResultVariableText = spiResult.ResultText
    }

    if (WARRANT_ISSUE_DATE_RESULT_CODES.includes(spiResultCodeNumber)) {
      result.WarrantIssueDate = spiDateOfHearing
    }

    if (
      new RegExp(OFFENCES_TIC_RESULT_TEXT, "i").test(spiResult.ResultText) ||
      spiResultCodeNumber === OFFENCES_TIC_RESULT_CODE
    ) {
      result.NumberOfOffencesTIC = parseInt(spiResult.ResultText.trim().split(" ")[0], 10).toString()
    }

    if (
      spiResultCodeQualifier.length === LIBRA_MAX_QUALIFIERS &&
      !spiResultCodeQualifier.some((resultCodeQualifier) => /BA/i.test(resultCodeQualifier)) &&
      new RegExp(LIBRA_ELECTRONIC_TAGGING_TEXT, "i").test(spiResult.ResultText)
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

        result.ResultQualifierVariable.push({ Code: resultCodeQualifier })
      }
    })

    if (!result.NextResultSourceOrganisation || !result.NextHearingDate) {
      const remandDetails = this.getRemandDetailsFromResultText(result)
      if (remandDetails.location && !result.NextResultSourceOrganisation) {
        result.NextResultSourceOrganisation = getOrganisationUnit(remandDetails.location)
      }
      result.NextHearingDate = result.NextHearingDate ?? remandDetails.date
    }

    return result
  }

  private reapplyBaResultQualifier(): boolean {
    let qualifierReadded = false
    for (let i = 0; i < this.results.length; i++) {
      const result = this.results[i]
      if (
        result.CJSresultCode === TAGGING_FIX_ADD &&
        !result.ResultQualifierVariable.some((r) => r.Code === BAIL_QUALIFIER_CODE)
      ) {
        this.results[i].ResultQualifierVariable.push({ Code: BAIL_QUALIFIER_CODE })
        qualifierReadded = true
      }
    }

    return qualifierReadded
  }

  execute(): OffenceResultsResult {
    const { Result: spiResults } = this.spiOffence

    this.results = spiResults.map((spiResult) => this.populateResult(spiResult))

    if (this.baResultCodeQualifierHasBeenExcluded && this.reapplyBaResultQualifier()) {
      this.bailQualifiers.add(BAIL_QUALIFIER_CODE)
    }

    return { results: this.results, bailQualifiers: Array.from(this.bailQualifiers) }
  }
}
