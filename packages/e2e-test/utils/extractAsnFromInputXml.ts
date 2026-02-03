import { XMLParser } from "fast-xml-parser"
import fs from "fs"

const parser = new XMLParser({ removeNSPrefix: true })

const extractAsnFromInputXml = (file: string): string => {
  const xml = fs.readFileSync(file).toString()
  const parsedXml = parser.parse(xml)

  return parsedXml.DeliverRequest.Message.ResultedCaseMessage.Session.Case.Defendant.ProsecutorReference
}

export default extractAsnFromInputXml
