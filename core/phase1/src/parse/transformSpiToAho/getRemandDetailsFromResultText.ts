import { lookupOrganisationUnitByThirdLevelPsaCode } from "../../dataLookup"
import extractCodesFromOU from "../../dataLookup/extractCodesFromOU"
import lookupCrownCourtByNameAndFirstPsaCode from "../../dataLookup/lookupCrownCourtByNameAndFirstPsaCode"
import type { OrganisationUnitCodes, Result } from "../../types/AnnotatedHearingOutcome"

export interface RemandDetails {
  location?: OrganisationUnitCodes
  date?: Date
}

interface ExtractedResultTextDate {
  courtName?: string
  date?: string
}

const resultTextPatternCodes: Record<string, string[]> = {
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
  "4054": ["1"],
  "4057": ["4"],
  "4058": ["3a"],
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

const resultTextPatternRegex: Record<string, RegExp> = {
  "1": /[Cc]ommitted to (?<Court>.*? (?:Crown|Criminal) Court)(?:.*on (?<Date>.*) or such other date)?/,
  "2ab": /to appear (?:at|before) (?<Court>.*? (?:Crown|Criminal) Court)(?:.*on (?<Date>.*) or such other date)?/,
  "4": /Act \d{4} to (?<Court>.*? (?:Crown|Criminal) Court)(?:.*on (?<Date>.*) or such other date)?/,
  "3a": /[tT]o be brought before (?<Court>.*? (?:Crown|Criminal) Court)(?:.*on (?<Date>.*) or such other date)?/,
  "2c3b":
    /until the Crown Court hearing (?:(?:.*on (?<Date>.*) or such other date.*as the Crown Court directs,? (?<Court>.*? (?:Crown|Criminal) Court))|(?:.*time to be fixed,? (?<Court2>.*? (?:Crown|Criminal) Court)))/
}

const grimsby = lookupOrganisationUnitByThirdLevelPsaCode("0425")
const newport = lookupOrganisationUnitByThirdLevelPsaCode("0441")

const crownCourtNameMappingOverrides: Record<string, OrganisationUnitCodes | undefined> = {
  "Newport (South Wales) Crown Court": newport ? extractCodesFromOU(newport) : undefined,
  "Great Grimsby Crown Court": grimsby ? extractCodesFromOU(grimsby) : undefined
}

const extractResultTextData = (patterns: string[], resultText: string): ExtractedResultTextDate => {
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

      if (courtName) {
        return { courtName, date }
      }
    }
  }

  return {}
}

const parseDate = (extractedDate: string): Date | undefined => {
  const dateString = extractedDate.match(/(\d{2})\/(\d{2})\/(\d{4})/)

  if (dateString) {
    return new Date(`${dateString[3]}-${dateString[2]}-${dateString[1]}`)
  }
}

const getRemandDetailsFromResultText = (result: Result): RemandDetails => {
  let location: OrganisationUnitCodes | undefined
  let date: Date | undefined
  if (result.CJSresultCode) {
    const patterns = resultTextPatternCodes[result.CJSresultCode] ?? []
    if (result.ResultVariableText) {
      const { courtName, date: extractedDate } = extractResultTextData(patterns, result.ResultVariableText)
      if (courtName) {
        location = crownCourtNameMappingOverrides[courtName] ?? lookupCrownCourtByNameAndFirstPsaCode(courtName)
      }
      if (extractedDate) {
        date = parseDate(extractedDate)
      }
    }
  }

  return { location, date }
}

export default getRemandDetailsFromResultText
