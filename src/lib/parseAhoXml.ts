import { XMLParser } from "fast-xml-parser"
import type { AhoParsedXml, Br7Case, Br7Hearing, Br7Offence } from "src/types/AhoParsedXml"
import type { AnnotatedHearingOutcome, Hearing, Offence } from "src/types/AnnotatedHearingOutcome"

const mapXmlOffencesToAho = (xmlOffences: Br7Offence[]): Offence[] => {
  return xmlOffences.map(
    (xmlOffence) =>
      ({
        CriminalProsecutionReference: {},
        OffenceCategory: xmlOffence["ds:OffenceCategory"]["#text"],
        // OffenceInitiationCode: xmlOffence.
        OffenceTitle: xmlOffence["ds:OffenceTitle"],
        // SummonsCode: xmlOffence.Sum
        // Informant: xmlOffence.inform
        ArrestDate: new Date(xmlOffence["ds:ArrestDate"]),
        ChargeDate: new Date(xmlOffence["ds:ChargeDate"]),
        ActualOffenceDateCode: String(xmlOffence["ds:ActualOffenceDateCode"]["#text"]),
        ActualOffenceStartDate: {
          StartDate: new Date(xmlOffence["ds:ActualOffenceStartDate"]["ds:StartDate"])
        },
        ActualOffenceEndDate: xmlOffence["ds:ActualOffenceEndDate"],
        LocationOfOffence: xmlOffence["ds:LocationOfOffence"],
        // OffenceWelshTitle: xmlOffence
        ActualOffenceWording: xmlOffence["ds:ActualOffenceWording"],
        // ActualWelshOffenceWording: xmlOffence.
        // ActualIndictmentWording: xmlOffence.actu
        // ActualWelshIndictmentWording: xmlOffence.Actr
        // ActualStatementOfFacts: xmlOffence.actual
        // ActualWelshStatementOfFacts:
        // AlcoholLevel: alcoholLevelSchema.optional(),
        // VehicleCode:
        // VehicleRegistrationMark:
        // StartTime:
        // OffenceEndTime: xmlOffence.
        // OffenceTime: xmlOffence.Offence
        ConvictionDate: new Date(xmlOffence["ds:ConvictionDate"]),
        CommittedOnBail: xmlOffence["br7:CommittedOnBail"]["#text"],
        CourtOffenceSequenceNumber: xmlOffence["br7:CourtOffenceSequenceNumber"],
        Result: [],
        RecordableOnPNCindicator: xmlOffence["ds:RecordableOnPNCindicator"]["#text"] === "Y",
        // NotifiableToHOindicator: xmlOffence["ds:NotifiableToHOindicator"]["#text"],
        HomeOfficeClassification: xmlOffence["ds:HomeOfficeClassification"],
        // ResultHalfLifeHours: xmlOffence.Res
        AddedByTheCourt: xmlOffence["br7:AddedByTheCourt"]["#text"]
      } as Offence)
  )
}

const mapXmlCaseToAho = (xmlCase: Br7Case) => ({
  PTIURN: "",
  PreChargeDecisionIndicator: true,
  CourtReference: {
    MagistratesCourtReference: ""
  },
  HearingDefendant: {
    ArrestSummonsNumber: "",
    DefendantDetail: {
      PersonName: {
        GivenName:
          xmlCase["br7:HearingDefendant"]["br7:DefendantDetail"]["br7:PersonName"]["ds:GivenName"]["#text"].split(" "),
        FamilyName: ""
      },
      Gender: ""
    },
    Address: {
      AddressLine1: ""
    },
    RemandStatus: "",
    BailConditions: [""],
    Offence: mapXmlOffencesToAho(xmlCase["br7:HearingDefendant"]["br7:Offence"])
  }
})

const mapXmlHearingToAho = (xmlHearing: Br7Hearing): Hearing => ({
  CourtHearingLocation: {
    TopLevelCode: xmlHearing["ds:CourtHearingLocation"]["ds:TopLevelCode"],
    SecondLevelCode: xmlHearing["ds:CourtHearingLocation"]["ds:SecondLevelCode"] ?? "",
    ThirdLevelCode: xmlHearing["ds:CourtHearingLocation"]["ds:ThirdLevelCode"] ?? "",
    BottomLevelCode: xmlHearing["ds:CourtHearingLocation"]["ds:BottomLevelCode"] ?? "",
    OrganisationUnitCode: xmlHearing["ds:CourtHearingLocation"]["ds:OrganisationUnitCode"] ?? ""
  },
  DateOfHearing: new Date(xmlHearing["ds:DateOfHearing"]),
  TimeOfHearing: xmlHearing["ds:TimeOfHearing"],
  HearingLanguage: xmlHearing["ds:HearingLanguage"]["#text"] ?? "",
  HearingDocumentationLanguage: xmlHearing["ds:HearingDocumentationLanguage"]["#text"] ?? "",
  DefendantPresentAtHearing: xmlHearing["ds:DefendantPresentAtHearing"]["#text"] ?? "",
  CourtHouseCode: xmlHearing["br7:CourtHouseCode"],
  SourceReference: {
    DocumentName: xmlHearing["br7:SourceReference"]["br7:DocumentName"],
    UniqueID: xmlHearing["br7:SourceReference"]["br7:UniqueID"],
    DocumentType: xmlHearing["br7:SourceReference"]["br7:DocumentType"]
  },
  CourtType: xmlHearing["br7:CourtType"] ? xmlHearing["br7:CourtType"]["#text"] : "",
  CourtHouseName: xmlHearing["br7:CourtHouseName"]
})

const mapXmlToAho = (aho: AhoParsedXml): AnnotatedHearingOutcome => ({
  AnnotatedHearingOutcome: {
    HearingOutcome: {
      Hearing: mapXmlHearingToAho(aho["br7:AnnotatedHearingOutcome"]["br7:HearingOutcome"]["br7:Hearing"]),
      Case: mapXmlCaseToAho(aho["br7:AnnotatedHearingOutcome"]["br7:HearingOutcome"]["br7:Case"])
    }
  }
})

export default (xml: string): AnnotatedHearingOutcome => {
  const options = {
    ignoreAttributes: false,
    parseTagValue: false,
    parseAttributeValue: false
  }

  const parser = new XMLParser(options)
  const rawParsedObj = parser.parse(xml)
  return mapXmlToAho(rawParsedObj)
}
