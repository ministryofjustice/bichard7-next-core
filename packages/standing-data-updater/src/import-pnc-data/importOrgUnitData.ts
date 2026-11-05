import fs from "fs"
import consistentSort from "../lib/consistentSort"
import convertOrgUnitDataXls from "./convertOrgUnitDataXls"

const importOrgUnitData = async (file: string) => {
  console.log("Converting PNC Org Unit data")
  const fileContents = fs.readFileSync(file)
  const policeOrgUnits = convertOrgUnitDataXls(fileContents)
  const sortedData = consistentSort(policeOrgUnits)

  await fs.promises.writeFile("input-data/organisation-unit/police-forces.json", JSON.stringify(sortedData, null, 2))
}

export default importOrgUnitData
