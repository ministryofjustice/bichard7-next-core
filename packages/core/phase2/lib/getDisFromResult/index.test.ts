jest.mock("./getDisFromResult")
import getDisFromResult from "./getDisFromResult"

const mockedGetDisFromResult = (getDisFromResult as jest.Mock).mockImplementation(() => {})

describe("getDisFromResult/index", () => {
  it("should export getDisFromResult function", async () => {
    const index = (await import("./index")) as unknown as Record<string, () => {}>

    try {
      index.getDisFromResult()
    } catch {}

    expect(mockedGetDisFromResult).toHaveBeenCalledTimes(1)
  })
})
