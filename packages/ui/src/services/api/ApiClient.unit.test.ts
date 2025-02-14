import { isError } from "types/Result"
import ApiClient from "./ApiClient"

describe("apiClient get", () => {
  const apiClient = new ApiClient("jwt")

  it("requires JWT", () => {
    expect(apiClient.jwt).toBe("jwt")
  })

  it("returns a case successfully", async () => {
    const testCase = { asn: "0011", defendant_name: "Adam Smith", error_count: 1, trigger_count: 1 }

    jest
      .spyOn(apiClient, "useFetch")
      .mockResolvedValue({ ok: true, json: async () => Promise.resolve(testCase) } as Response)

    const result = await apiClient.get("/v1/cases/1")

    expect(apiClient.useFetch).toHaveBeenCalledWith("/v1/cases/1", "GET")

    expect(isError(result)).toBe(false)
    expect(result).toEqual(testCase)
  })

  it("throws an error when the API returns an error response", async () => {
    jest.spyOn(apiClient, "useFetch").mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
      json: async () => ({ message: "Not Found" })
    } as Response)

    const result = await apiClient.get("/v1/cases/1")

    expect(isError(result)).toBe(true)
    expect(result).toEqual(new Error("Error: 404 - Not Found"))
  })
})
