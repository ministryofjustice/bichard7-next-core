import fs from "fs"
import importOffenceData from "./import-pnc-data/importOffenceData"
import importOrgUnitData from "./import-pnc-data/importOrgUnitData"

type InputFiles = {
  offenceDataFile: string
  orgUnitDataFile: string
}

const getFiles = async (): Promise<InputFiles> => {
  const dirListing = await fs.promises.readdir(".")
  const offenceDataFiles = dirListing.filter((f) => /.*CJS\.xlsx/.test(f))
  const orgUnitDataFiles = dirListing.filter((f) => /.*FSCODE?\.xlsx/.test(f))
  if (offenceDataFiles.length !== 1 || orgUnitDataFiles.length !== 1) {
    throw new Error("Could not find suitable input files for PNC data")
  }

  return {
    offenceDataFile: offenceDataFiles[0],
    orgUnitDataFile: orgUnitDataFiles[0]
  }
}

const main = async () => {
  const { offenceDataFile, orgUnitDataFile } = await getFiles()
  await importOffenceData(offenceDataFile)
  await importOrgUnitData(orgUnitDataFile)
}

main()
  .then(() => console.log("PNC Data imported successfully"))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
