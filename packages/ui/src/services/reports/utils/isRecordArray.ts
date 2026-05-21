import { isRecord } from "./isRecord"

export const isRecordArray = <T extends Record<string, unknown>>(val: unknown): val is T[] => {
  return Array.isArray(val) && val.every(isRecord)
}
