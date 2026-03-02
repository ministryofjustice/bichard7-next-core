import { isRecordArray } from "services/reports/utils/isRecordArray"
import type { ReportType } from "types/reports/ReportType"

const handleChunks = async (body: ReadableStream<Uint8Array<ArrayBuffer>>) => {
  const reader = body.getReader()
  const chunks: Uint8Array[] = []
  let totalLength = 0

  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }

    if (value) {
      chunks.push(value)
      totalLength += value.length
    }
  }

  const combinedChunks = new Uint8Array(totalLength)
  let offset = 0

  for (const chunk of chunks) {
    combinedChunks.set(chunk, offset)
    offset += chunk.length
  }

  return combinedChunks
}

export const downloadReport = async (reportType: ReportType, urlQuery: URLSearchParams) => {
  const query = new URLSearchParams(urlQuery.toString())
  query.set("reportType", reportType)

  const response = await fetch(`/bichard/api/reports?${query.toString()}`)

  if (!response.ok) {
    throw new Error(`Server responded with status: ${response.status}`)
  }

  if (!response.body) {
    throw new Error("No response body")
  }

  const combinedChunks = await handleChunks(response.body)

  const jsonString = new TextDecoder().decode(combinedChunks)
  const parsedData: unknown = JSON.parse(jsonString)

  if (!isRecordArray(parsedData)) {
    throw new Error("Invalid report data format received from API")
  }

  return parsedData
}
