import fs from "fs"
import getDownloadUrl from "../cjs-download/getDownloadUrl"
import consistentSort from "../lib/consistentSort"
import downloadFile from "../lib/downloadFile"
import generateCourtOrganisationUnits from "./generateCourtOrganisationUnits"

const downloadCjsOuCodes = async () => {
  console.log("Downloading CJS Organisation Unit data")
  const downloadLinkRegex = /(https:\/\/.*cjs.courts.bc.ou.codes.*\.xlsx?)"/i
  const downloadURL = await getDownloadUrl(downloadLinkRegex)
  const fileContents = await downloadFile(downloadURL)
  const courtOrganisationUnitData = generateCourtOrganisationUnits(fileContents)
  const sortedData = consistentSort(courtOrganisationUnitData)
  await fs.promises.writeFile("input-data/organisation-unit/cjs-data.json", JSON.stringify(sortedData, null, 2))
  console.log("CJS Organisation Unit data successfully downloaded")
}

export default downloadCjsOuCodes
