import { mapLockFilter } from "./validateLockFilter"

describe("mapLockFilter", () => {
  it.each([
    { input: "Locked", expected: true },
    { input: "Unlocked", expected: false },
    { input: "Invalid Lock Filter", expected: undefined }
  ])("check lock filter for '$input'", ({ input, expected }) => {
    expect(mapLockFilter(input)).toBe(expected)
  })
})
