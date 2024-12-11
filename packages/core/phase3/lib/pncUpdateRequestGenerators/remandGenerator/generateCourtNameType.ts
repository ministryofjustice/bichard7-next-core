import { PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR } from "../../getPncCourtCode"

const FAILED_TO_APPEAR_TEXT_FIRST_INSTANCE = "*****1ST INSTANCE WARRANT ISSUED*****"
const FAILED_TO_APPEAR_TEXT = "*****FAILED TO APPEAR*****"
const FAILED_TO_APPEAR_DATED_TEXT_FIRST_INSTANCE = "*****1ST INSTANCE DATED WARRANT ISSUED*****"
const FAILED_TO_APPEAR_DATED_TEXT = "***** FTA DATED WARRANT *****"

export const generateCourtNameType = (
  courtCode: string,
  courtType: string,
  courtHouseName: string,
  remandLocationCourt: string
): [string, string] => {
  const hasFailedToAppearText = [FAILED_TO_APPEAR_TEXT, FAILED_TO_APPEAR_TEXT_FIRST_INSTANCE].includes(courtHouseName)
  const hasFailedToAppearDatedText = [FAILED_TO_APPEAR_DATED_TEXT, FAILED_TO_APPEAR_DATED_TEXT_FIRST_INSTANCE].includes(
    courtHouseName
  )

  let courtNameType1 = ""
  let courtNameType2 = ""

  if (courtCode === PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR) {
    if (!hasFailedToAppearText) {
      courtNameType1 = courtNameType2 = `${courtHouseName} ${courtType}`
    } else {
      courtNameType2 = courtHouseName
    }
  }

  if (remandLocationCourt === PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR) {
    if (!hasFailedToAppearDatedText) {
      courtNameType1 ||= `${courtHouseName} ${courtType}`
      courtNameType2 ||= `${courtHouseName} ${courtType}`
    } else {
      courtNameType1 = courtHouseName
    }
  }

  return [courtNameType1, courtNameType2] as const
}

export default generateCourtNameType
