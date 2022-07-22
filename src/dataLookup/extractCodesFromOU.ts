import type { OrganisationUnit } from "bichard7-next-data-latest/types/types"
import type { OrganisationUnitCodes } from "src/types/AnnotatedHearingOutcome"

const extractCodesFromOU = (ou: OrganisationUnit): OrganisationUnitCodes => ({
  TopLevelCode: ou.topLevelCode,
  SecondLevelCode: ou.secondLevelCode,
  ThirdLevelCode: ou.thirdLevelCode,
  BottomLevelCode: ou.bottomLevelCode,
  OrganisationUnitCode: `${ou.topLevelCode}${ou.secondLevelCode}${ou.thirdLevelCode}${ou.bottomLevelCode}`
})

export default extractCodesFromOU
