import type { ResultCode } from "../../output-data/types/types"

const mergeCjsResultCodes = (newData: ResultCode[], existingData: ResultCode[]): ResultCode[] => {
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

export default mergeCjsResultCodes
