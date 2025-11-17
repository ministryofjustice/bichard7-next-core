import { XMLParser } from "fast-xml-parser"
import fs from "fs"
import type ParsedNcm from "../../../types/ParsedNcm"
import type { PartialPncMock, PncBichard, PncMockOptions } from "../../../types/PncMock"
import { extractAllTags, replaceAllTags } from "../../tagProcessing"
import extractDates from "../extractDates"

const parser = new XMLParser()

export const generateEnquiryFromNcm = (
  bichard: PncBichard,
  ncmFile: string,
  options?: PncMockOptions
): PartialPncMock => {
  let xmlData = fs.readFileSync(ncmFile, "utf8").toString()
  extractAllTags(bichard, xmlData)
  if (bichard.config.parallel) {
    xmlData = replaceAllTags(bichard, xmlData)
  }

  const parsed = parser.parse(xmlData) as ParsedNcm
  const prosecutorRef = parsed.NewCaseMessage.Case.Defendant.ProsecutorReference.slice(-7)
  const personFamilyName =
    parsed.NewCaseMessage.Case.Defendant.PoliceIndividualDefendant.PersonDefendant.BasePersonDetails.PersonName.PersonFamilyName.substr(
      0,
      12
    ).padEnd(12, " ")
  const offenceEl = parsed.NewCaseMessage.Case.Defendant.Offence
  const offenceData = Array.isArray(offenceEl) ? offenceEl : [offenceEl]
  const offences = offenceData.map((offence) => ({
    code: offence.BaseOffenceDetails.OffenceCode.padEnd(8, " "),
    sequenceNo: offence.BaseOffenceDetails.OffenceSequenceNumber.toString().padStart(3, "0"),
    ...extractDates(offence)
  }))
  const forceStationCode = parsed.NewCaseMessage.Case.PTIURN.substr(0, 4)

  const cofString = offences
    .map(
      (offence) =>
        `<COF>K${offence.sequenceNo}    12:15:24:1   ${offence.code}${offence.startDate}${offence.endDate}</COF>`
    )
    .join("\n")

  const response = `<?XML VERSION="1.0" STANDALONE="YES"?>
          <CXE01>
            <GMH>073ENQR000020SENQASIPNCA05A73000017300000120210316152773000001                                             050001772</GMH>
            <ASI>
              <FSC>K${forceStationCode}</FSC>
              <IDS>K00/${prosecutorRef} ${personFamilyName}            </IDS>
              <CCR>K97/1626/8395Q                 </CCR>
              ${cofString}
            </ASI>
            <GMT>000008073ENQR004540S</GMT>
          </CXE01>`

  return {
    matchRegex: options?.matchRegex || "CXE01",
    response,
    expectedRequest: options?.expectedRequest || "",
    count: options?.count || undefined
  }
}
