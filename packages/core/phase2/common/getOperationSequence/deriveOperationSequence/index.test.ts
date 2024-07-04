jest.mock("./deriveOperationSequence")
import deriveOperationSequence from "./deriveOperationSequence"

const mockedDeriveOperationSequence = (deriveOperationSequence as jest.Mock).mockImplementation(() => {})

describe("deriveOperationSequence/index", () => {
  it("should export deriveOperationSequence function", async () => {
    const index = (await import("./index")) as unknown as Record<string, () => {}>

    try {
      index.deriveOperationSequence()
    } catch {}

    expect(mockedDeriveOperationSequence).toHaveBeenCalledTimes(1)
  })
})
