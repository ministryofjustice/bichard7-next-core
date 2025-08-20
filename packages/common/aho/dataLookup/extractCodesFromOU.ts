import type { OrganisationUnit } from "@moj-bichard7-developers/bichard7-next-data/types/types"

import type { OrganisationUnitCodes } from "../../types/AnnotatedHearingOutcome"

const extractCodesFromOU = (ou: OrganisationUnit): OrganisationUnitCodes => ({
  BottomLevelCode: ou.bottomLevelCode,
  OrganisationUnitCode: `${ou.topLevelCode}${ou.secondLevelCode}${ou.thirdLevelCode}${ou.bottomLevelCode}`,
  SecondLevelCode: ou.secondLevelCode,
  ThirdLevelCode: ou.thirdLevelCode,
  TopLevelCode: ou.topLevelCode
})

export default extractCodesFromOU
