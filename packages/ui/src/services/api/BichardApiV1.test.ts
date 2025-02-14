import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"

import type { DisplayFullCourtCase } from "types/display/CourtCases"
import { isError } from "types/Result"
import FakeApiClient from "../../../test/helpers/api/fakeApiClient"
import BichardApiV1 from "./BichardApiV1"
import type BichardApiGateway from "./interfaces/BichardApiGateway"

describe("BichardApiV1", () => {
  let client: FakeApiClient
  let gateway: BichardApiGateway
  const caseId = 1

  beforeEach(() => {
    client = new FakeApiClient("jwt")
    gateway = new BichardApiV1(client)
  })

  it("holds an API client", () => {
    expect(gateway.apiClient).toBeDefined()
  })

  describe("#fetchCase", () => {
    it("calls apiClient#get with a route", async () => {
      const endpoint = V1.Case.replace(":caseId", `${caseId}`)

      jest.spyOn(client, "get")

      await gateway.fetchCase(caseId)

      expect(client.get).toHaveBeenCalledWith(endpoint)
    })

    it("calls apiClient#get with a route and returns a DisplayFullCourtCase", async () => {
      const expectedCase = { errorId: 1 } as DisplayFullCourtCase

      jest.spyOn(client, "get").mockResolvedValue({ errorId: 1 } as DisplayFullCourtCase)

      const result = await gateway.fetchCase(caseId)

      expect(result).toEqual(expectedCase)
    })

    it("can handle errors", async () => {
      jest.spyOn(client, "get").mockResolvedValue(new Error("Error"))

      const result = await gateway.fetchCase(caseId)

      expect(isError(result)).toBe(true)
    })
  })
})
