import End2EndPostgres from "../tests/testGateways/e2ePostgres"
import checkConnectivity from "./checkConnectivity"

jest.mock("../services/checkLedsConnectivity", () => {
  return {
    __esModule: true,
    default: jest.fn().mockResolvedValue(true)
  }
})

describe("checkConnectivity", () => {
  const testDatabaseGateway = new End2EndPostgres()

  afterAll(async () => {
    await testDatabaseGateway.close()
  })

  it("should return true for all services", async () => {
    const connectivity = await checkConnectivity(testDatabaseGateway.readonly)

    expect(connectivity).toEqual({
      database: true,
      leds: true
    })
  })
})
