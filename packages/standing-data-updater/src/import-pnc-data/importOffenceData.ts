import fs from "node:fs/promises"
import { consistentSort } from "../lib/consistentSort"
import { convertOffenceDataXls } from "./convertOffenceDataXls"

export const importOffenceData = async (file: string) => {
  console.log("Converting PNC Offence data")

  const fileContents = await fs.readFile(file)
  const offenceCodes = convertOffenceDataXls(Buffer.from(fileContents))
  const data = consistentSort(offenceCodes)
  await fs.writeFile("./input-data/offence-code/pnc-ccjs-cjs-offences.json", JSON.stringify(data, null, 2))
}
