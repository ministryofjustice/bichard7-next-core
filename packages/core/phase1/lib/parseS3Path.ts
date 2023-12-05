import { isError, type Result } from "@moj-bichard7/common/types/Result"
import path from "path"

export type IncomingMessageMetadata = {
  externalId: string
  receivedDate: Date
}

const readReceivedDateFromS3ObjectKey = (key: string): Result<Date> => {
  const segments = key.split("/")

  if (segments.length < 6) {
    return new Error(`The object key "${key}" is in an invalid format`)
  }

  const iso = `${segments[0]}-${segments[1]}-${segments[2]}T${segments[3]}:${segments[4]}:00Z`
  return new Date(iso)
}

const parseS3Path = (s3Path: string): Result<IncomingMessageMetadata> => {
  const externalId = path.basename(s3Path).replace(".xml", "")
  const receivedDate = readReceivedDateFromS3ObjectKey(s3Path)
  if (isError(receivedDate)) {
    return receivedDate
  }

  return { externalId, receivedDate }
}

export default parseS3Path
