import type { HearingDefendant } from "../../../../types/AnnotatedHearingOutcome"

import { GENERATED_PNC_FILENAME_MAX_LENGTH } from "../../../../phase1/enrichAho/enrichFunctions/enrichDefendant/enrichDefendant"

const ILLEGAL_FILENAME_PATTERN = new RegExp("[^a-zA-Z0-9\\- /]", "g")

const deriveGeneratedPncFilename = (defendant: HearingDefendant) => {
  if (defendant.DefendantDetail != null) {
    const generatedPNCFilename = defendant.DefendantDetail?.GeneratedPNCFilename ?? ""
    return generatedPNCFilename.includes("/") ? generatedPNCFilename : `${generatedPNCFilename}/`
  }

  let generatedPNCFilename = defendant.OrganisationName?.replace(ILLEGAL_FILENAME_PATTERN, " ")
    .replace(/\s+/g, " ")
    .trim()

  if (!generatedPNCFilename) {
    return ""
  }

  if (generatedPNCFilename.length > GENERATED_PNC_FILENAME_MAX_LENGTH) {
    generatedPNCFilename = generatedPNCFilename.substring(0, GENERATED_PNC_FILENAME_MAX_LENGTH - 1) + "+"
  }

  if (!generatedPNCFilename.includes("/")) {
    if (generatedPNCFilename.length == GENERATED_PNC_FILENAME_MAX_LENGTH) {
      generatedPNCFilename = generatedPNCFilename.substring(0, GENERATED_PNC_FILENAME_MAX_LENGTH - 2) + "/+"
    } else {
      generatedPNCFilename = generatedPNCFilename + "/"
    }
  }

  return generatedPNCFilename
}

export default deriveGeneratedPncFilename
