jest.mock("./createDisposalByResult")
import createDisposalByResult from "./createDisposalByResult"

const mockedCreateDisposalByResult = (createDisposalByResult as jest.Mock).mockImplementation(() => {})

describe("createDisposalByResult/index", () => {
  it("should export createDisposalByResult function", async () => {
    const index = (await import("./index")) as unknown as Record<string, () => {}>

    try {
      index.createDisposalByResult()
    } catch {}

    expect(mockedCreateDisposalByResult).toHaveBeenCalledTimes(1)
  })
})
