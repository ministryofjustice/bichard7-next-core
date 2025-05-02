import { initialOffencesVisibility } from "./initialOffencesVisibility"

describe("initialOffencesVisibility", () => {
  it("returns initial offences visibility map", () => {
    const expectedResult = {
      1: true,
      2: true,
      3: true,
      4: true,
      5: true
    }

    const initialOffencesVisibilityMap = initialOffencesVisibility(5)
    console.log(initialOffencesVisibilityMap)

    expect(initialOffencesVisibilityMap).toEqual(expectedResult)
  })
})
