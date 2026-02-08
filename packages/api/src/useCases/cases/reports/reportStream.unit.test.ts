import { Readable } from "node:stream"

import { reportStream } from "./reportStream"

describe("reportStream", () => {
  let mockStream: Readable

  beforeEach(() => {
    mockStream = new Readable({
      read() {}
    })
    jest.spyOn(mockStream, "push")
    jest.spyOn(mockStream, "destroy")
  })

  afterEach(() => {
    jest.restoreAllMocks()
    mockStream.removeAllListeners()
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
    expect(mockStream.push).not.toHaveBeenCalledWith(",")
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
      ",",
      JSON.stringify(testData[1]),
      ",",
      JSON.stringify(testData[2]),
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
      ",",
      JSON.stringify(batch1[1]),
      ",",
      JSON.stringify(batch2[0]),
      ",",
      JSON.stringify(batch2[1]),
      "]",
      null
    ])
  })

  it("should handle empty batches", async () => {
    const fetchData = jest.fn(async (processBatch) => {
      await processBatch([])
      await processBatch([])
    })

    await reportStream(mockStream, fetchData)

    const pushCalls = (mockStream.push as jest.Mock).mock.calls.map((call) => call[0])

    expect(pushCalls).toEqual(["[", "]", null])
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

  it("should destroy stream with error when fetchData throws", async () => {
    const testError = new Error("Fetch failed")
    const fetchData = jest.fn(async () => {
      throw testError
    })

    // Attach error handler before calling reportStream
    const errorPromise = new Promise((resolve) => {
      mockStream.on("error", resolve)
    })

    await reportStream(mockStream, fetchData)

    // Wait for error event to be emitted
    await errorPromise

    expect(mockStream.destroy).toHaveBeenCalledWith(testError)
    expect(mockStream.push).not.toHaveBeenCalledWith("]")
    expect(mockStream.push).not.toHaveBeenCalledWith(null)
  })

  it("should destroy stream with error when processBatch throws", async () => {
    const testError = new Error("Process failed")
    const fetchData = jest.fn(async (processBatch) => {
      await processBatch([{ id: 1 }])
      throw testError
    })

    // Attach error handler before calling reportStream
    const errorPromise = new Promise((resolve) => {
      mockStream.on("error", resolve)
    })

    await reportStream(mockStream, fetchData)

    // Wait for error event to be emitted
    await errorPromise

    expect(mockStream.destroy).toHaveBeenCalledWith(testError)
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
})
