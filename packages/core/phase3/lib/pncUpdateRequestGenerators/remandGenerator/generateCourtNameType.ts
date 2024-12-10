import { PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR } from "../../getPncCourtCode"

const FAILED_TO_APPEAR_TEXT_FIRST_INSTANCE = "*****1ST INSTANCE WARRANT ISSUED*****"
const FAILED_TO_APPEAR_TEXT = "*****FAILED TO APPEAR*****"
const FAILED_TO_APPEAR_DATED_TEXT_FIRST_INSTANCE = "*****1ST INSTANCE DATED WARRANT ISSUED*****"
const FAILED_TO_APPEAR_DATED_TEXT = "***** FTA DATED WARRANT *****"

export const generateCourtNameType = (
  courtCode: string,
  courtType: string,
  courtHouseName: string,
  remandLocationCourt: string,
  type: 1 | 2
): string => {
  const hasFailedToAppearText = [FAILED_TO_APPEAR_TEXT, FAILED_TO_APPEAR_TEXT_FIRST_INSTANCE].includes(courtHouseName)
  const hasFailedToAppearDatedText = [FAILED_TO_APPEAR_DATED_TEXT, FAILED_TO_APPEAR_DATED_TEXT_FIRST_INSTANCE].includes(
    courtHouseName
  )

  if (courtCode === PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR) {
    if (!hasFailedToAppearText) {
      return `${courtHouseName} ${courtType}`
    }

    if (type === 2 && hasFailedToAppearText) {
      return courtHouseName
    }
  }

  if (remandLocationCourt === PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR) {
    if (!hasFailedToAppearDatedText) {
      return `${courtHouseName} ${courtType}`
    }

    if (type === 1 && hasFailedToAppearDatedText) {
      return courtHouseName
    }
  }

  return ""
}

export default generateCourtNameType
