import type { Result } from "@moj-bichard7/common/types/Result"
import logger from "@moj-bichard7/common/utils/logger"
import crypto from "crypto"
import { XMLParser } from "fast-xml-parser"
import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"
import { incomingMessageSchema } from "../../schemas/incomingMessage"
import { fullResultedCaseMessageParsedXmlSchema } from "../../schemas/spiResult"
import populateCase from "./populateCase"
import populateHearing from "./populateHearing"

type TransformedOutput = {
  aho: AnnotatedHearingOutcome
  messageHash: string
  systemId: string
}

const generateHash = (text: string) => crypto.createHash("sha256").update(text, "utf-8").digest("hex")

const transformIncomingMessageToAho = (incomingMessage: string): Result<TransformedOutput> => {
  const options = {
    ignoreAttributes: true,
    removeNSPrefix: true,
    parseTagValue: false,
    trimValues: true,
    processEntities: false
  }

  const parser = new XMLParser(options)
  const rawParsedObj = parser.parse(incomingMessage) as unknown
  const parsedMessage = incomingMessageSchema.safeParse(rawParsedObj)

  if (!parsedMessage.success) {
    logger.error(parsedMessage)
    return new Error("Error parsing incoming message")
  }

  const routeData = parsedMessage.data.RouteData
  const systemId = routeData.RequestFromSystem.SourceID
  const convertedXml = routeData.DataStream.DataStreamContent.replace(/&lt;/g, "<").replace(/&gt;/g, ">")
  const messageHash = generateHash(convertedXml)

  const parsedResultedCaseMessage = parser.parse(convertedXml) as unknown
  const resultedCaseMessage = fullResultedCaseMessageParsedXmlSchema.safeParse(parsedResultedCaseMessage)

  if (!resultedCaseMessage.success) {
    logger.error(resultedCaseMessage)
    return new Error("Error parsing incoming message datastream element")
  }

  const aho = {
    AnnotatedHearingOutcome: {
      HearingOutcome: {
        Hearing: populateHearing(
          routeData.RequestFromSystem.CorrelationID,
          resultedCaseMessage.data.ResultedCaseMessage
        ),
        Case: populateCase(resultedCaseMessage.data.ResultedCaseMessage)
      }
    },
    Exceptions: []
  }

  return { aho, messageHash, systemId }
}

export default transformIncomingMessageToAho
