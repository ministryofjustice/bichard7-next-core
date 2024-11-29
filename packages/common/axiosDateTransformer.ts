import type { AxiosResponseTransformer } from "axios"

const dateFormat = /\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?Z)?/

export function dateReviver(_: string, value: unknown): Date | unknown {
  if (typeof value === "string" && dateFormat.test(value)) {
    const potentialDate = new Date(value)
    if (isValidDate(potentialDate)) {
      return potentialDate
    }
  }

  return value
}

function axiosDateTransformer(data: string): AxiosResponseTransformer {
  if (data === "") {
    return JSON.parse("{}")
  } else {
    return JSON.parse(data, dateReviver)
  }
}

function isValidDate(date: unknown): boolean {
  return date != null && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date as number)
}

export default axiosDateTransformer
