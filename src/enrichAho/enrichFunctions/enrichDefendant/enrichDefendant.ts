import type { HearingDefendant } from "../../../types/AnnotatedHearingOutcome"
import type { EnrichAhoFunction } from "../../../types/EnrichAhoFunction"
import type { KeyValue } from "../../../types/KeyValue"
import convertAsnToLongFormat from "./convertAsnToLongFormat"

const GENERATED_PNC_FILENAME_MAX_LENGTH = 54

const deduplicate = (input: string[]): string[] =>
  Object.values(
    input.reduce((acc: KeyValue<string>, val) => {
      const key = val.trim().toLowerCase().replace(/\s+/g, " ")
      if (!(key in acc)) {
        acc[key] = val
      }
      return acc
    }, {})
  )

const deduplicateBailConditions = (conditions: string[]): string[] =>
  deduplicate(conditions.filter((c) => c.length > 0))

const createGeneratedPncName = (defendant: HearingDefendant): string => {
  const personName = defendant.DefendantDetail.PersonName
  const pncFilename = [personName.FamilyName, personName.GivenName.join(" ")].join("/").toUpperCase()
  if (pncFilename.length > GENERATED_PNC_FILENAME_MAX_LENGTH) {
    return pncFilename.substring(0, GENERATED_PNC_FILENAME_MAX_LENGTH - 1) + "+"
  }
  return pncFilename
}

const enrichDefendant: EnrichAhoFunction = (hearingOutCome) => {
  const defendant = hearingOutCome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant

  defendant.ArrestSummonsNumber = convertAsnToLongFormat(defendant.ArrestSummonsNumber)

  defendant.BailConditions = deduplicateBailConditions(defendant.BailConditions)

  if (defendant.DefendantDetail.PersonName.FamilyName) {
    defendant.DefendantDetail.GeneratedPNCFilename = createGeneratedPncName(defendant)
  }

  return hearingOutCome
}

export default enrichDefendant
