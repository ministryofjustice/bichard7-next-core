import type { EnrichAhoFunction } from "src/types/EnrichAhoFunction"

const enrichForceOwner: EnrichAhoFunction = (hearingOutcome) => {
  if (!hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.ManualForceOwner) {
    // let forceStationCode: string | null = null
    // getValidForceOrForceStationCodeFromPNCResponseMessage
    // TODO: implement validations:
    //   HOValidatorAmenderConfiguration.isValidForceCode(forceCode);
    //   organisationUnitLookup.lookupByCodes("", forceCode, stationCode, "00")
    const fsCode = hearingOutcome.AnnotatedHearingOutcome.CXE01?.FSCode
    if (fsCode && fsCode.length >= 2) {
      const forceCode = fsCode.substring(0, 2)
      let stationCode: string | null = null

      if (fsCode.length >= 4) {
        stationCode = fsCode.substring(2, 4)
      }
      stationCode = stationCode ?? "00"
      // forceStationCode = forceCode + stationCode
      hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner = {
        SecondLevelCode: forceCode.substring(0, 2),
        ThirdLevelCode: stationCode,
        BottomLevelCode: "00",
        OrganisationUnitCode: forceCode.substring(0, 2) + stationCode + "00"
      }
    }
  }

  return hearingOutcome
}

export default enrichForceOwner
