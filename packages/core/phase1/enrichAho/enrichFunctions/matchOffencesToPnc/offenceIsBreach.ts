import type { Offence } from "core/common/types/AnnotatedHearingOutcome"
import getOffenceCode from "../../../lib/offence/getOffenceCode"

// These are empty in Bichard, but the logic is still valid
// (We might want to add offence codes here in the future)
const breachOffenceCodes: string[] = []
const nonBreachOffenceCodes: string[] = []

const breachOffenceCategories = ["CB"]

const offenceCodeIsBreach = (offenceCode: string): boolean => {
  return breachOffenceCodes.includes(offenceCode)
}

const offenceCodeIsNonBreach = (offenceCode: string): boolean => {
  return nonBreachOffenceCodes.includes(offenceCode)
}

const offenceCategoryIsBreach = (offenceCategory: string): boolean => {
  return breachOffenceCategories.includes(offenceCategory)
}

const offenceIsBreach = (offence: Offence): boolean => {
  const offenceCode = getOffenceCode(offence)
  if (!offenceCode) {
    throw new Error("Offence code shouldn't be undefined here!")
  }

  return (
    offenceCodeIsBreach(offenceCode) ||
    (!!offence.OffenceCategory &&
      offenceCategoryIsBreach(offence.OffenceCategory) &&
      !offenceCodeIsNonBreach(offenceCode))
  )
}

export default offenceIsBreach
