import createPoliceExceptionGenerator from "./createPoliceExceptionGenerator"
import LedsExceptionGenerator from "./LedsExceptionGenerator/LedsExceptionGenerator"
import PncExceptionGenerator from "./PncExceptionGenerator/PncExceptionGenerator"

describe("createPoliceExceptionGenerator", () => {
  it('should return LEDS implementation of PoliceExceptionGenerator when USE_LEDS is "true"', () => {
    process.env.USE_LEDS = "true"
    const generator = createPoliceExceptionGenerator()

    expect(generator).toBeInstanceOf(LedsExceptionGenerator)
  })

  it.each(["True", "tRuE", "false", "False", undefined, ""])(
    "should return PNC implementation of PoliceExceptionGenerator when USE_LEDS is not %s",
    (useLeds) => {
      process.env.USE_LEDS = useLeds
      const generator = createPoliceExceptionGenerator()

      expect(generator).toBeInstanceOf(PncExceptionGenerator)
    }
  )
})
