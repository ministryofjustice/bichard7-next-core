import { isError } from "@moj-bichard7/common/types/Result"

import ApiClient from "./ApiClient"
import axios from "axios"
import type { AxiosResponse } from "axios"
import { API_LOCATION } from "config"

jest.mock("axios")
const mockedAxios = axios as jest.MockedFunction<typeof axios>
mockedAxios.isAxiosError = jest.requireActual("axios").isAxiosError

describe("apiClient get", () => {
  const apiClient = new ApiClient("jwt")

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("requires JWT", () => {
    expect(apiClient.jwt).toBe("jwt")
  })

  it("returns a case successfully", async () => {
    const testCase = { asn: "0011", defendant_name: "Adam Smith", error_count: 1, trigger_count: 1 }

    mockedAxios.mockResolvedValue({
      status: 200,
      statusText: "OK",
      data: testCase,
      headers: {},
      config: {} as any
    } as AxiosResponse)

    const result = await apiClient.get("/v1/cases/1")

    expect(mockedAxios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: `${API_LOCATION}/v1/cases/1`,
        method: "GET"
      })
    )

    expect(isError(result)).toBe(false)
    expect(result).toEqual(testCase)
  })

  it("returns an error when the API returns an error response", async () => {
    mockedAxios.mockRejectedValue({
      response: {
        status: 404,
        statusText: "Not Found",
        data: { message: "Error: 404 - Not Found" },
        headers: {},
        config: {} as any
      },
      isAxiosError: true
    })

    const result = await apiClient.get("/v1/cases/1")

    expect(isError(result)).toBe(true)
    expect((result as Error).message).toBe("Error: 404 - Not Found")
  })

  it("can post without a body", async () => {
    const testCase = { asn: "0011", defendant_name: "Adam Smith", error_count: 1, trigger_count: 1 }

    mockedAxios.mockResolvedValue({
      status: 200,
      statusText: "OK",
      data: testCase,
      headers: {},
      config: {} as any
    } as AxiosResponse)

    const result = await apiClient.post("/v1/cases/1")

    expect(mockedAxios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: `${API_LOCATION}/v1/cases/1`,
        method: "POST",
        data: {}
      })
    )

    expect(isError(result)).toBe(false)
    expect(result).toEqual(testCase)
  })

  it("can post with a body", async () => {
    const testCase = { asn: "0011", defendant_name: "Adam Smith", error_count: 1, trigger_count: 1 }

    mockedAxios.mockResolvedValue({
      status: 200,
      statusText: "OK",
      data: testCase,
      headers: {},
      config: {} as any
    } as AxiosResponse)

    const result = await apiClient.post("/v1/cases/1", { 1: "thing", obj: { hello: "world" } })

    expect(mockedAxios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: `${API_LOCATION}/v1/cases/1`,
        method: "POST",
        data: { 1: "thing", obj: { hello: "world" } }
      })
    )

    expect(isError(result)).toBe(false)
    expect(result).toEqual(testCase)
  })
})
