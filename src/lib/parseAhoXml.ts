import { XMLParser } from "fast-xml-parser"
import type {
  AhoParsedXml,
  Br7Case,
  Br7CriminalProsecutionReference,
  Br7Hearing,
  Br7Offence,
  Br7OrganisationUnit,
  Br7Result
} from "src/types/AhoParsedXml"
import type {
  AnnotatedHearingOutcome,
  Case,
  CriminalProsecutionReference,
  Hearing,
  Offence,
  OrganisationUnit,
  Result
} from "src/types/AnnotatedHearingOutcome"
import type { CjsPlea } from "src/types/Plea"

const mapXmlOrganisationalUnitToAho = (xmlOrgUnit: Br7OrganisationUnit): OrganisationUnit => ({
  TopLevelCode: xmlOrgUnit["ds:TopLevelCode"],
  SecondLevelCode: xmlOrgUnit["ds:SecondLevelCode"] ?? "",
  ThirdLevelCode: xmlOrgUnit["ds:ThirdLevelCode"] ?? "",
  BottomLevelCode: xmlOrgUnit["ds:BottomLevelCode"] ?? "",
  OrganisationUnitCode: xmlOrgUnit["ds:OrganisationUnitCode"] ?? ""
})

const mapXmlResultToAho = (xmlResult: Br7Result): Result => ({
  CJSresultCode: xmlResult["ds:CJSresultCode"],
  // OffenceRemandStatus: xmlResult.
  SourceOrganisation: mapXmlOrganisationalUnitToAho(xmlResult["ds:SourceOrganisation"]),
  CourtType: xmlResult["ds:CourtType"],
  ConvictingCourt: xmlResult["br7:ConvictingCourt"],
  ResultHearingType: xmlResult["ds:ResultHearingType"]?.["#text"],
  ResultHearingDate: new Date(xmlResult["ds:ResultHearingDate"] ?? ""),
  Duration: [],
  DateSpecifiedInResult: [],
  // TimeSpecifiedInResult: xmlResult,
  // AmountSpecifiedInResult: xmlResult.
  // NumberSpecifiedInResult: xmlResult.
  // NextResultSourceOrganisation: {},
  // NextHearingType: xmlResult.
  // NextHearingDate: xmlResult.nex
  // NextHearingTime: {},
  // NextCourtType: xmlResult
  PleaStatus: xmlResult["ds:PleaStatus"]?.["#text"] as CjsPlea,
  // Verdict: xmlResult.v
  ResultVariableText: xmlResult["ds:ResultVariableText"],
  // TargetCourtType: xmlResult.
  // WarrantIssueDate: xmlResult.
  // CRESTDisposalCode: xmlResult.
  ModeOfTrialReason: xmlResult["ds:ModeOfTrialReason"]?.["#text"],
  PNCDisposalType: xmlResult["br7:PNCDisposalType"],
  // PNCAdjudicationExists: xmlResult.p
  ResultClass: xmlResult["br7:ResultClass"],
  // NumberOfOffencesTIC: xmlResult.
  // ReasonForOffenceBailConditions: xmlResult
  ResultQualifierVariable: [],
  ResultHalfLifeHours: xmlResult["ds:ResultHalfLifeHours"],
  // Urgent: {},
  ResultApplicableQualifierCode: []
  // BailCondition: xmlResult.
})

const mapXmlResultsToAho = (xmlResults: Br7Result[] | Br7Result): Result[] =>
  Array.isArray(xmlResults)
    ? xmlResults.map((xmlResult) => mapXmlResultToAho(xmlResult))
    : [mapXmlResultToAho(xmlResults)]

// const mapOffenceReasonToAho = (xmlOffenceReason: Br7OffenceReason): OffenceReason => ({
//   OffenceCode: {
//     __type: "NonMatchingOffenceCode",
//     Year: xmlOffenceReason["ds:OffenceCode"]["ds:Year"],
//     ActOrSource: xmlOffenceReason["ds:OffenceCode"]["ds:ActOrSource"],
//     Reason: String(xmlOffenceReason["ds:OffenceCode"]["ds:Reason"]),
//     FullCode: ""
//   }
// })

const mapXmlCPRToAho = (xmlCPR: Br7CriminalProsecutionReference): CriminalProsecutionReference => ({
  DefendantOrOffender: {
    Year: xmlCPR["ds:DefendantOrOffender"]["ds:Year"],
    OrganisationUnitIdentifierCode: mapXmlOrganisationalUnitToAho(
      xmlCPR["ds:DefendantOrOffender"]["ds:OrganisationUnitIdentifierCode"]
    ),
    DefendantOrOffenderSequenceNumber: xmlCPR["ds:DefendantOrOffender"]["ds:DefendantOrOffenderSequenceNumber"],
    CheckDigit: xmlCPR["ds:DefendantOrOffender"]["ds:CheckDigit"] ?? ""
  }
  // OffenceReason: mapOffenceReasonToAho(xmlCPR["ds:OffenceReason"])
})

const mapXmlOffencesToAho = (xmlOffences: Br7Offence[]): Offence[] => {
  return xmlOffences.map(
    (xmlOffence) =>
      ({
        CriminalProsecutionReference: mapXmlCPRToAho(xmlOffence["ds:CriminalProsecutionReference"]),
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
        ActualOffenceEndDate: {
          EndDate: new Date(xmlOffence["ds:ActualOffenceEndDate"]["ds:EndDate"])
        },
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
        Result: mapXmlResultsToAho(xmlOffence["br7:Result"]),
        RecordableOnPNCindicator: xmlOffence["ds:RecordableOnPNCindicator"]["#text"] === "Y",
        NotifiableToHOindicator: xmlOffence["ds:NotifiableToHOindicator"]["#text"] === "Y",
        HomeOfficeClassification: xmlOffence["ds:HomeOfficeClassification"],
        // ResultHalfLifeHours: xmlOffence.
        AddedByTheCourt: xmlOffence["br7:AddedByTheCourt"]["#text"]
      } as Offence)
  )
}

const mapXmlCaseToAho = (xmlCase: Br7Case): Case => ({
  PTIURN: xmlCase["ds:PTIURN"],
  RecordableOnPNCindicator: xmlCase["br7:RecordableOnPNCindicator"]["#text"] === "Y",
  PreChargeDecisionIndicator: xmlCase["ds:PreChargeDecisionIndicator"]["#text"] === "Y",
  ForceOwner: mapXmlOrganisationalUnitToAho(xmlCase["br7:ForceOwner"]),
  CourtReference: {
    MagistratesCourtReference: xmlCase["br7:CourtReference"]["ds:MagistratesCourtReference"]
  },
  HearingDefendant: {
    ArrestSummonsNumber: xmlCase["br7:HearingDefendant"]["br7:ArrestSummonsNumber"]["#text"],
    DefendantDetail: {
      PersonName: {
        Title: xmlCase["br7:HearingDefendant"]["br7:DefendantDetail"]["br7:PersonName"]["ds:Title"],
        GivenName:
          xmlCase["br7:HearingDefendant"]["br7:DefendantDetail"]["br7:PersonName"]["ds:GivenName"]["#text"].split(" "),
        FamilyName: xmlCase["br7:HearingDefendant"]["br7:DefendantDetail"]["br7:PersonName"]["ds:FamilyName"]["#text"]
      },
      GeneratedPNCFilename: xmlCase["br7:HearingDefendant"]["br7:DefendantDetail"]["br7:GeneratedPNCFilename"],
      BirthDate: new Date(xmlCase["br7:HearingDefendant"]["br7:DefendantDetail"]["br7:BirthDate"] ?? ""),
      Gender: String(xmlCase["br7:HearingDefendant"]["br7:DefendantDetail"]["br7:Gender"]["#text"])
    },
    Address: {
      AddressLine1: xmlCase["br7:HearingDefendant"]["br7:Address"]["ds:AddressLine1"],
      AddressLine2: xmlCase["br7:HearingDefendant"]["br7:Address"]["ds:AddressLine2"],
      AddressLine3: xmlCase["br7:HearingDefendant"]["br7:Address"]["ds:AddressLine3"]
    },
    RemandStatus: xmlCase["br7:HearingDefendant"]["br7:RemandStatus"]["#text"] ?? "",
    CourtPNCIdentifier: xmlCase["br7:HearingDefendant"]["br7:CourtPNCIdentifier"],
    BailConditions: [""],
    Offence: mapXmlOffencesToAho(xmlCase["br7:HearingDefendant"]["br7:Offence"])
  }
})

const mapXmlHearingToAho = (xmlHearing: Br7Hearing): Hearing => ({
  CourtHearingLocation: mapXmlOrganisationalUnitToAho(xmlHearing["ds:CourtHearingLocation"]),
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
  const x = mapXmlToAho(rawParsedObj)
  return x
}
