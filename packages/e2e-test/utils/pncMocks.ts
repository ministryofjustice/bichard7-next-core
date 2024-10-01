import { XMLParser } from "fast-xml-parser"
import fs from "fs"
import { extractAllTags, replaceAllTags } from "./tagProcessing"
import type Bichard from "./world"

const parser = new XMLParser()

type ParsedNCMOffence = {
  BaseOffenceDetails: {
    OffenceCode: string
    OffenceSequenceNumber: number
    OffenceTiming: {
      OffenceStart: {
        OffenceDateStartDate: string
      }
      OffenceEnd: {
        OffenceEndDate: string
      }
    }
  }
}

type ParsedNCM = {
  NewCaseMessage: {
    Case: {
      Defendant: {
        ProsecutorReference: string
        PoliceIndividualDefendant: {
          PersonDefendant: {
            BasePersonDetails: {
              PersonName: {
                PersonFamilyName: string
              }
            }
          }
        }
        Offence: ParsedNCMOffence | ParsedNCMOffence[]
      }
      PTIURN: string
    }
  }
}

const reformatDate = (input: string) => {
  const res = input.match(/(\d{4})-(\d{2})-(\d{2})/)
  if (!res) {
    throw new Error("Error reformatting Date")
  }

  return `${res[3]}${res[2]}${res[1]}`.padEnd(12, "0")
}

const extractDates = (offence: ParsedNCMOffence) => {
  const startDate = reformatDate(offence.BaseOffenceDetails.OffenceTiming.OffenceStart.OffenceDateStartDate)
  let endDate

  if (
    offence.BaseOffenceDetails.OffenceTiming.OffenceEnd &&
    offence.BaseOffenceDetails.OffenceTiming.OffenceEnd.OffenceEndDate
  ) {
    endDate = reformatDate(offence.BaseOffenceDetails.OffenceTiming.OffenceEnd.OffenceEndDate)
  } else {
    endDate = "            "
  }

  return { startDate, endDate }
}

type pncMockOptions = {
  matchRegex?: string
  expectedRequest?: string
  count?: number
}

export const mockEnquiryFromNCM = (ncmFile: string, world: Bichard, options: pncMockOptions = {}) => {
  let xmlData = fs.readFileSync(ncmFile, "utf8").toString()
  extractAllTags(world, xmlData)
  if (world.config.parallel) {
    xmlData = replaceAllTags(world, xmlData)
  }

  const parsed = parser.parse(xmlData) as ParsedNCM
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
    matchRegex: options.matchRegex || "CXE01",
    response,
    expectedRequest: options.expectedRequest || "",
    count: options.count || null
  }
}

export const dummyUpdate = {
  matchRegex: "CXU",
  response: '<?XML VERSION="1.0" STANDALONE="YES"?><DUMMY></DUMMY>',
  expectedRequest: ""
}

export const mockUpdate = (code: string, options: pncMockOptions = {}) => {
  const response = `<?XML VERSION="1.0" STANDALONE="YES"?>
    <${code}>
      <GMH>073GENL000001RNEWREMPNCA05A73000017300000120210415154673000001                                             09000${
        Math.floor(Math.random() * 8999) + 1000
      }</GMH>
      <TXT>A0031-REMAND REPORT HAS BEEN PROCESSED SUCCESSFULLY - ID: 00/263503N </TXT>
      <GMT>000003073GENL000001S</GMT>
    </${code}>`

  return {
    matchRegex: options.matchRegex || code,
    response,
    expectedRequest: options.expectedRequest || "",
    count: options.count || null
  }
}
