import notSuccessful from "utils/notSuccessful"

describe("notSuccessful", () => {
  it("Should return the message passed to the function in the response", () => {
    const result = notSuccessful("Dummy message")

    expect(result).toStrictEqual({
      isSuccessful: false,
      ValidationException: "Dummy message"
    })
  })
})
