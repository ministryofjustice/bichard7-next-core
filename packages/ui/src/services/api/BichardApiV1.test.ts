import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"

import { Reason, ResolutionStatus, type ApiCaseQuery } from "@moj-bichard7/common/types/ApiCaseQuery"
import type { CaseIndexMetadata } from "@moj-bichard7/common/types/Case"
import { CaseAge } from "@moj-bichard7/common/types/CaseAge"
import { isError } from "@moj-bichard7/common/types/Result"
import { LockedState } from "types/CaseListQueryParams"
import type { DisplayFullCourtCase } from "types/display/CourtCases"
import FakeApiClient from "../../../test/helpers/api/fakeApiClient"
import BichardApiV1 from "./BichardApiV1"
import type BichardApiGateway from "./interfaces/BichardApiGateway"

describe("BichardApiV1", () => {
  let client: FakeApiClient
  let gateway: BichardApiGateway
  const caseId = 1
  const apiCaseQuerystring: ApiCaseQuery = {
    maxPerPage: 1,
    pageNum: 1,
    reason: Reason.All
  }

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

      jest.spyOn(client, "get").mockResolvedValue("works")

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
      expect(result).toEqual(new Error("Error"))
    })
  })

  describe("#fetchCases", () => {
    it("calls apiClient#get with a route", async () => {
      const endpoint = V1.Cases

      jest.spyOn(client, "get").mockResolvedValue({} as CaseIndexMetadata)

      await gateway.fetchCases(apiCaseQuerystring)

      expect(client.get).toHaveBeenCalledWith(`${endpoint}?maxPerPage=1&pageNum=1&reason=All`)
    })

    it("calls apiClient#get with a route and returns a CaseIndexMetadata", async () => {
      const expectedData = {} as CaseIndexMetadata
      jest.spyOn(client, "get").mockResolvedValue({} as CaseIndexMetadata)

      const result = await gateway.fetchCases(apiCaseQuerystring)

      expect(result).toEqual(expectedData)
    })

    it("accepts filter queries", async () => {
      const endpoint = V1.Cases
      const expectedData = {} as CaseIndexMetadata

      jest.spyOn(client, "get").mockResolvedValue({} as CaseIndexMetadata)

      const result = await gateway.fetchCases(apiCaseQuerystring)

      expect(result).toEqual(expectedData)
      expect(client.get).toHaveBeenCalledWith(`${endpoint}?maxPerPage=1&pageNum=1&reason=All`)
    })

    it("accepts filter queries with arrays", async () => {
      const sortQuery = (query: string) =>
        query
          .split("?")[1]
          .split("&")
          .sort()
          .map((q) => q.replace(/\+/g, "%20"))
          .join("&")

      const endpoint = V1.Cases

      const apiCaseQuerystring: ApiCaseQuery = {
        maxPerPage: 50,
        pageNum: 1,
        reason: Reason.All,
        caseAge: [CaseAge.Today, CaseAge.Yesterday],
        reasonCodes: ["HO100206", "HO100323"],
        allocatedUsername: "user1",
        asn: "1101ZD01448754K",
        caseState: ResolutionStatus.Resolved,
        courtName: "Kings Court",
        defendantName: "Adam Smith",
        from: new Date("2025-02-01"),
        lockedState: LockedState.All,
        ptiurn: "110011001",
        resolvedByUsername: "user.resolver",
        resolvedFrom: new Date("2025-03-01"),
        resolvedTo: new Date("2025-03-25"),
        to: new Date("2025-03-31")
      }

      const expectedData = {} as CaseIndexMetadata

      jest.spyOn(client, "get").mockResolvedValue({} as CaseIndexMetadata)

      const result = await gateway.fetchCases(apiCaseQuerystring)

      const generatedQuery = sortQuery((client.get as jest.Mock).mock.calls[0][0])
      const expectedQuery = sortQuery(
        `${endpoint}?allocatedUsername=user1&asn=1101ZD01448754K&caseAge=Today&caseAge=Yesterday&caseState=Resolved&courtName=Kings%20Court&defendantName=Adam%20Smith&from=2025-02-01&lockedState=All&maxPerPage=50&pageNum=1&ptiurn=110011001&reason=All&reasonCodes=HO100206&reasonCodes=HO100323&resolvedByUsername=user.resolver&resolvedFrom=2025-03-01&resolvedTo=2025-03-25&to=2025-03-31`
      )

      expect(result).toEqual(expectedData)
      expect(generatedQuery).toEqual(expectedQuery)
    })

    it("can handle errors", async () => {
      jest.spyOn(client, "get").mockResolvedValue(new Error("Error"))

      const result = await gateway.fetchCases(apiCaseQuerystring)

      expect(isError(result)).toBe(true)
      expect(result).toEqual(new Error("Error"))
    })
  })
})
