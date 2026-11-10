import fs from "node:fs/promises"
import path from "node:path"
import { organisationUnit as existingOrganisationUnitData } from "@moj-bichard7/standing-data"
import { consistentSort } from "../lib/consistentSort"
import { mergeOrganisationUnits } from "./mergeOrganisationUnits"
import { readFile } from "../lib/readFile"
import type { OrganisationUnit } from "../types/OrganisationUnit"

export const mergeOrganisationUnitData = async () => {
  const cjsOrganisationUnitData = await readFile<OrganisationUnit[]>("../input-data/organisation-unit/cjs-data.json")
  const policeOrganisationUnitData = await readFile<OrganisationUnit[]>(
    "../input-data/organisation-unit/police-forces.json"
  )
  const allOrganisationUnitData = cjsOrganisationUnitData.concat(policeOrganisationUnitData)
  const mergedData = mergeOrganisationUnits(allOrganisationUnitData, existingOrganisationUnitData)
  const sortedData = consistentSort(mergedData)
  await fs.writeFile(
    path.resolve(__dirname, "../../../standing-data/data/organisation-unit.json"),
    JSON.stringify(sortedData, null, 2)
  )

  console.log("Organisation Unit data successfully downloaded")
}
