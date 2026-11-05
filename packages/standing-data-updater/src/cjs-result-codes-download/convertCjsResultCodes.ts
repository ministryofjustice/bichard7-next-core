import * as XLSX from "xlsx"
import type { ResultCode } from "@moj-bichard7/standing-data/types/types"

export type CjsResultCode = {
  "CJS Result Code": string
  "Result Description": string
  "Result Applicable Qualifier Code": string
  "Bichard7-PNC MaxHoursPriority ": string
  "Result Type Code": string
}

const cleanValue = (value: unknown): string =>
  typeof value === "string" || typeof value === "number" ? value.toString().trim() : ""

export default (fileContents: Buffer): ResultCode[] => {
  const workbook = XLSX.read(fileContents)

  if (!workbook.SheetNames || workbook.SheetNames.length < 2) {
    throw new Error("Invalid XLSX file")
  }

  const worksheet = workbook.Sheets[workbook.SheetNames[1]]
  const jsonWorksheet: CjsResultCode[] = XLSX.utils.sheet_to_json(worksheet)

  return jsonWorksheet.map((record) => ({
    cjsCode: cleanValue(record["CJS Result Code"]),
    description: cleanValue(record["Result Description"]),
    recordableOnPnc: "", // Possibly TODO: derive this?
    resultCodeQualifiers: cleanValue(record["Result Applicable Qualifier Code"]),
    resultHalfLifeHours: cleanValue(record["Bichard7-PNC MaxHoursPriority "]),
    type: cleanValue(record["Result Type Code"])
  }))
}
