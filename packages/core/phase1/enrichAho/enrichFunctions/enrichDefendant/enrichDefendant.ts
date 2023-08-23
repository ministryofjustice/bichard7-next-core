import type { HearingDefendant } from "types/AnnotatedHearingOutcome"
import type { EnrichAhoFunction } from "phase1/types/EnrichAhoFunction"
import convertAsnToLongFormat from "phase1/enrichAho/enrichFunctions/enrichDefendant/convertAsnToLongFormat"

const GENERATED_PNC_FILENAME_MAX_LENGTH = 54

const deduplicate = (input: string[]): string[] =>
  input
    .reduce((acc: { key: string; val: string }[], val) => {
      const key = val.trim().toLowerCase().replace(/\s+/g, " ")
      if (!acc.find((x) => x.key === key)) {
        acc.push({ key, val })
      }
      return acc
    }, [])
    .map((x) => x.val)

const deduplicateBailConditions = (conditions: string[]): string[] =>
  deduplicate(conditions.filter((c) => c.length > 0))

const createGeneratedPncName = (defendant: HearingDefendant): string => {
  const personName = defendant.DefendantDetail!.PersonName
  const fileNameParts = [personName.FamilyName]
  if (personName.GivenName && personName.GivenName.length > 0) {
    fileNameParts.push(...personName.GivenName)
  }

  const pncFilename = fileNameParts.join("/").toUpperCase()
  if (pncFilename.length > GENERATED_PNC_FILENAME_MAX_LENGTH) {
    return pncFilename.substring(0, GENERATED_PNC_FILENAME_MAX_LENGTH - 1) + "+"
  }
  return pncFilename
}

const enrichDefendant: EnrichAhoFunction = (hearingOutCome) => {
  const defendant = hearingOutCome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant

  defendant.ArrestSummonsNumber = convertAsnToLongFormat(defendant.ArrestSummonsNumber)

  defendant.BailConditions = deduplicateBailConditions(defendant.BailConditions)

  if (defendant.DefendantDetail?.PersonName.FamilyName) {
    defendant.DefendantDetail.GeneratedPNCFilename = createGeneratedPncName(defendant)
  }

  return hearingOutCome
}

export default enrichDefendant
