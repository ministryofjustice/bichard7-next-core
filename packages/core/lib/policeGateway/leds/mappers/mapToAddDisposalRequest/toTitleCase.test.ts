import { toTitleCase } from "./toTitleCase"

describe("toTitleCase", () => {
  test.each([
    ["GUILTY", "Guilty"],
    ["NOT GUILTY", "Not Guilty"],
    ["NON-CONVICTION", "Non-Conviction"],
    ["NO PLEA TAKEN", "No Plea Taken"]
  ])("converts %s into %s", (text, expectedTitleCase) => {
    const titleCase = toTitleCase(text)

    expect(titleCase).toBe(expectedTitleCase)
  })
})
