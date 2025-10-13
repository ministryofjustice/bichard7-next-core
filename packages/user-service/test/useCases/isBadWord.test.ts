import isBadWord from "useCases/isBadWord"

it("should return true if it is a bad word", () => {
  expect(isBadWord("knob")).toBe(true)
  expect(isBadWord("poop")).toBe(true)
})

it("should return false if it is not a bad word", () => {
  expect(isBadWord("pleasent")).toBe(false)
  expect(isBadWord("good")).toBe(false)
})
