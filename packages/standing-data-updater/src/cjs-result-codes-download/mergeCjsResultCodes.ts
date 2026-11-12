import type { ResultCode } from "@moj-bichard7/standing-data/types/types"

export const mergeCjsResultCodes = (newData: ResultCode[], existingData: ResultCode[]): ResultCode[] => {
  newData.forEach((newItem) => {
    const existingRecord = existingData.find((existingItem) => existingItem.cjsCode.trim() === newItem.cjsCode.trim())

    if (existingRecord) {
      existingRecord.description = newItem.description
      existingRecord.recordableOnPnc = newItem.recordableOnPnc
      existingRecord.resultCodeQualifiers = newItem.resultCodeQualifiers
      existingRecord.resultHalfLifeHours = newItem.resultHalfLifeHours
      existingRecord.type = newItem.type
    } else {
      existingData.push(newItem)
    }
  })

  return existingData
}
