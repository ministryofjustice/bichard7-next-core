import getTriggerWithDescription from "./getTriggerWithDescription"

describe("getTriggerWithDescription", () => {
  it("add short description to a trigger", () => {
    expect(getTriggerWithDescription("TRPR0012")).toStrictEqual("TRPR0012 - Warrant withdrawn")
    expect(getTriggerWithDescription("TRPR0015")).toStrictEqual("TRPR0015 - Personal details changed")
  })

  it("will leave the long trigger code and add a short description to a trigger with second argument as false", () => {
    expect(getTriggerWithDescription("TRPR0012", false)).toStrictEqual("TRPR0012 - Warrant withdrawn")
    expect(getTriggerWithDescription("TRPR0015", false)).toStrictEqual("TRPR0015 - Personal details changed")
  })

  it("will use the short trigger code and add a short description to a trigger with second argument as true", () => {
    expect(getTriggerWithDescription("TRPR0012", true)).toStrictEqual("PR12 - Warrant withdrawn")
    expect(getTriggerWithDescription("TRPR0015", true)).toStrictEqual("PR15 - Personal details changed")
  })
})
