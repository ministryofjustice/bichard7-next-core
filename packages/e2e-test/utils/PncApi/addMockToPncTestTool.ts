import fs from "fs"
import path from "path"
import type PncHelper from "../../types/PncHelper"
import type { PncBichard } from "../../types/PncMock"
import { isError } from "../isError"
import { extractAllTags } from "../tagProcessing"

const messageFilePatterns = ["pnc-data.xml", "input-message.xml", "input-message-\\d\\.xml"]

const addMockToPncTestTool = async (
  bichard: PncBichard,
  pncHelper: PncHelper,
  skipPncValidation: boolean
): Promise<void> => {
  if (skipPncValidation) {
    return
  }

  const files = fs.readdirSync(bichard.specFolder)
  const filePattern = messageFilePatterns.find((pattern) => files.some((file) => new RegExp(pattern).test(file)))
  const messageFile = filePattern && files.find((file) => new RegExp(filePattern).test(file))
  if (!messageFile) {
    throw new Error("No input message files found")
  }

  const xmlData = fs.readFileSync(path.join(bichard.specFolder, messageFile), "utf8").toString()
  extractAllTags(bichard, xmlData)

  const recordResult = await pncHelper.setupRecord().catch((error: Error) => error)
  if (isError(recordResult)) {
    if (recordResult.message === "PNC record does not match expected before state") {
      return
    }

    console.error(recordResult.message)
    throw recordResult
  }
}

export default addMockToPncTestTool
