import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { isError } from "types/Result"
import createForceOwner from "utils/createForceOwner"
import { DEFAULT_STATION_CODE } from "./defaultStationCode"

const amendForceOwner = (value: string, aho: AnnotatedHearingOutcome) => {
  const upperCasevalue = value.trim().toUpperCase().substring(0, 2)
  if (!aho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner) {
    const forceOwner = createForceOwner(`${upperCasevalue}${DEFAULT_STATION_CODE}`)
    if (isError(forceOwner)) {
      throw forceOwner
    }

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner = forceOwner
  } else {
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner.OrganisationUnitCode = `${upperCasevalue}${DEFAULT_STATION_CODE}00`
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner.SecondLevelCode = upperCasevalue
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner.ThirdLevelCode = DEFAULT_STATION_CODE
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner.BottomLevelCode = "00"
  }

  if (!aho.AnnotatedHearingOutcome.HearingOutcome.Case.ManualForceOwner) {
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.ManualForceOwner = true
  }
}

export default amendForceOwner
