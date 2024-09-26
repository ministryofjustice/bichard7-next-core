import authSchema from "./authSchema"

describe("authSchema", () => {
  it("will require apiKey and bearerAuth in the security schema", () => {
    expect(authSchema).toEqual({ security: [{ apiKey: [], bearerAuth: [] }] })
  })
})
