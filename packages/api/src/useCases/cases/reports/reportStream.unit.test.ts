import type { Readable } from "node:stream"

import { reportStream } from "./reportStream"

describe("reportStream", () => {
  let mockStream: Readable

  beforeEach(() => {
    mockStream = {
      destroy: jest.fn(),
      emit: jest.fn(),
      on: jest.fn().mockReturnThis(),
      once: jest.fn().mockReturnThis(),
      push: jest.fn().mockReturnValue(true),
      removeListener: jest.fn().mockReturnThis()
    } as unknown as Readable
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("should write opening bracket at the start", async () => {
    const fetchData = jest.fn(async (processBatch) => {
      await processBatch([])
    })

    await reportStream(mockStream, fetchData)

    expect(mockStream.push).toHaveBeenCalledWith("[")
  })

  it("should write closing bracket and null at the end", async () => {
    const fetchData = jest.fn(async (processBatch) => {
      await processBatch([])
    })

    await reportStream(mockStream, fetchData)

    expect(mockStream.push).toHaveBeenCalledWith("]")
    expect(mockStream.push).toHaveBeenCalledWith(null)
  })

  it("should process a single row without comma prefix", async () => {
    const testData = [{ id: 1, name: "test" }]
    const fetchData = jest.fn(async (processBatch) => {
      await processBatch(testData)
    })

    await reportStream(mockStream, fetchData)

    expect(mockStream.push).toHaveBeenCalledWith(JSON.stringify(testData[0]))
  })

  it("should process multiple rows with comma separators", async () => {
    const testData = [
      { id: 1, name: "first" },
      { id: 2, name: "second" },
      { id: 3, name: "third" }
    ]
    const fetchData = jest.fn(async (processBatch) => {
      await processBatch(testData)
    })

    await reportStream(mockStream, fetchData)

    const pushCalls = (mockStream.push as jest.Mock).mock.calls.map((call) => call[0])

    expect(pushCalls).toEqual([
      "[",
      JSON.stringify(testData[0]),
      `,${JSON.stringify(testData[1])}`,
      `,${JSON.stringify(testData[2])}`,
      "]",
      null
    ])
  })

  it("should handle multiple batches correctly", async () => {
    const batch1 = [{ id: 1 }, { id: 2 }]
    const batch2 = [{ id: 3 }, { id: 4 }]

    const fetchData = jest.fn(async (processBatch) => {
      await processBatch(batch1)
      await processBatch(batch2)
    })

    await reportStream(mockStream, fetchData)

    const pushCalls = (mockStream.push as jest.Mock).mock.calls.map((call) => call[0])

    expect(pushCalls).toEqual([
      "[",
      JSON.stringify(batch1[0]),
      `,${JSON.stringify(batch1[1])}`,
      `,${JSON.stringify(batch2[0])}`,
      `,${JSON.stringify(batch2[1])}`,
      "]",
      null
    ])
  })

  it("should handle mixed empty and non-empty batches", async () => {
    const testData = [{ id: 1 }]
    const fetchData = jest.fn(async (processBatch) => {
      await processBatch([])
      await processBatch(testData)
      await processBatch([])
    })

    await reportStream(mockStream, fetchData)

    const pushCalls = (mockStream.push as jest.Mock).mock.calls.map((call) => call[0])

    expect(pushCalls).toEqual(["[", JSON.stringify(testData[0]), "]", null])
  })

  it("should handle different data types", async () => {
    interface ComplexType {
      array: number[]
      id: number
      nested: { value: string }
    }

    const testData: ComplexType[] = [{ array: [1, 2, 3], id: 1, nested: { value: "test" } }]

    const fetchData = jest.fn(async (processBatch) => {
      await processBatch(testData)
    })

    await reportStream(mockStream, fetchData)

    expect(mockStream.push).toHaveBeenCalledWith(JSON.stringify(testData[0]))
  })

  it("should serialize objects correctly as JSON", async () => {
    const testData = [{ enabled: true, metadata: null, name: "test", value: 123 }]

    const fetchData = jest.fn(async (processBatch) => {
      await processBatch(testData)
    })

    await reportStream(mockStream, fetchData)

    expect(mockStream.push).toHaveBeenCalledWith('{"enabled":true,"metadata":null,"name":"test","value":123}')
  })

  it("should destroy stream and re-throw when fetchData fails", async () => {
    const testError = new Error("Database connection lost")
    const fetchData = jest.fn(async () => {
      throw testError
    })

    await expect(reportStream(mockStream, fetchData)).rejects.toThrow(testError)
    expect(mockStream.destroy).toHaveBeenCalledWith(testError)
    expect(mockStream.push).not.toHaveBeenCalledWith("]")
  })

  it("should respect backpressure and wait for drain", async () => {
    ;(mockStream.push as jest.Mock).mockReturnValueOnce(true).mockReturnValueOnce(false)

    const fetchData = jest.fn(async (processBatch) => {
      const batchProcessingPromise = processBatch([{ id: 1 }])

      const drainCall = (mockStream.once as jest.Mock).mock.calls.find((args) => args[0] === "drain")
      const drainHandler = drainCall[1]

      drainHandler()

      await batchProcessingPromise
    })

    await reportStream(mockStream, fetchData)

    expect(mockStream.once).toHaveBeenCalledWith("drain", expect.any(Function))
  })
})
