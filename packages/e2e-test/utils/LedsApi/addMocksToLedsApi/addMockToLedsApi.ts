import type { IncomingMessageParsedXml } from "@moj-bichard7/common/types/SpiResult"
import { XMLParser } from "fast-xml-parser"
import fs from "fs"
import path from "path"
import type { LedsBichard, LedsMock } from "../../../types/LedsMock"
import type { NonEmptyCourtCaseArray } from "../../../types/LedsTestApiHelper/CourtCase"
import type PersonDetails from "../../../types/LedsTestApiHelper/PersonDetails"
import type ParsedNcm from "../../../types/ParsedNcm"
import { extractAllTags } from "../../tagProcessing"
import type Bichard from "../../world"
import snapshotLedsApiData from "../snapshotLedsApiData"
import mapNcmToArrestedPerson from "./mapNcmToArrestedPerson"
import mapNcmToCourtCases from "./mapNcmToCourtCases"
import mapSpiToArrestedPerson from "./mapSpiToArrestedPerson"
import mapSpiToCourtCases from "./mapSpiToCourtCases"

type MockRequestsAndResponses = (ncmFile: string, bichard: Bichard) => LedsMock[]

const messageFilePatterns = ["pnc-data.xml", "input-message.xml", "input-message-\\d\\.xml"]
const parser = new XMLParser({ removeNSPrefix: true })

const readInputFile = (bichard: LedsBichard): ParsedNcm | IncomingMessageParsedXml => {
  const files = fs.readdirSync(bichard.specFolder)
  const filePattern = messageFilePatterns.find((pattern) => files.some((file) => new RegExp(pattern).test(file)))
  const messageFile = filePattern && files.find((file) => new RegExp(filePattern).test(file))
  if (!messageFile) {
    throw new Error("No input message files found")
  }

  const xmlData = fs.readFileSync(path.join(bichard.specFolder, messageFile), "utf8").toString()
  extractAllTags(bichard, xmlData)

  return parser.parse(xmlData) as ParsedNcm | IncomingMessageParsedXml
}

const addMockToLedsApi = async (bichard: LedsBichard): Promise<void> => {
  const mockRequestsAndResponses: MockRequestsAndResponses = (await import(`${bichard.specFolder}/mock-pnc-responses`))
    .default
  bichard.policeApi.mocks = mockRequestsAndResponses(`${bichard.specFolder}/pnc-data.xml`, bichard)

  let arrestedPerson: PersonDetails
  let courtCases: NonEmptyCourtCaseArray
  const inputXml = readInputFile(bichard)
  if ("DeliverRequest" in inputXml) {
    arrestedPerson = mapSpiToArrestedPerson(inputXml)
    courtCases = mapSpiToCourtCases(inputXml)
  } else {
    arrestedPerson = mapNcmToArrestedPerson(inputXml)
    courtCases = mapNcmToCourtCases(inputXml)
  }

  await bichard.policeApi.testApiHelper.createArrestedPersonAndDisposals(arrestedPerson, courtCases)
  if (bichard.config.policeApiSnapshot) {
    await snapshotLedsApiData(bichard, "before")
  }
}

export default addMockToLedsApi
