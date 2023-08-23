import type { ValueTransformer } from "typeorm"
import delimitedPrefixedString from "src/services/entities/transformers/delimitedPrefixedString"
let transformer: ValueTransformer

describe("delimiterPrefixedString value transformer", () => {
  beforeAll(() => {
    transformer = delimitedPrefixedString(",", "0")
  })

  it("can transform forces from a string into an array", () => {
    expect(transformer.from("011111,011112")).toStrictEqual(["11111", "11112"])
  })

  it("creates an empty array when there are no forces", () => {
    expect(transformer.from("")).toStrictEqual([])
  })

  it("can transform the array back to the original value", () => {
    expect(transformer.to(["11111", "11112"])).toBe("011111,011112")
    expect(transformer.to([])).toBe("")
  })
})
