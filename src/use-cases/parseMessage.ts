import { XMLParser } from "fast-xml-parser"
import type { RawIncomingMessageParsedXml, ResultedCaseMessageParsedXml } from "src/types/IncomingMessage"

export default (message: string): ResultedCaseMessageParsedXml => {
  const options = {
    ignoreAttributes: false,
    removeNSPrefix: true
  }

  const parser = new XMLParser(options)
  const parsedObj = parser.parse(message) as RawIncomingMessageParsedXml
  const rcm = parsedObj.DeliverRequest.Message.ResultedCaseMessage
  if (!rcm.Session.Case.Defendant.Offence) {
    rcm.Session.Case.Defendant.Offence = []
  }
  if (!Array.isArray(rcm.Session.Case.Defendant.Offence)) {
    rcm.Session.Case.Defendant.Offence = [rcm.Session.Case.Defendant.Offence]
  }
  rcm.Session.Case.Defendant.Offence.forEach((offence) => {
    if (!offence.Result) {
      offence.Result = []
    }
    if (!Array.isArray(offence.Result)) {
      offence.Result = [offence.Result]
    }
  })
  return rcm as ResultedCaseMessageParsedXml
}
