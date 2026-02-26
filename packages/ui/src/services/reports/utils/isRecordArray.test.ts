import { isRecordArray } from "./isRecordArray"

describe("isRecordArray", () => {
  it("should return true for an array of plain objects", () => {
    expect(isRecordArray([{ id: 1 }, { name: "test" }])).toBe(true)
  })

  it("should return true for an empty array", () => {
    expect(isRecordArray([])).toBe(true)
  })

  it("should return false if the input itself is not an array", () => {
    expect(isRecordArray({ id: 1 })).toBe(false)
    expect(isRecordArray("string")).toBe(false)
    expect(isRecordArray(123)).toBe(false)
    expect(isRecordArray(null)).toBe(false)
    expect(isRecordArray(undefined)).toBe(false)
  })

  it("should return false if the array contains primitive values", () => {
    expect(isRecordArray([{ id: 1 }, "invalid string", { id: 2 }])).toBe(false)
    expect(isRecordArray([1, 2, 3])).toBe(false)
    expect(isRecordArray([true, false])).toBe(false)
  })

  it("should return false if the array contains nested arrays", () => {
    expect(isRecordArray([[], []])).toBe(false)
    expect(isRecordArray([{ id: 1 }, ["nested"]])).toBe(false)
  })

  it("should return false if the array contains null values", () => {
    expect(isRecordArray([{ id: 1 }, null])).toBe(false)
    expect(isRecordArray([null, null])).toBe(false)
  })
})
