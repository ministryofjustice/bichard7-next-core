import type { OrganisationUnit } from "@moj-bichard7-developers/bichard7-next-data/types/types"
import type { OrganisationUnitCodes } from "src/types/AnnotatedHearingOutcome"

const extractCodesFromOU = (ou: OrganisationUnit): OrganisationUnitCodes => ({
  TopLevelCode: ou.topLevelCode,
  SecondLevelCode: ou.secondLevelCode,
  ThirdLevelCode: ou.thirdLevelCode,
  BottomLevelCode: ou.bottomLevelCode,
  OrganisationUnitCode: `${ou.topLevelCode}${ou.secondLevelCode}${ou.thirdLevelCode}${ou.bottomLevelCode}`
})

export default extractCodesFromOU
