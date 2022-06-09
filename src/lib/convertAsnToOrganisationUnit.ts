import type { OrganisationUnitCodes } from "src/types/AnnotatedHearingOutcome"

const convertAsnToOrganisationUnit = (asn: string): OrganisationUnitCodes => {
  let topLevelCode = ""
  let offset = 1
  if (asn.length == 21) {
    topLevelCode = asn.substring(2, 3).toUpperCase()
    offset = 0
  }

  return {
    ...(topLevelCode ? { TopLevelCode: topLevelCode } : {}),
    SecondLevelCode: asn.substring(3 - offset, 5 - offset).toUpperCase(),
    ThirdLevelCode: asn.substring(5 - offset, 7 - offset).toUpperCase(),
    BottomLevelCode: asn.substring(7 - offset, 9 - offset).toUpperCase()
  } as OrganisationUnitCodes
}

export default convertAsnToOrganisationUnit
