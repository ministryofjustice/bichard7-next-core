import createOperation from "./createOperation"

describe("createOperation", () => {
  it("should return an operation with status NotAttempted", () => {
    const operation = createOperation("APPHRD", { courtCaseReference: "123" })

    expect(operation).toStrictEqual({
      code: "APPHRD",
      data: {
        courtCaseReference: "123"
      },
      status: "NotAttempted"
    })
  })
})
