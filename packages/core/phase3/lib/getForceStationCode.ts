import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"

const bichardThirdLevelCode = "YZ"

const getForceStationCode = (aho: AnnotatedHearingOutcome, useSpecialStationCode: boolean): string => {
  const forceOwner = aho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner
  const secondLevelCode = forceOwner?.SecondLevelCode
  const thirdLevelCode = useSpecialStationCode ? bichardThirdLevelCode : forceOwner?.ThirdLevelCode
  return secondLevelCode ? `${secondLevelCode}${thirdLevelCode}` : "0000"
}

export default getForceStationCode
