import type { Readable } from "node:stream"

type DataFetcher<T> = (processBatch: (rows: T[]) => Promise<void>) => Promise<void>

export const reportStream = async <T>(stream: Readable, fetchData: DataFetcher<T>): Promise<void> => {
  stream.push("[")
  let isFirst = true

  try {
    await fetchData(async (rows: T[]) => {
      for (const row of rows) {
        if (!isFirst) {
          stream.push(",")
        }

        stream.push(JSON.stringify(row))
        isFirst = false
      }
    })

    stream.push("]")
    stream.push(null)
  } catch (err) {
    stream.destroy(err as Error)
  }
}
