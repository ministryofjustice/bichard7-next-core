import { XMLParser } from "fast-xml-parser"
import type {
  AnnotatedHearingOutcome,
  Case,
  CriminalProsecutionReference,
  Hearing,
  Offence,
  OffenceReason,
  OrganisationUnitCodes,
  Result
} from "src/types/AnnotatedHearingOutcome"
import { annotatedHearingOutcomeSchema } from "src/types/AnnotatedHearingOutcome"
import type { CjsPlea } from "src/types/Plea"
import type {
  Br7Case,
  Br7CriminalProsecutionReference,
  Br7Hearing,
  Br7Offence,
  Br7OffenceReason,
  Br7OrganisationUnit,
  Br7Result,
  CommonLawOffenceCode,
  IndictmentOffenceCode,
  NonMatchingOffenceCode,
  RawAho
} from "src/types/RawAho"

const mapXmlOrganisationalUnitToAho = (xmlOrgUnit: Br7OrganisationUnit): OrganisationUnitCodes => ({
  TopLevelCode: xmlOrgUnit["ds:TopLevelCode"],
  SecondLevelCode: xmlOrgUnit["ds:SecondLevelCode"] ?? "",
  ThirdLevelCode: xmlOrgUnit["ds:ThirdLevelCode"] ?? "",
  BottomLevelCode: xmlOrgUnit["ds:BottomLevelCode"] ?? "",
  OrganisationUnitCode: xmlOrgUnit["ds:OrganisationUnitCode"] ?? ""
})

const mapXmlResultToAho = (xmlResult: Br7Result): Result => ({
  CJSresultCode: Number(xmlResult["ds:CJSresultCode"]),
  // OffenceRemandStatus: xmlResult.
  SourceOrganisation: mapXmlOrganisationalUnitToAho(xmlResult["ds:SourceOrganisation"]),
  CourtType: xmlResult["ds:CourtType"],
  ConvictingCourt: xmlResult["br7:ConvictingCourt"],
  ResultHearingType: xmlResult["ds:ResultHearingType"]?.["#text"],
  ResultHearingDate: new Date(xmlResult["ds:ResultHearingDate"] ?? ""),
  Duration: [],
  DateSpecifiedInResult: [],
  // TimeSpecifiedInResult: xmlResult,
  // AmountSpecifiedInResult: xmlResult["ds:AmountSpecifiedInResult"] ? [Number(xmlResult["ds:AmountSpecifiedInResult"])] : undefined,
  // NumberSpecifiedInResult: xmlResult["ds:NumberSpecifiedInResult"],
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
  PNCDisposalType: Number(xmlResult["br7:PNCDisposalType"]),
  // PNCAdjudicationExists: xmlResult.p
  ResultClass: xmlResult["br7:ResultClass"],
  // NumberOfOffencesTIC: xmlResult.
  // ReasonForOffenceBailConditions: xmlResult
  ResultQualifierVariable: [],
  ResultHalfLifeHours: Number(xmlResult["ds:ResultHalfLifeHours"]),
  // Urgent: {},
  ResultApplicableQualifierCode: []
  // BailCondition: xmlResult.
})

const mapXmlResultsToAho = (xmlResults: Br7Result[] | Br7Result): Result[] =>
  Array.isArray(xmlResults)
    ? xmlResults.map((xmlResult) => mapXmlResultToAho(xmlResult))
    : [mapXmlResultToAho(xmlResults)]

const buildFullOffenceCode = (
  offenceCode: NonMatchingOffenceCode | CommonLawOffenceCode | IndictmentOffenceCode
): string => {
  const reason = offenceCode["ds:Reason"] ?? ""
  const qualifier = offenceCode["ds:Qualifier"] ?? ""
  return `${reason}${qualifier}`
}

const mapOffenceReasonToAho = (xmlOffenceReason: Br7OffenceReason): OffenceReason => ({
  __type: "NationalOffenceReason",
  OffenceCode: {
    __type: "NonMatchingOffenceCode",
    ActOrSource: "",
    Reason: String(xmlOffenceReason["ds:OffenceCode"]?.["ds:Reason"]),
    Qualifier: xmlOffenceReason["ds:OffenceCode"]?.["ds:Qualifier"],
    FullCode: xmlOffenceReason["ds:OffenceCode"] ? buildFullOffenceCode(xmlOffenceReason["ds:OffenceCode"]) : ""
  }
})

const mapXmlCPRToAho = (xmlCPR: Br7CriminalProsecutionReference): CriminalProsecutionReference => ({
  DefendantOrOffender: {
    Year: xmlCPR["ds:DefendantOrOffender"]["ds:Year"] ?? "",
    OrganisationUnitIdentifierCode: mapXmlOrganisationalUnitToAho(
      xmlCPR["ds:DefendantOrOffender"]["ds:OrganisationUnitIdentifierCode"]
    ),
    DefendantOrOffenderSequenceNumber: xmlCPR["ds:DefendantOrOffender"]["ds:DefendantOrOffenderSequenceNumber"] ?? "",
    CheckDigit: xmlCPR["ds:DefendantOrOffender"]["ds:CheckDigit"] ?? ""
  },
  OffenceReason: xmlCPR["ds:OffenceReason"] ? mapOffenceReasonToAho(xmlCPR["ds:OffenceReason"]) : undefined
})

const recordableOnPnc = (xmlOffence: Br7Offence): boolean | undefined => {
  if (xmlOffence["ds:RecordableOnPNCindicator"] && xmlOffence["ds:RecordableOnPNCindicator"]["#text"]) {
    return xmlOffence["ds:RecordableOnPNCindicator"]["#text"] === "Y"
  }
  return undefined
}

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
        ArrestDate: xmlOffence["ds:ArrestDate"] ? new Date(xmlOffence["ds:ArrestDate"]) : undefined,
        ChargeDate: xmlOffence["ds:ChargeDate"] ? new Date(xmlOffence["ds:ChargeDate"]) : undefined,
        ActualOffenceDateCode: String(xmlOffence["ds:ActualOffenceDateCode"]["#text"]),
        ActualOffenceStartDate: {
          StartDate: new Date(xmlOffence["ds:ActualOffenceStartDate"]["ds:StartDate"])
        },
        ActualOffenceEndDate:
          xmlOffence["ds:ActualOffenceEndDate"] && xmlOffence["ds:ActualOffenceEndDate"]["ds:EndDate"]
            ? {
                EndDate: new Date(xmlOffence["ds:ActualOffenceEndDate"]["ds:EndDate"])
              }
            : undefined,
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
        ConvictionDate: new Date(xmlOffence["ds:ConvictionDate"] ?? ""),
        CommittedOnBail: xmlOffence["br7:CommittedOnBail"]["#text"],
        CourtOffenceSequenceNumber: Number(xmlOffence["br7:CourtOffenceSequenceNumber"]),
        Result: mapXmlResultsToAho(xmlOffence["br7:Result"]),
        RecordableOnPNCindicator: recordableOnPnc(xmlOffence),
        NotifiableToHOindicator: xmlOffence["ds:NotifiableToHOindicator"]["#text"] === "Y",
        HomeOfficeClassification: xmlOffence["ds:HomeOfficeClassification"]
        // ResultHalfLifeHours: xmlOffence.
        // AddedByTheCourt: xmlOffence["br7:AddedByTheCourt"]["#text"]
      } as Offence)
  )
}

const mapXmlCaseToAho = (xmlCase: Br7Case): Case => ({
  PTIURN: xmlCase["ds:PTIURN"],
  RecordableOnPNCindicator: xmlCase["br7:RecordableOnPNCindicator"]["#text"] === "Y",
  PreChargeDecisionIndicator: xmlCase["ds:PreChargeDecisionIndicator"]["#text"] === "Y",
  ForceOwner: mapXmlOrganisationalUnitToAho(xmlCase["br7:ForceOwner"]!),
  CourtReference: {
    MagistratesCourtReference: xmlCase["br7:CourtReference"]["ds:MagistratesCourtReference"]
  },
  HearingDefendant: {
    ArrestSummonsNumber:
      typeof xmlCase["br7:HearingDefendant"]["br7:ArrestSummonsNumber"] === "string"
        ? xmlCase["br7:HearingDefendant"]["br7:ArrestSummonsNumber"]
        : xmlCase["br7:HearingDefendant"]["br7:ArrestSummonsNumber"]["#text"],
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
  CourtHouseCode: Number(xmlHearing["br7:CourtHouseCode"]),
  SourceReference: {
    DocumentName: xmlHearing["br7:SourceReference"]["br7:DocumentName"],
    UniqueID: xmlHearing["br7:SourceReference"]["br7:UniqueID"],
    DocumentType: xmlHearing["br7:SourceReference"]["br7:DocumentType"]
  },
  CourtType: xmlHearing["br7:CourtType"] ? xmlHearing["br7:CourtType"]["#text"] : "",
  CourtHouseName: xmlHearing["br7:CourtHouseName"]
})

const mapXmlToAho = (aho: RawAho): AnnotatedHearingOutcome | undefined => {
  if (aho["br7:AnnotatedHearingOutcome"]) {
    return {
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Hearing: mapXmlHearingToAho(aho["br7:AnnotatedHearingOutcome"]["br7:HearingOutcome"]["br7:Hearing"]),
          Case: mapXmlCaseToAho(aho["br7:AnnotatedHearingOutcome"]["br7:HearingOutcome"]["br7:Case"])
        }
      }
    }
  } else if (aho["br7:HearingOutcome"]) {
    return {
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Hearing: mapXmlHearingToAho(aho["br7:HearingOutcome"]["br7:Hearing"]),
          Case: mapXmlCaseToAho(aho["br7:HearingOutcome"]["br7:Case"])
        }
      }
    }
  }
}

export default (xml: string): AnnotatedHearingOutcome => {
  const options = {
    ignoreAttributes: false,
    parseTagValue: false,
    parseAttributeValue: false
  }

  const parser = new XMLParser(options)
  const rawParsedObj = parser.parse(xml)
  const legacyAho = mapXmlToAho(rawParsedObj)
  return annotatedHearingOutcomeSchema.parse(legacyAho)
}
