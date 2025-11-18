import type RemandPncUpdateRequest from "../../phase3/types/RemandPncUpdateRequest"

type buildRemandRequestParams = {
  psaCourtCode?: string
  remandLocationCourt?: string
}

export const buildRemandRequest = ({
  remandLocationCourt,
  psaCourtCode
}: buildRemandRequestParams): RemandPncUpdateRequest["request"] => ({
  croNumber: "DUMMY_CRO_NUMBER",
  forceStationCode: "02YZ",
  pncCheckName: "CHECKNAME",
  pncIdentifier: "2000/0448754K",
  arrestSummonsNumber: "11/01ZD/01/410780J",
  hearingDate: "05122024",
  nextHearingDate: "11122024",
  pncRemandStatus: "B",
  remandLocationCourt: remandLocationCourt ?? "2063",
  psaCourtCode: psaCourtCode ?? "2063",
  courtNameType1: "Magistrates' Courts London Croydon MCA",
  courtNameType2: "Magistrates' Courts London Croydon MCA",
  localAuthorityCode: "0000",
  bailConditions: ["This is a dummy bail condition."]
})
