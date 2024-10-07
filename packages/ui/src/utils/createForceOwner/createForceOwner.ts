import { OrganisationUnitCodes } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"

export default (orgForPoliceFilter: string): OrganisationUnitCodes | Error => {
  const orgForPoliceFilterCode = orgForPoliceFilter.split(",")[0]

  if (orgForPoliceFilterCode.length < 2) {
    return new Error(`orgForPoliceFilter "${orgForPoliceFilterCode}" too short to extract organisation unit code`)
  }
  const secondLevelCode = orgForPoliceFilterCode.substring(0, 2)
  const thirdLevelCode = orgForPoliceFilterCode.length < 4 ? "00" : orgForPoliceFilterCode.substring(2, 4)
  const bottomLevelCode = "00"

  return {
    SecondLevelCode: secondLevelCode,
    ThirdLevelCode: thirdLevelCode,
    BottomLevelCode: bottomLevelCode,
    OrganisationUnitCode: secondLevelCode + thirdLevelCode + bottomLevelCode
  }
}
