import { ValueTransformer } from "typeorm"
import delimitedString from "./delimitedString"
let transformer: ValueTransformer

describe("delimitedString value transformer", () => {
  beforeAll(() => {
    transformer = delimitedString(",")
  })

  it("can transform list of values from a string into an array", () => {
    expect(transformer.from("011,012")).toStrictEqual(["011", "012"])
  })

  it("creates an empty array when there are no values", () => {
    expect(transformer.from("")).toStrictEqual([])
  })

  it("can transform the array back to the original value", () => {
    expect(transformer.to(["11", "12"])).toStrictEqual("11,12")
    expect(transformer.to([])).toStrictEqual("")
  })
})
