import path from "path"

export type IncomingMessageMetadata = {
  externalId: string
  receivedDate: Date
}

const readReceivedDateFromS3ObjectKey = (key: string): Date => {
  const segments = key.split("/")

  if (segments.length < 6) {
    throw new Error(`The object key "${key}" is in an invalid format`)
  }

  const year = Number(segments[0])

  // Subtract 1 from the month to account for the zero-based offset
  const month = Number(segments[1]) - 1

  const day = Number(segments[2])
  const hour = Number(segments[3])
  const minute = Number(segments[4])

  return new Date(year, month, day, hour, minute)
}

const parseS3Path = (s3Path: string): IncomingMessageMetadata => {
  const externalId = path.basename(s3Path).replace(".xml", "")
  const receivedDate = readReceivedDateFromS3ObjectKey(s3Path)
  return { externalId, receivedDate }
}

export default parseS3Path
