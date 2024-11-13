import type PncUpdateRequestGenerator from "../../types/PncUpdateRequestGenerator"

const remandGenerator: PncUpdateRequestGenerator = (_pncUpdateDataset, _operation) => {
  // TODO: Implement RemandGeneratorImpl.java:88
  return {
    operation: "NEWREM",
    request: {
      pncIdentifier: "",
      pncCheckName: "",
      croNumber: null,
      arrestSummonsNumber: "",
      forceStationCode: "",
      hearingDate: "",
      nextHearingDate: "",
      pncRemandStatus: "",
      remandLocationCourt: "",
      psaCourtCode: "",
      courtNameType1: "",
      courtNameType2: "",
      localAuthorityCode: "",
      bailConditions: []
    }
  }
}

export default remandGenerator
