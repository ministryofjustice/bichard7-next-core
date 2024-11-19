import { mapLockFilter } from "./validateLockFilter"

describe("mapLockFilter", () => {
  it.each([
    { expected: true, input: "Locked" },
    { expected: false, input: "Unlocked" },
    { expected: undefined, input: "Invalid Lock Filter" }
  ])("check lock filter for '$input'", ({ expected, input }) => {
    expect(mapLockFilter(input)).toBe(expected)
  })
})
