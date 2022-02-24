import { XMLParser } from "fast-xml-parser"
import type { ResultedCaseMessageParsedXml } from "src/types/IncomingMessage"
import { incomingMessageParsedXmlSchema } from "src/types/IncomingMessage"

export default (message: string): ResultedCaseMessageParsedXml => {
  const options = {
    ignoreAttributes: false,
    removeNSPrefix: true
  }

  const parser = new XMLParser(options)
  const rawParsedObj = parser.parse(message) as unknown
  const parsedObj = incomingMessageParsedXmlSchema.parse(rawParsedObj)
  const rcm = parsedObj.DeliverRequest.Message.ResultedCaseMessage
  // if (!rcm.Session.Case.Defendant.Offence) {
  //   rcm.Session.Case.Defendant.Offence = []
  // }
  // if (!Array.isArray(rcm.Session.Case.Defendant.Offence)) {
  //   rcm.Session.Case.Defendant.Offence = [rcm.Session.Case.Defendant.Offence]
  // }
  // rcm.Session.Case.Defendant.Offence.forEach((offence) => {
  //   if (!offence.Result) {
  //     offence.Result = []
  //   }
  //   if (!Array.isArray(offence.Result)) {
  //     offence.Result = [offence.Result]
  //   }
  // })
  return rcm
}
