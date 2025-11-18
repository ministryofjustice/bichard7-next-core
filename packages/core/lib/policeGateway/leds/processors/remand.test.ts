import { PncOperation } from "@moj-bichard7/common/types/PncOperation"

import type PoliceUpdateRequest from "../../../../phase3/types/PoliceUpdateRequest"

import { buildNormalDisposalRequest } from "../../../../tests/fixtures/buildNormalDisposalRequest"
import { buildRemandRequest } from "../../../../tests/fixtures/buildRemandRequest"
import PoliceApiError from "../../PoliceApiError"
import endpoints from "../endpoints"
import { remand } from "./remand"

const personId = "123"
const reportId = "456"
const request = {
  operation: PncOperation.REMAND,
  request: buildRemandRequest()
} as PoliceUpdateRequest

describe("remand", () => {
  it("returns endpoint and requestBody", () => {
    const endpoint = "/people/123/arrest-reports/456/basic-remands"
    const requestBody = {
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
    const expectedResult = { endpoint, requestBody }

    const result = remand(request, personId, reportId)

    expect(result).toStrictEqual(expectedResult)
  })

  it("returns error when operation is not remand", () => {
    const normalDisposalRequest = {
      operation: PncOperation.NORMAL_DISPOSAL,
      request: buildNormalDisposalRequest()
    } as PoliceUpdateRequest

    const result = remand(normalDisposalRequest, personId, reportId)

    expect(result).toBeInstanceOf(PoliceApiError)
    expect((result as PoliceApiError).messages).toContain("mapToRemandRequest called with a non-remand request")
  })

  it("returns error when zod schema does not match any of the fields", () => {
    const requestWithInvalidData = {
      operation: PncOperation.REMAND,
      request: buildRemandRequest({ pncIdentifier: "" })
    } as PoliceUpdateRequest

    const x = buildRemandRequest()
    x.pncIdentifier = ""

    const result = remand(requestWithInvalidData, personId, reportId)

    expect(result).toBeInstanceOf(PoliceApiError)
    expect((result as PoliceApiError).messages).toContain("Failed to validate LEDS request.")
  })
})

describe("remand - endpoint usage", () => {
  it("calls endpoints.remand with correct arguments", () => {
    const spy = jest.spyOn(endpoints, "remand")
    spy.mockReturnValue("/people/123/arrest-reports/456/basic-remands")

    remand(request, personId, reportId)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(personId, reportId)
  })
})

describe("remand - mapping calls", () => {
  let remand: any
  let mapToRemandRequest: jest.Mock

  beforeEach(() => {
    jest.resetModules()

    jest.doMock("../mapToRemandRequest", () => ({
      __esModule: true,
      default: jest.fn()
    }))

    mapToRemandRequest = require("../mapToRemandRequest").default
    remand = require("./remand").remand
  })

  it("passes the request.request object into mapToRemandRequest", () => {
    mapToRemandRequest.mockReturnValue({ value: "mockValue" })

    remand(request, "123", "456")

    expect(mapToRemandRequest).toHaveBeenCalledTimes(1)
    expect(mapToRemandRequest).toHaveBeenCalledWith(request.request)
  })
})
