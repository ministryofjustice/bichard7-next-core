import type RemandPncUpdateRequest from "../../../phase3/types/RemandPncUpdateRequest"

import mapToRemandRequest from "./mapToRemandRequest"

type GenerateRemandRequestParams = {
  psaCourtCode?: string
  remandLocationCourt?: string
}

const generateRemandRequest = ({
  remandLocationCourt,
  psaCourtCode
}: GenerateRemandRequestParams): RemandPncUpdateRequest["request"] => ({
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

const expectedRequest = {
  appearanceResult: "remanded-on-bail",
  bailConditions: ["This is a dummy bail condition."],
  checkname: "CHECKNAME",
  currentAppearance: {
    court: {
      courtIdentityType: "code",
      courtCode: "2063"
    }
  },
  nextAppearance: {
    court: {
      courtIdentityType: "code",
      courtCode: "2063"
    },
    date: "11122024"
  },
  ownerCode: "02YZ",
  personUrn: "2000/0448754K",
  remandDate: "05122024"
}

describe("mapToRemandRequest", () => {
  it("should map the remand operation to LEDS remand request when remand location is 9998", () => {
    const request = generateRemandRequest({ remandLocationCourt: "9998" })
    const ledsRequest = mapToRemandRequest(request)

    expect(ledsRequest).toEqual({
      ...expectedRequest,
      currentAppearance: {
        court: {
          courtIdentityType: "name",
          courtName: "Magistrates' Courts London Croydon MCA"
        }
      }
    })
  })

  it("should map the remand operation to LEDS remand request when remand location is not 9998", () => {
    const request = generateRemandRequest({ remandLocationCourt: "2673" })
    const ledsRequest = mapToRemandRequest(request)

    expect(ledsRequest).toEqual({
      ...expectedRequest,
      currentAppearance: {
        court: {
          courtCode: "2673",
          courtIdentityType: "code"
        }
      }
    })
  })

  it("should map the remand operation to LEDS remand request when PSA court code is 9998", () => {
    const request = generateRemandRequest({ psaCourtCode: "9998" })
    const ledsRequest = mapToRemandRequest(request)

    expect(ledsRequest).toEqual({
      ...expectedRequest,
      nextAppearance: {
        court: {
          courtIdentityType: "name",
          courtName: "Magistrates' Courts London Croydon MCA"
        },
        date: "11122024"
      }
    })
  })

  it("should map the remand operation to LEDS remand request when PSA court code is not 9998", () => {
    const request = generateRemandRequest({ psaCourtCode: "2673" })
    const ledsRequest = mapToRemandRequest(request)

    expect(ledsRequest).toEqual({
      ...expectedRequest,
      nextAppearance: {
        court: {
          courtCode: "2673",
          courtIdentityType: "code"
        },
        date: "11122024"
      }
    })
  })
})
