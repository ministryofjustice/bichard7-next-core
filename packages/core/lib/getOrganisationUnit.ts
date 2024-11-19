import type { OrganisationUnitCodes } from "../types/AnnotatedHearingOutcome"

export default (spiOrganisationUnitCode: string): OrganisationUnitCodes => ({
  TopLevelCode: spiOrganisationUnitCode.substring(0, 1),
  SecondLevelCode: spiOrganisationUnitCode.substring(1, 3),
  ThirdLevelCode: spiOrganisationUnitCode.substring(3, 5),
  BottomLevelCode: spiOrganisationUnitCode.substring(5, 7),
  OrganisationUnitCode: spiOrganisationUnitCode
})
