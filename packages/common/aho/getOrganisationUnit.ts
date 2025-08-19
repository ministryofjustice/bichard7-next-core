import type { OrganisationUnitCodes } from "../types/AnnotatedHearingOutcome"

export default (spiOrganisationUnitCode: string): OrganisationUnitCodes => ({
  BottomLevelCode: spiOrganisationUnitCode.substring(5, 7),
  OrganisationUnitCode: spiOrganisationUnitCode,
  SecondLevelCode: spiOrganisationUnitCode.substring(1, 3),
  ThirdLevelCode: spiOrganisationUnitCode.substring(3, 5),
  TopLevelCode: spiOrganisationUnitCode.substring(0, 1)
})
