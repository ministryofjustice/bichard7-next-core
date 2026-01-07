import { buildRemandRequest } from "../../../../tests/fixtures/buildRemandRequest"
import mapToRemandRequest from "./mapToRemandRequest"

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
    date: "2024-12-11"
  },
  ownerCode: "02YZ",
  personUrn: "2000/0448754K",
  remandDate: "2024-12-05"
}

describe("mapToRemandRequest", () => {
  it("should map the remand operation to LEDS remand request when remand location is 9998", () => {
    const request = buildRemandRequest({ remandLocationCourt: "9998" })
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
    const request = buildRemandRequest({ remandLocationCourt: "2673" })
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
    const request = buildRemandRequest({ psaCourtCode: "9998" })
    const ledsRequest = mapToRemandRequest(request)

    expect(ledsRequest).toEqual({
      ...expectedRequest,
      nextAppearance: {
        court: {
          courtIdentityType: "name",
          courtName: "Magistrates' Courts London Croydon MCA"
        },
        date: "2024-12-11"
      }
    })
  })

  it("should map the remand operation to LEDS remand request when PSA court code is not 9998", () => {
    const request = buildRemandRequest({ psaCourtCode: "2673" })
    const ledsRequest = mapToRemandRequest(request)

    expect(ledsRequest).toEqual({
      ...expectedRequest,
      nextAppearance: {
        court: {
          courtCode: "2673",
          courtIdentityType: "code"
        },
        date: "2024-12-11"
      }
    })
  })
})
