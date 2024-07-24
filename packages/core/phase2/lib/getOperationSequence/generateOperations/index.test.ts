jest.mock("./generateOperations")
import generateOperations from "./generateOperations"

const mockedgenerateOperations = (generateOperations as jest.Mock).mockImplementation(() => {})

describe("generateOperations/index", () => {
  it("should export generateOperations function", async () => {
    const index = (await import("./index")) as unknown as Record<string, () => {}>

    try {
      index.generateOperations()
    } catch {}

    expect(mockedgenerateOperations).toHaveBeenCalledTimes(1)
  })
})
