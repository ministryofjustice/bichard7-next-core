import type { PendingRequestResponse } from "../../../../../types/LedsTestApiHelper/Requests/LedsAsyncRequest"

const toCamelCase = (text: string): string => {
  return text.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}

const mapToResult = <T>(requestStatus: PendingRequestResponse): T => {
  const result = requestStatus.associatedValues.reduce((acc: Record<string, string>, item) => {
    acc[toCamelCase(item.type)] = item.value
    return acc
  }, {})

  requestStatus.steps
    .filter((step) => step.relatedUUID)
    .forEach(({ relatedUUID }) => {
      result[toCamelCase(relatedUUID!.type)] = relatedUUID!.uuid
    })

  return result as T
}

export default mapToResult
