import { XMLParser } from "fast-xml-parser"
import type {
  AnnotatedHearingOutcome,
  Case,
  CriminalProsecutionReference,
  Duration,
  Hearing,
  Offence,
  OffenceReason,
  OrganisationUnitCodes,
  Result,
  ResultQualifierVariable
} from "src/types/AnnotatedHearingOutcome"
import { annotatedHearingOutcomeSchema } from "src/types/AnnotatedHearingOutcome"
import type { CjsPlea } from "src/types/Plea"
import type {
  Br7Case,
  Br7CriminalProsecutionReference,
  Br7Duration,
  Br7Hearing,
  Br7Offence,
  Br7OffenceReason,
  Br7OrganisationUnit,
  Br7Result,
  Br7ResultQualifierVariable,
  Br7TypeTextString,
  CommonLawOffenceCode,
  IndictmentOffenceCode,
  NonMatchingOffenceCode,
  RawAho
} from "src/types/RawAho"
import mapXmlCxe01ToAho from "./mapXmlCxe01ToAho"

const mapXmlOrganisationalUnitToAho = (xmlOrgUnit: Br7OrganisationUnit): OrganisationUnitCodes => ({
  TopLevelCode: xmlOrgUnit["ds:TopLevelCode"],
  SecondLevelCode: xmlOrgUnit["ds:SecondLevelCode"] ?? "",
  ThirdLevelCode: xmlOrgUnit["ds:ThirdLevelCode"] ?? "",
  BottomLevelCode: xmlOrgUnit["ds:BottomLevelCode"] ?? "",
  OrganisationUnitCode: xmlOrgUnit["ds:OrganisationUnitCode"] ?? ""
})

const mapAmountSpecifiedInResult = (
  result: Br7TypeTextString | Br7TypeTextString[] | undefined
): number[] | undefined => {
  if (!result) {
    return undefined
  }
  const resultArray = Array.isArray(result) ? result : [result]

  return resultArray.map((amount) => Number(amount["#text"]))
}

const mapDuration = (duration: Br7Duration | Br7Duration[] | undefined): Duration[] => {
  if (!duration) {
    return []
  }
  const durationArray = Array.isArray(duration) ? duration : [duration]
  return durationArray.map((d) => ({
    DurationType: d["ds:DurationType"],
    DurationUnit: d["ds:DurationUnit"],
    DurationLength: Number(d["ds:DurationLength"])
  }))
}

const mapXmlResultQualifierVariableTOAho = (
  rqv: Br7ResultQualifierVariable | Br7ResultQualifierVariable[] | undefined
): ResultQualifierVariable[] => {
  if (!rqv) {
    return []
  }
  const rqvArray = Array.isArray(rqv) ? rqv : [rqv]
  return rqvArray.map((r) => ({ Code: r["ds:Code"] }))
}

const mapBailCondition = (bailCondition: string | string[] | undefined): string[] => {
  if (!bailCondition) {
    return []
  }
  return Array.isArray(bailCondition) ? bailCondition : [bailCondition]
}

const mapXmlResultToAho = (xmlResult: Br7Result): Result => ({
  CJSresultCode: Number(xmlResult["ds:CJSresultCode"]),
  OffenceRemandStatus: xmlResult["ds:OffenceRemandStatus"] ? xmlResult["ds:OffenceRemandStatus"]["#text"] : undefined,
  SourceOrganisation: mapXmlOrganisationalUnitToAho(xmlResult["ds:SourceOrganisation"]),
  CourtType: xmlResult["ds:CourtType"],
  ConvictingCourt: xmlResult["br7:ConvictingCourt"],
  ResultHearingType: xmlResult["ds:ResultHearingType"]?.["#text"],
  ResultHearingDate: new Date(xmlResult["ds:ResultHearingDate"] ?? ""),
  BailCondition: mapBailCondition(xmlResult["ds:BailCondition"]),
  NextResultSourceOrganisation: xmlResult["ds:NextResultSourceOrganisation"]
    ? {
        TopLevelCode: xmlResult["ds:NextResultSourceOrganisation"]["ds:TopLevelCode"],
        SecondLevelCode: xmlResult["ds:NextResultSourceOrganisation"]["ds:SecondLevelCode"],
        ThirdLevelCode: xmlResult["ds:NextResultSourceOrganisation"]["ds:ThirdLevelCode"],
        BottomLevelCode: xmlResult["ds:NextResultSourceOrganisation"]["ds:BottomLevelCode"],
        OrganisationUnitCode: xmlResult["ds:NextResultSourceOrganisation"]["ds:OrganisationUnitCode"]
      }
    : undefined,
  Duration: mapDuration(xmlResult["ds:Duration"]),
  DateSpecifiedInResult: [],
  // TimeSpecifiedInResult: xmlResult,
  AmountSpecifiedInResult: mapAmountSpecifiedInResult(xmlResult["ds:AmountSpecifiedInResult"]),
  // NumberSpecifiedInResult: xmlResult["ds:NumberSpecifiedInResult"],
  NextCourtType: xmlResult["ds:NextCourtType"],
  NextHearingDate: xmlResult["ds:NextHearingDate"] ? new Date(xmlResult["ds:NextHearingDate"]) : undefined,
  NextHearingTime: xmlResult["ds:NextHearingTime"],
  PleaStatus: xmlResult["ds:PleaStatus"]?.["#text"] as CjsPlea,
  Verdict: xmlResult["ds:Verdict"]?.["#text"],
  ResultVariableText: xmlResult["ds:ResultVariableText"],
  WarrantIssueDate: xmlResult["ds:WarrantIssueDate"] ? new Date(xmlResult["ds:WarrantIssueDate"]) : undefined,
  // TargetCourtType: xmlResult.
  // CRESTDisposalCode: xmlResult.
  ModeOfTrialReason: xmlResult["ds:ModeOfTrialReason"]?.["#text"],
  PNCDisposalType: xmlResult["br7:PNCDisposalType"] ? Number(xmlResult["br7:PNCDisposalType"]) : undefined,
  PNCAdjudicationExists: xmlResult["br7:PNCAdjudicationExists"]
    ? xmlResult["br7:PNCAdjudicationExists"]["#text"] === "Y"
    : undefined,
  ResultClass: xmlResult["br7:ResultClass"],
  ReasonForOffenceBailConditions: xmlResult["br7:ReasonForOffenceBailConditions"],
  Urgent: xmlResult["br7:Urgent"]
    ? {
        urgent: xmlResult["br7:Urgent"]["br7:urgent"]["#text"] === "Y",
        urgency: Number(xmlResult["br7:Urgent"]["br7:urgency"])
      }
    : undefined,
  // NumberOfOffencesTIC: xmlResult.
  // ReasonForOffenceBailConditions: xmlResult
  ResultQualifierVariable: mapXmlResultQualifierVariableTOAho(xmlResult["br7:ResultQualifierVariable"]),
  ResultHalfLifeHours: xmlResult["ds:ResultHalfLifeHours"] ? Number(xmlResult["ds:ResultHalfLifeHours"]) : undefined,
  ResultApplicableQualifierCode: []
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

const mapOffenceReasonToAho = (xmlOffenceReason: Br7OffenceReason): OffenceReason => {
  if (xmlOffenceReason["ds:LocalOffenceCode"]) {
    return {
      __type: "LocalOffenceReason",
      LocalOffenceCode: {
        AreaCode: xmlOffenceReason["ds:LocalOffenceCode"]["ds:AreaCode"],
        OffenceCode: xmlOffenceReason["ds:LocalOffenceCode"]["ds:OffenceCode"]["#text"] ?? ""
      }
    }
  }
  if (xmlOffenceReason["ds:OffenceCode"]) {
    const code = xmlOffenceReason["ds:OffenceCode"]
    if ("ds:CommonLawOffence" in code) {
      return {
        __type: "NationalOffenceReason",
        OffenceCode: {
          __type: "CommonLawOffenceCode",
          CommonLawOffence: code["ds:CommonLawOffence"],
          Reason: code["ds:Reason"],
          Qualifier: code["ds:Qualifier"],
          FullCode: code ? buildFullOffenceCode(code) : ""
        }
      }
    } else if ("ds:ActOrSource" in code) {
      return {
        __type: "NationalOffenceReason",
        OffenceCode: {
          __type: "NonMatchingOffenceCode",
          ActOrSource: code["ds:ActOrSource"],
          Year: code["ds:Year"],
          Reason: String(code?.["ds:Reason"]),
          Qualifier: code?.["ds:Qualifier"],
          FullCode: code ? buildFullOffenceCode(code) : ""
        }
      }
    } else {
      return {
        __type: "NationalOffenceReason",
        OffenceCode: {
          __type: "IndictmentOffenceCode",
          Indictment: "",
          Reason: String(code?.["ds:Reason"]),
          Qualifier: code?.["ds:Qualifier"],
          FullCode: code ? buildFullOffenceCode(code) : ""
        }
      }
    }
  }
  throw new Error("Offence Reason Missing from XML")
}

const mapXmlCPRToAho = (xmlCPR: Br7CriminalProsecutionReference): CriminalProsecutionReference => ({
  DefendantOrOffender: {
    Year: xmlCPR["ds:DefendantOrOffender"]["ds:Year"] ?? "",
    OrganisationUnitIdentifierCode: mapXmlOrganisationalUnitToAho(
      xmlCPR["ds:DefendantOrOffender"]["ds:OrganisationUnitIdentifierCode"]
    ),
    DefendantOrOffenderSequenceNumber: xmlCPR["ds:DefendantOrOffender"]["ds:DefendantOrOffenderSequenceNumber"] ?? "",
    CheckDigit: xmlCPR["ds:DefendantOrOffender"]["ds:CheckDigit"] ?? ""
  },
  OffenceReason: xmlCPR["ds:OffenceReason"] ? mapOffenceReasonToAho(xmlCPR["ds:OffenceReason"]) : undefined,
  OffenceReasonSequence: xmlCPR["ds:OffenceReasonSequence"] ? Number(xmlCPR["ds:OffenceReasonSequence"]) : undefined
})

const offenceRecordableOnPnc = (xmlOffence: Br7Offence): boolean | undefined => {
  if (xmlOffence["ds:RecordableOnPNCindicator"] && xmlOffence["ds:RecordableOnPNCindicator"]["#text"]) {
    return xmlOffence["ds:RecordableOnPNCindicator"]["#text"] === "Y"
  }
  return undefined
}

const caseRecordableOnPnc = (xmlCase: Br7Case): boolean | undefined => {
  if (xmlCase["br7:RecordableOnPNCindicator"] && xmlCase["br7:RecordableOnPNCindicator"]["#text"]) {
    return xmlCase["br7:RecordableOnPNCindicator"]["#text"] === "Y"
  }
  return undefined
}

const mapXmlOffencesToAho = (xmlOffences: Br7Offence[] | Br7Offence): Offence[] => {
  const offences: Br7Offence[] = Array.isArray(xmlOffences) ? xmlOffences : [xmlOffences]
  return offences.map(
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
        AlcoholLevel: xmlOffence["ds:AlcoholLevel"]
          ? {
              Amount: xmlOffence["ds:AlcoholLevel"]["ds:Amount"],
              Method: xmlOffence["ds:AlcoholLevel"]["ds:Method"]["#text"]
            }
          : undefined,
        // VehicleCode:
        // VehicleRegistrationMark:
        // StartTime:
        // OffenceEndTime: xmlOffence.
        // OffenceTime: xmlOffence.Offence
        ConvictionDate: xmlOffence["ds:ConvictionDate"] ? new Date(xmlOffence["ds:ConvictionDate"]) : undefined,
        CommittedOnBail: xmlOffence["br7:CommittedOnBail"]["#text"],
        CourtOffenceSequenceNumber: Number(xmlOffence["br7:CourtOffenceSequenceNumber"]),
        ManualSequenceNumber: xmlOffence["br7:ManualSequenceNo"]
          ? xmlOffence["br7:ManualSequenceNo"]["#text"] === "Y"
          : undefined,
        AddedByTheCourt: xmlOffence["br7:AddedByTheCourt"]
          ? xmlOffence["br7:AddedByTheCourt"]["#text"] === "Y"
          : undefined,
        CourtCaseReferenceNumber: xmlOffence["br7:CourtCaseReferenceNumber"],
        Result: mapXmlResultsToAho(xmlOffence["br7:Result"]),
        RecordableOnPNCindicator: offenceRecordableOnPnc(xmlOffence),
        NotifiableToHOindicator: xmlOffence["ds:NotifiableToHOindicator"]["#text"] === "Y",
        HomeOfficeClassification: xmlOffence["ds:HomeOfficeClassification"]
        // ResultHalfLifeHours: xmlOffence.
      } as Offence)
  )
}

const mapXmlCaseToAho = (xmlCase: Br7Case): Case => ({
  PTIURN: xmlCase["ds:PTIURN"],
  RecordableOnPNCindicator: caseRecordableOnPnc(xmlCase),
  Urgent: xmlCase["br7:Urgent"]
    ? {
        urgent: xmlCase["br7:Urgent"]["br7:urgent"]["#text"] === "Y",
        urgency: Number(xmlCase["br7:Urgent"]["br7:urgency"])
      }
    : undefined,
  PreChargeDecisionIndicator: xmlCase["ds:PreChargeDecisionIndicator"]["#text"] === "Y",
  ForceOwner: mapXmlOrganisationalUnitToAho(xmlCase["br7:ForceOwner"]!),
  CourtCaseReferenceNumber: xmlCase["ds:CourtCaseReferenceNumber"],
  CourtReference: {
    MagistratesCourtReference: xmlCase["br7:CourtReference"]["ds:MagistratesCourtReference"]
  },
  PenaltyNoticeCaseReferenceNumber: xmlCase["br7:PenaltyNoticeCaseReference"],
  HearingDefendant: {
    ArrestSummonsNumber:
      typeof xmlCase["br7:HearingDefendant"]["br7:ArrestSummonsNumber"] === "string"
        ? xmlCase["br7:HearingDefendant"]["br7:ArrestSummonsNumber"]
        : xmlCase["br7:HearingDefendant"]["br7:ArrestSummonsNumber"]["#text"],
    PNCIdentifier: xmlCase["br7:HearingDefendant"]["br7:PNCIdentifier"],
    PNCCheckname: xmlCase["br7:HearingDefendant"]["br7:PNCCheckname"],
    DefendantDetail: {
      PersonName: {
        Title: xmlCase["br7:HearingDefendant"]["br7:DefendantDetail"]["br7:PersonName"]["ds:Title"],
        GivenName:
          xmlCase["br7:HearingDefendant"]["br7:DefendantDetail"]["br7:PersonName"]["ds:GivenName"]["#text"].split(" "),
        FamilyName: xmlCase["br7:HearingDefendant"]["br7:DefendantDetail"]["br7:PersonName"]["ds:FamilyName"]["#text"]
      },
      GeneratedPNCFilename: xmlCase["br7:HearingDefendant"]["br7:DefendantDetail"]["br7:GeneratedPNCFilename"],
      BirthDate: xmlCase["br7:HearingDefendant"]["br7:DefendantDetail"]["br7:BirthDate"]
        ? new Date(xmlCase["br7:HearingDefendant"]["br7:DefendantDetail"]["br7:BirthDate"])
        : undefined,
      Gender: Number(xmlCase["br7:HearingDefendant"]["br7:DefendantDetail"]["br7:Gender"]["#text"])
    },
    Address: {
      AddressLine1: xmlCase["br7:HearingDefendant"]["br7:Address"]["ds:AddressLine1"],
      AddressLine2: xmlCase["br7:HearingDefendant"]["br7:Address"]["ds:AddressLine2"],
      AddressLine3: xmlCase["br7:HearingDefendant"]["br7:Address"]["ds:AddressLine3"]
    },
    RemandStatus: xmlCase["br7:HearingDefendant"]["br7:RemandStatus"]["#text"] ?? "",
    CourtPNCIdentifier: xmlCase["br7:HearingDefendant"]["br7:CourtPNCIdentifier"],
    BailConditions: mapBailCondition(xmlCase["br7:HearingDefendant"]["br7:BailConditions"]),
    ReasonForBailConditions: xmlCase["br7:HearingDefendant"]["br7:ReasonForBailConditions"],
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
  const rootElement = aho["br7:AnnotatedHearingOutcome"] ? aho["br7:AnnotatedHearingOutcome"] : aho
  if (!rootElement["br7:HearingOutcome"]) {
    return
  }

  return {
    AnnotatedHearingOutcome: {
      HearingOutcome: {
        Hearing: mapXmlHearingToAho(rootElement["br7:HearingOutcome"]["br7:Hearing"]),
        Case: mapXmlCaseToAho(rootElement["br7:HearingOutcome"]["br7:Case"])
      }
    },
    PncQuery: mapXmlCxe01ToAho(aho["br7:AnnotatedHearingOutcome"]?.CXE01),
    PncQueryDate: aho["br7:AnnotatedHearingOutcome"]?.["br7:PNCQueryDate"]
      ? new Date(aho["br7:AnnotatedHearingOutcome"]?.["br7:PNCQueryDate"])
      : undefined
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
