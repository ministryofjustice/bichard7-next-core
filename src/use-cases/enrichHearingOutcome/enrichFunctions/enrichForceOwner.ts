import type { EnrichAhoFunction } from "src/types/EnrichAhoFunction"

const enrichForceOwner: EnrichAhoFunction = (hearingOutcome) => {
  if (!hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.ManualForceOwner) {
    let forceStationCode: string
    // getValidForceOrForceStationCodeFromPNCResponseMessage
    // TODO: implement validations:
    //   HOValidatorAmenderConfiguration.isValidForceCode(forceCode);
    //   organisationUnitLookup.lookupByCodes("", forceCode, stationCode, "00")
    const fsCode = hearingOutcome.AnnotatedHearingOutcome.CXE01?.FSCode
    if (fsCode && fsCode.length >= 2) {
      const forceCode = fsCode.substring(0, 2)
      let stationCode = ""

      if (fsCode.length >= 4) {
        stationCode = fsCode.substring(2, 4)
      }
      forceStationCode = forceCode + stationCode
    }
  }

  return hearingOutcome
}

export default enrichForceOwner
