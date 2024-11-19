import type { OrganisationUnitCodes } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"

export default (orgForPoliceFilter: string): Error | OrganisationUnitCodes => {
  const orgForPoliceFilterCode = orgForPoliceFilter.split(",")[0]

  if (orgForPoliceFilterCode.length < 2) {
    return new Error(`orgForPoliceFilter "${orgForPoliceFilterCode}" too short to extract organisation unit code`)
  }

  const secondLevelCode = orgForPoliceFilterCode.substring(0, 2)
  const thirdLevelCode = orgForPoliceFilterCode.length < 4 ? "00" : orgForPoliceFilterCode.substring(2, 4)
  const bottomLevelCode = "00"

  return {
    BottomLevelCode: bottomLevelCode,
    OrganisationUnitCode: secondLevelCode + thirdLevelCode + bottomLevelCode,
    SecondLevelCode: secondLevelCode,
    ThirdLevelCode: thirdLevelCode
  }
}
