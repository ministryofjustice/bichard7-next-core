import getTriggerWithDescription from "./getTriggerWithDescription"

describe("getTriggerWithDescription", () => {
  it("add short description to a trigger", () => {
    expect(getTriggerWithDescription("TRPR0012")).toBe("TRPR0012 - Warrant withdrawn")
    expect(getTriggerWithDescription("TRPR0015")).toBe("TRPR0015 - Personal details changed")
  })

  it("will leave the long trigger code and add a short description to a trigger with second argument as false", () => {
    expect(getTriggerWithDescription("TRPR0012", false)).toBe("TRPR0012 - Warrant withdrawn")
    expect(getTriggerWithDescription("TRPR0015", false)).toBe("TRPR0015 - Personal details changed")
  })

  it("will use the short trigger code and add a short description to a trigger with second argument as true", () => {
    expect(getTriggerWithDescription("TRPR0012", true)).toBe("PR12 - Warrant withdrawn")
    expect(getTriggerWithDescription("TRPR0015", true)).toBe("PR15 - Personal details changed")
  })
})
