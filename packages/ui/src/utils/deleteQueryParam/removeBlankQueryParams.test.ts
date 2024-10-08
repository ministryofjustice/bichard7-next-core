import { URLSearchParams } from "url"
import removeBlankQueryParams from "./removeBlankQueryParams"

describe("removeBlankQueryParams", () => {
  it("will remove a blank key value pair", () => {
    const queryParams = new URLSearchParams("page=")
    const newQueryParams = removeBlankQueryParams(queryParams)

    expect(newQueryParams.toString()).toBe("")
  })

  it("will not remove a populated key value pair", () => {
    const queryParams = new URLSearchParams("page=2")
    const newQueryParams = removeBlankQueryParams(queryParams)

    expect(newQueryParams.toString()).toBe("page=2")
  })

  it("will remove a blank key value pair when it has a populated one", () => {
    const queryParams = new URLSearchParams(`page=&name="Bobby Evans"`)
    const newQueryParams = removeBlankQueryParams(queryParams)

    expect(newQueryParams.toString()).toBe(`name=%22Bobby+Evans%22`)
  })
})
