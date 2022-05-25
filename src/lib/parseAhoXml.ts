import { XMLParser } from "fast-xml-parser"
import type { AhoParsedXml } from "src/types/AhoParsedXml"
import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"

const mapXmlToAho = (xml: AhoParsedXml): AnnotatedHearingOutcome => ({
  AnnotatedHearingOutcome: {
    HearingOutcome: {
      Hearing: {
        CourtHearingLocation: {
          SecondLevelCode: "",
          ThirdLevelCode: "",
          BottomLevelCode: "",
          OrganisationUnitCode: ""
        },
        DateOfHearing: new Date(),
        TimeOfHearing: "",
        HearingLanguage: "",
        HearingDocumentationLanguage: "",
        DefendantPresentAtHearing: "",
        CourtHouseCode: 0,
        SourceReference: {
          DocumentName: "",
          UniqueID: "",
          DocumentType: ""
        }
      },
      Case: {
        PTIURN: "",
        PreChargeDecisionIndicator: true,
        CourtReference: {
          MagistratesCourtReference: ""
        },
        HearingDefendant: {
          ArrestSummonsNumber: "",
          DefendantDetail: {
            PersonName: {
              GivenName: [],
              FamilyName: ""
            },
            Gender: ""
          },
          Address: {
            AddressLine1: ""
          },
          RemandStatus: "",
          BailConditions: [""],
          Offence: [
            // TODO: Offence
          ]
        }
      }
    }
  }
})

export default (xml: string): AnnotatedHearingOutcome => {
  const options = {
    ignoreAttributes: false,
    removeNSPrefix: true
  }

  const parser = new XMLParser(options)
  const rawParsedObj = parser.parse(xml) as AhoParsedXml
  return rawParsedObj as AhoParsedXml
  // return incomingMessageParsedXmlSchema.parse(rawParsedObj)
}
