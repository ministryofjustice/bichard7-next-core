import readFormState from "./readFormState"

describe("readFormState", () => {
  it("should map the form data", () => {
    const formData = new FormData()

    formData.append("resolvedBy", "user01")
    formData.append("resolvedBy", "user02")

    formData.append("triggers", "TRPR0010")
    formData.append("triggers", "TRPR0011")

    formData.set("includeTriggers", "on")
    formData.set("includeExceptions", "on")

    formData.set("volume", "20")

    formData.set("fromDate", "2026-01-01")
    formData.set("toDate", "2026-01-02")

    const formState = readFormState(formData)

    expect(formState).toEqual({
      resolvedBy: ["user01", "user02"],
      triggers: ["TRPR0010", "TRPR0011"],
      includeTriggers: true,
      includeExceptions: true,
      volume: "20",
      fromDate: new Date(2026, 0, 1),
      toDate: new Date(2026, 0, 2)
    })
  })
})
