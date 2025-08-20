import type Exception from "@moj-bichard7/common/types/Exception"

const generateExceptionsNoteText = (exceptions: Exception[]): null | string => {
  if (exceptions.length === 0) {
    return null
  }

  const counts = exceptions.reduce((acc: Record<string, number>, { code }: Exception) => {
    acc[code] = (acc[code] ?? 0) + 1

    return acc
  }, {})
  const segments = Object.keys(counts)
    .sort()
    .map((code) => `${counts[code]} x ${code}`)

  return `Error codes: ${segments.join(", ")}.`
}

export default generateExceptionsNoteText
