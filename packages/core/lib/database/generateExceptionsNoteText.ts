import type Exception from "@moj-bichard7/core/phase1/types/Exception"

const generateExceptionsNoteText = (exceptions: Exception[]): string | null => {
  if (exceptions.length === 0) {
    return null
  }
  const counts = exceptions.reduce((acc: Record<string, number>, e: Exception) => {
    if (!acc[e.code]) {
      acc[e.code] = 0
    }
    acc[e.code] += 1
    return acc
  }, {})
  const segments = Object.keys(counts)
    .sort()
    .map((code) => `${counts[code]} x ${code}`)
  return `Error codes: ${segments.join(", ")}.`
}

export default generateExceptionsNoteText
