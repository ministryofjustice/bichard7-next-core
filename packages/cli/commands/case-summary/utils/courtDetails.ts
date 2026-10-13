import { lookupOrganisationUnitByThirdLevelPsaCode } from "@moj-bichard7/common/aho/dataLookup/dataLookup"
import lookupOrganisationUnitByCode from "@moj-bichard7/common/aho/dataLookup/lookupOrganisationUnitByCode"

export const getCourtDetailsByLjaCode = (ljaCode?: string | number): string => {
  if (!ljaCode) {
    return "No code"
  }

  let title = ""
  const organisationUnit = lookupOrganisationUnitByThirdLevelPsaCode(ljaCode)
  if (organisationUnit) {
    const { topLevelName, secondLevelName, thirdLevelName, bottomLevelName } = organisationUnit
    title = [topLevelName, secondLevelName, thirdLevelName, bottomLevelName].filter(Boolean).join(" ")
  }

  return title ? `${ljaCode} (${title})` : String(ljaCode)
}

export const getCourtDetailsByOrganisationUnit = (orgUnit?: string): string => {
  if (!orgUnit) {
    return "No organisation unit provided"
  }

  let title = ""
  const topLevelCode = orgUnit[0]
  const secondLevelCode = orgUnit.slice(1, 3)
  const thirdLevelCode = orgUnit.slice(3, 5)
  const bottomLevelCode = orgUnit.slice(5, 7)
  const organisationUnit = lookupOrganisationUnitByCode({
    TopLevelCode: topLevelCode,
    SecondLevelCode: secondLevelCode,
    ThirdLevelCode: thirdLevelCode,
    BottomLevelCode: bottomLevelCode,
    OrganisationUnitCode: ""
  })

  if (organisationUnit) {
    const { topLevelName, secondLevelName, thirdLevelName, bottomLevelName } = organisationUnit
    title = [topLevelName, secondLevelName, thirdLevelName, bottomLevelName].filter(Boolean).join(" ")
  }

  return title ? `${orgUnit} (${title})` : orgUnit
}
