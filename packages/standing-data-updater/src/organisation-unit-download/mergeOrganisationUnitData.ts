import * as fs from "fs"
import cjsOrganisationUnitData from "../../input-data/organisation-unit/cjs-data.json"
import policeOrganisationUnitData from "../../input-data/organisation-unit/police-forces.json"
import existingOrganisationUnitData from "../../output-data/data/organisation-unit.json"
import consistentSort from "../lib/consistentSort"
import mergeOrganisationUnits from "./mergeOrganisationUnits"

export default async () => {
  const allOrganisationUnitData = cjsOrganisationUnitData.concat(policeOrganisationUnitData)
  const mergedData = mergeOrganisationUnits(allOrganisationUnitData, existingOrganisationUnitData)
  const sortedData = consistentSort(mergedData)
  await fs.promises.writeFile("output-data/data/organisation-unit.json", JSON.stringify(sortedData, null, 2))
  console.log("Organisation Unit data successfully downloaded")
}
