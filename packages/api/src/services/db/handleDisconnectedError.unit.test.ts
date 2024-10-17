import handleDisconnectedError from "./handleDisconnectedError"

describe("handleDisconnectedError", () => {
  it("returns false if it's not an AggregateError", () => {
    const error = new Error("I'm an error")
    error.name = "Something broke"

    const result = handleDisconnectedError(error)

    expect(result).toBe(false)
  })

  it("returns false if the error doesn't have a stack", () => {
    const error = new Error("I'm an error")
    error.name = "AggregateError"
    error.stack = undefined

    const result = handleDisconnectedError(error)

    expect(result).toBe(false)
  })

  it("returns false if the error has a stack and doesn't contain anything about the DB", () => {
    const error = new Error("I'm an error")
    error.name = "AggregateError"
    error.stack = "I'm a stack trace"

    const result = handleDisconnectedError(error)

    expect(result).toBe(false)
  })

  it("returns true if the error's name is AggregateError and it mentions SQL in the stack", () => {
    const error = new Error("I'm an error")
    error.name = "AggregateError"
    error.stack = "I'm a stack trace sql something"

    const result = handleDisconnectedError(error)

    expect(result).toBe(true)
  })

  it("returns true if the error's name is AggregateError and it mentions postgres in the stack", () => {
    const error = new Error("I'm an error")
    error.name = "AggregateError"
    error.stack = "I'm a stack trace postgres something"

    const result = handleDisconnectedError(error)

    expect(result).toBe(true)
  })
})
