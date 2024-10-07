import deleteQueryParamByKeyValue from "./deleteQueryParamByKeyValue"

describe("deleteQueryParam", () => {
  it("can delete a key value pair form search queries", () => {
    const query = { defendant: "Name", type: ["exceptions", "triggers"] }

    expect(deleteQueryParamByKeyValue({ defendant: "Name" }, query).toString()).toEqual("type=exceptions&type=triggers")
  })

  it("can delete a value from an query param array", () => {
    const query = { defendant: "Name", type: ["exceptions", "triggers"] }

    expect(deleteQueryParamByKeyValue({ type: "exceptions" }, query).toString()).toEqual("defendant=Name&type=triggers")
  })

  it("can delete a value with the correct key", () => {
    const query = { defendant: "exceptions", type: ["exceptions", "triggers"] }

    expect(deleteQueryParamByKeyValue({ type: "exceptions" }, query).toString()).toEqual(
      "defendant=exceptions&type=triggers"
    )
    expect(deleteQueryParamByKeyValue({ defendant: "exceptions" }, query).toString()).toEqual(
      "type=exceptions&type=triggers"
    )
  })
})
