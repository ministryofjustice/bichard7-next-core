import { fetch } from "undici"
import ApiClient, { HttpMethod } from "./ApiClient" // Adjust the path if necessary
import { ApiError } from "types/ApiError"

jest.mock("undici", () => ({
  fetch: jest.fn(),
  Agent: jest.fn()
}))

jest.mock("config", () => ({
  API_LOCATION: "https://api.example.com"
}))

const mockFetch = fetch as jest.MockedFunction<typeof fetch>

describe("ApiClient", () => {
  const jwt = "test-jwt-token"
  let client: ApiClient

  beforeEach(() => {
    jest.clearAllMocks()
    client = new ApiClient(jwt)
  })

  const mockResponse = (ok: boolean, status: number, data: any, isJson = true) => ({
    ok,
    status,
    json: jest.fn().mockResolvedValue(data),
    text: jest.fn().mockResolvedValue(isJson ? JSON.stringify(data) : data)
  })

  it("should perform a successful GET request", async () => {
    const expectedData = { id: 1, name: "Test" }
    mockFetch.mockResolvedValueOnce(mockResponse(true, 200, expectedData) as any)

    const result = await client.get("/users")

    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(mockFetch).toHaveBeenCalledWith("https://api.example.com/users", {
      method: HttpMethod.GET,
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json"
      },
      dispatcher: expect.any(Object)
    })
    expect(result).toEqual(expectedData)
  })

  it("should perform a successful POST request with an object body", async () => {
    const payload = { name: "New User" }
    const expectedData = { success: true }
    mockFetch.mockResolvedValueOnce(mockResponse(true, 201, expectedData) as any)

    const result = await client.post("/users", payload)

    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(mockFetch).toHaveBeenCalledWith("https://api.example.com/users", {
      method: HttpMethod.POST,
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
      dispatcher: expect.any(Object)
    })
    expect(result).toEqual(expectedData)
  })

  it("should perform a successful POST request with a string body", async () => {
    const payload = "plain-text-body"
    const expectedData = { success: true }
    mockFetch.mockResolvedValueOnce(mockResponse(true, 201, expectedData) as any)

    await client.post("/users", payload)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: payload
      })
    )
  })

  it("should return an ApiError when response is not ok and contains a JSON message", async () => {
    const errorPayload = { message: "Invalid credentials" }
    mockFetch.mockResolvedValueOnce(mockResponse(false, 401, errorPayload) as any)

    const result = await client.get("/protected")

    expect(result).toBeInstanceOf(ApiError)
    expect((result as ApiError).status).toBe(401)
    expect((result as ApiError).message).toBe("Invalid credentials")
  })

  it("should return an ApiError using the raw body when response is not ok and contains invalid JSON", async () => {
    const rawErrorText = "Internal Server Error"
    mockFetch.mockResolvedValueOnce(mockResponse(false, 500, rawErrorText, false) as any)

    const result = await client.get("/failing-route")

    expect(result).toBeInstanceOf(ApiError)
    expect((result as ApiError).status).toBe(500)
    expect((result as ApiError).message).toBe("Internal Server Error")
  })

  it("should catch and return network errors", async () => {
    const networkError = new Error("Network failure")
    mockFetch.mockRejectedValueOnce(networkError)

    const result = await client.get("/timeout")

    expect(result).toBeInstanceOf(Error)
    expect((result as Error).message).toBe("Network failure")
  })
})
