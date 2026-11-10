import * as XLSX from "xlsx"
import { cjsCodeFilter } from "../lib/cjsCodeFilter"
import { consistentWhitespace } from "../lib/consistentWhitespace"
import { fixPoundSign } from "../lib/fixPoundSign"
import { valueToBoolean } from "../lib/valueToBoolean"
import type { OffenceCode } from "../types/OffenceCode"

export type PncOffenceCode = {
  B: string
  C: string
  F: string
}

export const convertOffenceDataXls = (fileContents: Buffer): OffenceCode[] => {
  const workbook = XLSX.read(fileContents)

  if (workbook.SheetNames.length !== 1) {
    throw new Error(`Unexpected number of sheets [${workbook.SheetNames.length}] in workbook`)
  }

  const worksheet = workbook.Sheets[workbook.SheetNames[0]]
  const jsonWorksheet: PncOffenceCode[] = XLSX.utils.sheet_to_json(worksheet, { header: "A" })

  return jsonWorksheet
    .map((offenceCode) => ({
      cjsCode: offenceCode.B?.trim(),
      offenceTitle: fixPoundSign(consistentWhitespace(offenceCode.C?.trim())),
      recordableOnPnc: valueToBoolean(offenceCode.F?.trim())
    }))
    .filter((offenceCode) => offenceCode.offenceTitle != null)
    .filter((offenceCode) => cjsCodeFilter(offenceCode.cjsCode))
}
