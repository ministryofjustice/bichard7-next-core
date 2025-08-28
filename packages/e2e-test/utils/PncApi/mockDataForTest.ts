import fs from "fs"
import path from "path"
import type PncHelper from "../../types/PncHelper"
import { extractAllTags } from "../tagProcessing"
import type Bichard from "../world"
import addMockToPncEmulator from "./addMockToPncEmulator"

const mockDataForTest = async (
  bichard: Bichard,
  pncHelper: PncHelper,
  skipPNCValidation: boolean
): Promise<"pending" | undefined> => {
  const featureUri = bichard.featureUri
  const specFolder = path.dirname(`${process.cwd()}/${featureUri}`)
  if (!bichard.config.realPNC) {
    await addMockToPncEmulator(bichard, pncHelper, specFolder)
    return
  }

  let xmlData
  const ncmFile = `${specFolder}/pnc-data.xml`
  const messageFile = `${specFolder}/input-message.xml`
  if (fs.existsSync(ncmFile)) {
    xmlData = fs.readFileSync(ncmFile, "utf8").toString()
  } else if (fs.existsSync(messageFile)) {
    xmlData = fs.readFileSync(messageFile, "utf8").toString()
  } else {
    const messageFiles = fs.readdirSync(specFolder).filter((f) => f.match(/input-message-\d\.xml/))
    if (messageFiles.length === 0) {
      throw new Error("No input message files found")
    }

    xmlData = fs.readFileSync(`${specFolder}/${messageFiles[0]}`, "utf8").toString()
  }

  extractAllTags(bichard, xmlData)
  if (skipPNCValidation) {
    return
  }

  try {
    await pncHelper.setupRecord(specFolder)
  } catch (err) {
    if (!(err instanceof Error)) {
      throw new Error("Problem handling error from PNC Emulator")
    }

    if (err.message === "PNC record does not match expected before state") {
      return "pending"
    }

    console.error(err.message)
    throw err
  }
}

export default mockDataForTest
