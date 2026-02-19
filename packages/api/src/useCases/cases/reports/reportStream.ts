import type { Readable } from "node:stream"

import { once } from "node:events"

type DataFetcher<T> = (processBatch: (rows: T[]) => Promise<void>) => Promise<void>

export const reportStream = async <T>(stream: Readable, fetchData: DataFetcher<T>): Promise<void> => {
  stream.push("[")
  let isFirst = true

  try {
    await fetchData(async (rows: T[]) => {
      for (const row of rows) {
        const chunk = isFirst ? JSON.stringify(row) : `,${JSON.stringify(row)}`

        if (!stream.push(chunk)) {
          await once(stream, "drain")
        }

        isFirst = false
      }
    })

    stream.push("]")
    stream.push(null)
  } catch (err) {
    stream.destroy(err as Error)
    throw err
  }
}
