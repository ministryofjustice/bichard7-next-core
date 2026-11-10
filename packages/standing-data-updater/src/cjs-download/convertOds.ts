import * as XLSX from "xlsx"
import { consistentWhitespace } from "../lib/consistentWhitespace"
import { valueToBoolean } from "../lib/valueToBoolean"
import type { OffenceCode } from "../types/OffenceCode"

export type CjsOffenceCode = {
  "CJS Offence Code": string
  "Offence Title": string
  "Offence Category Code": string
  "Custodial Indicator": string
  "Recordable On PNC Indicator": string
}

export const convertOds = (data: Buffer): OffenceCode[] => {
  const workbook = XLSX.read(data)

  if (workbook.SheetNames.length !== 1) {
    throw new Error(`Unexpected number of sheets [${workbook.SheetNames.length}] in workbook`)
  }

  const worksheet = workbook.Sheets[workbook.SheetNames[0]]
  const jsonWorksheet: CjsOffenceCode[] = XLSX.utils.sheet_to_json(worksheet)
  return jsonWorksheet
    .filter((offenceCode) => /^[a-zA-Z0-9]+$/.test(offenceCode["CJS Offence Code"]))
    .map((offenceCode) => ({
      cjsCode: offenceCode["CJS Offence Code"],
      offenceTitle: consistentWhitespace(
        offenceCode["Offence Title"]?.replace("&amp;", "&").replace("\u0019", "'").replace("\u0013", "")
      ),
      recordableOnPnc: valueToBoolean(offenceCode["Recordable On PNC Indicator"]),
      offenceCategory: offenceCode["Offence Category Code"]
    }))
}
