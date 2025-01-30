import type { OrganisationUnitCodes } from "../../types/AnnotatedHearingOutcome"

import lookupOrganisationUnitByCode from "../../lib/dataLookup/lookupOrganisationUnitByCode"

export const PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR = "9998"
const CJS_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR = "B0000"
const ADULT_YOUTH_COURT_CODE_DIVIDER = 4000

const convertToYouthCourtIfRequired = (
  thirdLevelPsaCode: string,
  courtHouseCode: number,
  topLevelCode?: string
): string => {
  if (!topLevelCode || topLevelCode !== "B") {
    return thirdLevelPsaCode
  }

  const thirdLevelPsaCodeNumber = parseInt(thirdLevelPsaCode, 10)

  return courtHouseCode > ADULT_YOUTH_COURT_CODE_DIVIDER && thirdLevelPsaCodeNumber < ADULT_YOUTH_COURT_CODE_DIVIDER
    ? String(thirdLevelPsaCodeNumber + ADULT_YOUTH_COURT_CODE_DIVIDER)
    : thirdLevelPsaCode
}

const getPncCourtCode = (
  organisationUnitCode: null | OrganisationUnitCodes | undefined,
  courtHouseCode: number
): string => {
  if (!organisationUnitCode) {
    return ""
  }

  const organisationUnitCodeWithoutBottomLevelCode = `${organisationUnitCode.TopLevelCode}${organisationUnitCode.SecondLevelCode}${organisationUnitCode.ThirdLevelCode}`
  if (
    [organisationUnitCode.OrganisationUnitCode, organisationUnitCodeWithoutBottomLevelCode].includes(
      CJS_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR
    )
  ) {
    return PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR
  }

  const pncCourtCode = lookupOrganisationUnitByCode(organisationUnitCode)?.thirdLevelPsaCode
  if (!pncCourtCode) {
    return ""
  }

  return convertToYouthCourtIfRequired(pncCourtCode, courtHouseCode, organisationUnitCode.TopLevelCode)
}

export default getPncCourtCode
