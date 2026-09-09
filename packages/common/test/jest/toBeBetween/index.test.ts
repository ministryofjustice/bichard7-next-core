import "./index"

describe(".toBeBetween()", () => {
  test("succeeds Date between dates", () => {
    const toCompare: Date = new Date("2021-07-28T08:34:22.789Z")
    const before: Date = new Date("2021-06-29T08:34:22.789Z")
    const after: Date = new Date("2021-07-29T08:34:22.789Z")
    expect(toCompare).toBeBetween(before, after)
  })

  test("succeeds number between numbers", () => {
    const toCompare = 42
    const before = 13
    const after = 100
    expect(toCompare).toBeBetween(before, after)
  })
})
