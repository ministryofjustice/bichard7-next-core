import deleteQueryParamsByKey from "./deleteQueryParamsByKey"

describe("deleteQueryParams", () => {
  let query: URLSearchParams
  let expectedQuery: URLSearchParams
  beforeEach(() => {
    query = new URLSearchParams()
    query.append("defendant", "Name")
    query.append("type", "exeptions")
    query.append("type", "triggers")

    expectedQuery = new URLSearchParams()
  })
  it("can delete a named parameter from search queries", () => {
    expectedQuery.append("type", "exeptions")
    expectedQuery.append("type", "triggers")
    expect(deleteQueryParamsByKey(["defendant"], query)).toStrictEqual(expectedQuery)
  })

  it("Should not modify query when deleting a parameter that does not exist", () => {
    expect(deleteQueryParamsByKey(["invalid key"], query)).toStrictEqual(query)
  })

  it("Should delete a named parameter with multiple values", () => {
    expectedQuery.append("defendant", "Name")
    expect(deleteQueryParamsByKey(["type"], query)).toStrictEqual(expectedQuery)
  })

  it("Should delete multiple named parameters", () => {
    expect(deleteQueryParamsByKey(["type", "defendant"], query)).toStrictEqual(expectedQuery)
  })
})
