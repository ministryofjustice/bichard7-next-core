import { isError } from "@moj-bichard7/common/types/Result"
import jwt from "jsonwebtoken"
import setLedsEnvironmentVariables from "../../../../tests/helpers/setLedsEnvironmentVariables"
import NiamLedsAuthentication from "./NiamLedsAuthentication"

describe("NiamLedsAuthentication", () => {
  let fetchSpy: jest.SpyInstance
  let authentication: typeof NiamLedsAuthentication

  const spyFetch = (expiry?: Date) => {
    const jwtExpiryDate = expiry ?? new Date()
    if (!expiry) {
      jwtExpiryDate.setHours(jwtExpiryDate.getHours() + 1)
    }

    const payload = { exp: Math.floor(jwtExpiryDate.getTime() / 1000) }
    fetchSpy = jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ access_token: jwt.sign(payload, "secret-key") })
      } as any)
    )
  }

  beforeEach(async () => {
    setLedsEnvironmentVariables()
    jest.resetModules()
    authentication = (await import("./NiamLedsAuthentication")).default
  })

  afterEach(() => {
    jest.useRealTimers()
    fetchSpy.mockRestore()
  })

  it("should return bearer token", async () => {
    const jwtExpiryDate = new Date()
    jwtExpiryDate.setHours(jwtExpiryDate.getHours() + 1)
    spyFetch(jwtExpiryDate)

    const token = await authentication.createInstance().generateBearerToken()

    expect(isError(token)).toBeFalsy()
    expect(token).toBeDefined()
    expect(String(token).split(".")).toHaveLength(3)
  })

  it("should return the same bearer token if token has not been expired", async () => {
    const jwtExpiryDate = new Date()
    jwtExpiryDate.setHours(jwtExpiryDate.getHours() + 1)
    spyFetch(jwtExpiryDate)

    const token1 = await authentication.createInstance().generateBearerToken()

    jest.useFakeTimers({ now: new Date(jwtExpiryDate.getTime() - 301_000) }) // 5 minutes and 1 seconds before token expiry

    const token2 = await authentication.createInstance().generateBearerToken()

    expect(isError(token1)).toBeFalsy()
    expect(token1).toBeDefined()
    expect(String(token1).split(".")).toHaveLength(3)

    expect(isError(token2)).toBeFalsy()
    expect(token2).toBeDefined()
    expect(String(token2).split(".")).toHaveLength(3)

    expect(token2).toBe(token1)
  })

  it.each([
    {
      description: "Exactly the expiry date",
      seconds: 0
    },
    {
      description: "5 minutes (expiry threshold) before the expiry date",
      seconds: -300
    }
  ])("should return a new bearer token if token has been expired ($description)", async ({ seconds }) => {
    const jwtExpiryDate = new Date()
    jwtExpiryDate.setHours(jwtExpiryDate.getHours() + 1)
    spyFetch(jwtExpiryDate)

    const token1 = await authentication.createInstance().generateBearerToken()

    jest.useFakeTimers({ now: new Date(jwtExpiryDate.getTime() + seconds * 1000) })

    const token2 = await authentication.createInstance().generateBearerToken()

    expect(isError(token1)).toBeFalsy()
    expect(token1).toBeDefined()
    expect(String(token1).split(".")).toHaveLength(3)

    expect(isError(token2)).toBeFalsy()
    expect(token2).toBeDefined()
    expect(String(token2).split(".")).toHaveLength(3)

    expect(token2).not.toBe(token1)
  })

  it("should return error if it fails to generate token", async () => {
    fetchSpy = jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ access_token: "invalid JWT" })
      } as any)
    )

    const token = await authentication.createInstance().generateBearerToken()

    expect((token as Error).message).toContain("Failed to decode token.")
  })

  it.each(["LEDS_NIAM_AUTH_URL", "LEDS_NIAM_PRIVATE_KEY", "LEDS_NIAM_CERTIFICATE", "LEDS_NIAM_PARAMETERS"])(
    "should throw error if %s environment variable doesn't exist",
    async (key) => {
      delete process.env[key]

      expect(() => authentication.createInstance()).toThrow(`${key} environment variable is required.`)
    }
  )

  it.each(["LEDS_NIAM_AUTH_URL", "LEDS_NIAM_PRIVATE_KEY", "LEDS_NIAM_CERTIFICATE", "LEDS_NIAM_PARAMETERS"])(
    "should throw error if %s environment variable is empty string",
    async (key) => {
      process.env[key] = ""

      expect(() => authentication.createInstance()).toThrow(`${key} environment variable is required.`)
    }
  )

  it("should throw error if LEDS_NIAM_PARAMETERS environment variable is not a valid JSON", async () => {
    process.env.LEDS_NIAM_PARAMETERS = "invalid json"

    expect(() => authentication.createInstance()).toThrow("Failed to parse LEDS_NIAM_PARAMETERS environment variable.")
  })
})
