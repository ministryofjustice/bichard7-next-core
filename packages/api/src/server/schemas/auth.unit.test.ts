import auth from "./auth"

describe("auth", () => {
  it("will require apiKey and bearerAuth in the security schema", () => {
    expect(auth).toEqual({ security: [{ apiKey: [], bearerAuth: [] }] })
  })
})
