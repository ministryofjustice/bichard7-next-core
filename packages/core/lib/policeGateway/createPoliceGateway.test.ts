import setLedsEnvironmentVariables from "../../tests/helpers/setLedsEnvironmentVariables"
import createPoliceGateway from "./createPoliceGateway"
import LedsGateway from "./leds/LedsGateway"
import PncGateway from "./pnc/PncGateway"

describe("createPoliceGateway", () => {
  it("should return PNC gateway when USE_LEDS environment variable is not set", () => {
    delete process.env.USE_LEDS

    const gateway = createPoliceGateway()

    expect(gateway).toBeInstanceOf(PncGateway)
  })

  it.each(["dummy", "True", "truE", undefined])(
    "should return PNC gateway when USE_LEDS environment variable value is %s",
    (environmentVariableValue) => {
      process.env.USE_LEDS = environmentVariableValue

      const gateway = createPoliceGateway()

      expect(gateway).toBeInstanceOf(PncGateway)
    }
  )

  it("should return LEDS gateway when USE_LEDS environment variable is true", () => {
    process.env.USE_LEDS = "true"
    setLedsEnvironmentVariables()

    const gateway = createPoliceGateway()

    expect(gateway).toBeInstanceOf(LedsGateway)
  })
})
