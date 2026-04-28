import { isValid } from "date-fns"

const dateFormat = /\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?Z)?/

export function dateReviver(_: string, value: unknown): Date | typeof value {
  if (typeof value === "string" && dateFormat.test(value)) {
    const potentialDate = new Date(value)
    if (isValid(potentialDate)) {
      return potentialDate
    }
  }

  return value
}

function dateTransformer<T>(data: string): T {
  if (data === "") {
    return {} as T
  } else {
    return JSON.parse(data, dateReviver)
  }
}

export default dateTransformer
