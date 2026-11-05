import fs from "fs"
import consistentSort from "../lib/consistentSort"
import convertOffenceDataXls from "./convertOffenceDataXls"

const importOffenceData = async (file: string) => {
  console.log("Converting PNC Offence data")
  const fileContents = fs.readFileSync(file)
  const offenceCodes = convertOffenceDataXls(Buffer.from(fileContents))
  const data = consistentSort(offenceCodes)
  await fs.promises.writeFile("./input-data/offence-code/pnc-ccjs-cjs-offences.json", JSON.stringify(data, null, 2))
}

export default importOffenceData
