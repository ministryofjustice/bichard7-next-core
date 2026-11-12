import fs from "node:fs/promises"
import { consistentSort } from "../lib/consistentSort"
import { convertOrgUnitDataXls } from "./convertOrgUnitDataXls"

export const importOrgUnitData = async (file: string) => {
  console.log("Converting PNC Org Unit data")

  const fileContents = await fs.readFile(file)
  const policeOrgUnits = convertOrgUnitDataXls(fileContents)
  const sortedData = consistentSort(policeOrgUnits)

  await fs.writeFile("input-data/organisation-unit/police-forces.json", JSON.stringify(sortedData, null, 2))
}
