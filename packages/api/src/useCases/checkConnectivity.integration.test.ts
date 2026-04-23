import End2EndPostgres from "../tests/testGateways/e2ePostgres"
import checkConnectivity from "./checkConnectivity"

const testDatabaseGateway = new End2EndPostgres()

describe("checkConnectivity", () => {
  it("should return true for all services", async () => {
    const connectivity = await checkConnectivity(testDatabaseGateway.readonly)

    expect(connectivity).toEqual({
      database: true
    })
  })
})
