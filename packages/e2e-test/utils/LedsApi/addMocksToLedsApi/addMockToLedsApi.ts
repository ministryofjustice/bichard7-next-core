import { XMLParser } from "fast-xml-parser"
import fs from "fs"
import path from "path"
import type { LedsBichard, LedsMock } from "../../../types/LedsMock"
import type ParsedNcm from "../../../types/ParsedNcm"
import { extractAllTags } from "../../tagProcessing"
import type Bichard from "../../world"
import mapNcmToArrestedPerson from "./mapNcmToArrestedPerson"
import mapNcmToCourtCases from "./mapNcmToCourtCases"

type MockRequestsAndResponses = (ncmFile: string, bichard: Bichard) => LedsMock[]

const messageFilePatterns = ["pnc-data.xml", "input-message.xml", "input-message-\\d\\.xml"]
const parser = new XMLParser()

const readNcmFile = (bichard: LedsBichard): ParsedNcm => {
  const files = fs.readdirSync(bichard.specFolder)
  const filePattern = messageFilePatterns.find((pattern) => files.some((file) => new RegExp(pattern).test(file)))
  const messageFile = filePattern && files.find((file) => new RegExp(filePattern).test(file))
  if (!messageFile) {
    throw new Error("No input message files found")
  }

  const xmlData = fs.readFileSync(path.join(bichard.specFolder, messageFile), "utf8").toString()
  extractAllTags(bichard, xmlData)

  return parser.parse(xmlData) as ParsedNcm
}

const addMockToLedsApi = async (bichard: LedsBichard): Promise<void> => {
  const mockRequestsAndResponses: MockRequestsAndResponses = (await import(`${bichard.specFolder}/mock-pnc-responses`))
    .default
  bichard.policeApi.mocks = mockRequestsAndResponses(`${bichard.specFolder}/pnc-data.xml`, bichard)

  const ncm = readNcmFile(bichard)
  const arrestedPerson = mapNcmToArrestedPerson(ncm)
  const courtCases = mapNcmToCourtCases(ncm)

  await bichard.policeApi.ledsTestApiHelper.createArrestedPersonAndDisposals(arrestedPerson, courtCases)
}

export default addMockToLedsApi
