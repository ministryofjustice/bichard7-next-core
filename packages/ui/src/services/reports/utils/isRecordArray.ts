import { isRecord } from "./isRecord"

export const isRecordArray = (val: unknown): val is Record<string, unknown>[] =>
  Array.isArray(val) && val.every(isRecord)
