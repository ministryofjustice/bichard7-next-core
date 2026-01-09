import { ApiEndpoints } from "../types"
import * as config from "config"
import { canUseApiEndpoint } from "./canUseEndpoint"
import { canaryCheck } from "./canaryCheck"
import { hasApiEnabledByForce } from "./hasApiEnabledByForce"
import { isEndpointEnabled } from "./isEndpointEnabled"

jest.mock("./canaryCheck")
jest.mock("./hasApiEnabledByForce")
jest.mock("./isEndpointEnabled")

jest.mock("config", () => ({
  __esModule: true,
  // We define USE_API as a getter so jest.spyOn(config, 'USE_API', 'get') works
  get USE_API() {
    return true
  }
}))

describe("canUseApiEndpoint", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(hasApiEnabledByForce as jest.Mock).mockReturnValue(true)
    ;(isEndpointEnabled as jest.Mock).mockReturnValue(true)
    ;(canaryCheck as jest.Mock).mockReturnValue(true)
  })

  it("should return false when USE_API is false", () => {
    const spy = jest.spyOn(config, "USE_API", "get").mockReturnValue(false)

    const result = canUseApiEndpoint(ApiEndpoints.CaseDetails, ["01"], "user@test.com")

    expect(result).toBe(false)
    expect(hasApiEnabledByForce).not.toHaveBeenCalled()

    spy.mockRestore()
  })

  it("should return false when force is not enabled", () => {
    ;(hasApiEnabledByForce as jest.Mock).mockReturnValue(false)

    const result = canUseApiEndpoint(ApiEndpoints.CaseDetails, ["99"], "user@test.com")

    expect(result).toBe(false)
    expect(isEndpointEnabled).not.toHaveBeenCalled()
  })

  it("should return false when endpoint specific flag is disabled", () => {
    ;(isEndpointEnabled as jest.Mock).mockReturnValue(false)

    const result = canUseApiEndpoint(ApiEndpoints.CaseDetails, ["01"], "user@test.com")

    expect(result).toBe(false)
    expect(canaryCheck).not.toHaveBeenCalled()
  })

  it("should return true when all conditions pass", () => {
    const result = canUseApiEndpoint(ApiEndpoints.CaseDetails, ["01"], "user@test.com")
    expect(result).toBe(true)
  })

  it("should return the result of canaryCheck correctly", () => {
    ;(canaryCheck as jest.Mock).mockReturnValue(false)
    expect(canUseApiEndpoint(ApiEndpoints.CaseDetails, ["01"], "user@test.com")).toBe(false)
    ;(canaryCheck as jest.Mock).mockReturnValue(true)
    expect(canUseApiEndpoint(ApiEndpoints.CaseDetails, ["01"], "user@test.com")).toBe(true)
  })

  it("should pass the correct arguments to all dependencies", () => {
    const forces = ["01", "02"]
    const email = "dev@example.com"

    canUseApiEndpoint(ApiEndpoints.CaseList, forces, email)

    expect(hasApiEnabledByForce).toHaveBeenCalledWith(forces)
    expect(isEndpointEnabled).toHaveBeenCalledWith(ApiEndpoints.CaseList)
    expect(canaryCheck).toHaveBeenCalledWith(ApiEndpoints.CaseList, email)
  })
})
