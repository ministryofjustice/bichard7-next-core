import { XMLParser } from "fast-xml-parser"
import decimalPlaces from "../../lib/decimalPlaces"
import { decodeEntitiesProcessor } from "../../lib/encoding"
import extractExceptionsFromAho from "../../parse/parseAhoXml/extractExceptionsFromAho"
import mapXmlCxe01ToAho from "../../parse/parseAhoXml/mapXmlCxe01ToAho"
import type {
  AhoXml,
  Br7Case,
  Br7CriminalProsecutionReference,
  Br7Duration,
  Br7ErrorString,
  Br7Hearing,
  Br7NameSequenceTextString,
  Br7Offence,
  Br7OffenceReason,
  Br7OrganisationUnit,
  Br7Result,
  Br7ResultQualifierVariable,
  Br7SequenceTextString,
  Br7TextString,
  Br7TypeTextString,
  CommonLawOffenceCode,
  IndictmentOffenceCode,
  NonMatchingOffenceCode
} from "../../types/AhoXml"
import type {
  AmountSpecifiedInResult,
  AnnotatedHearingOutcome,
  Case,
  CriminalProsecutionReference,
  DateSpecifiedInResult,
  Duration,
  Hearing,
  NumberSpecifiedInResult,
  Offence,
  OffenceReason,
  OrganisationUnitCodes,
  Result,
  ResultQualifierVariable
} from "../../types/AnnotatedHearingOutcome"
import type { CjsPlea } from "../../types/Plea"
import type ResultClass from "../../types/ResultClass"

const mapXmlOrganisationalUnitToAho = (xmlOrgUnit: Br7OrganisationUnit): OrganisationUnitCodes => ({
  TopLevelCode: xmlOrgUnit["ds:TopLevelCode"]?.["#text"],
  SecondLevelCode: xmlOrgUnit["ds:SecondLevelCode"]["#text"] ?? "",
  ThirdLevelCode: xmlOrgUnit["ds:ThirdLevelCode"]["#text"] ?? "",
  BottomLevelCode: xmlOrgUnit["ds:BottomLevelCode"]["#text"] ?? "",
  OrganisationUnitCode: xmlOrgUnit["ds:OrganisationUnitCode"]["#text"] ?? ""
})

const mapAmountSpecifiedInResult = (
  result: Br7TypeTextString | Br7TypeTextString[] | undefined
): AmountSpecifiedInResult[] | undefined => {
  if (!result) {
    return undefined
  }
  const resultArray = Array.isArray(result) ? result : [result]

  return resultArray.map((amount) => ({
    Amount: Number(amount["#text"]),
    DecimalPlaces: decimalPlaces(amount["#text"]),
    Type: amount["@_Type"]
  }))
}

const mapNumberSpecifiedInResult = (
  input: Br7TypeTextString | Br7TypeTextString[] | undefined
): NumberSpecifiedInResult[] | undefined => {
  if (!input) {
    return undefined
  }
  const inputArray = Array.isArray(input) ? input : [input]

  return inputArray.map((amount) => ({ Number: Number(amount["#text"]), Type: amount["@_Type"] }))
}

const mapDateSpecifiedInResult = (
  input: Br7SequenceTextString | Br7SequenceTextString[] | undefined
): DateSpecifiedInResult[] | undefined => {
  if (!input) {
    return undefined
  }
  const inputArray = Array.isArray(input) ? input : [input]

  return inputArray.map((el) => ({ Date: new Date(el["#text"]), Sequence: Number(el?.["@_Sequence"]) }))
}

const mapDuration = (duration: Br7Duration | Br7Duration[] | undefined): Duration[] => {
  if (!duration) {
    return []
  }
  const durationArray = Array.isArray(duration) ? duration : [duration]
  return durationArray.map((d) => ({
    DurationType: d["ds:DurationType"]["#text"],
    DurationUnit: d["ds:DurationUnit"]["#text"],
    DurationLength: Number(d["ds:DurationLength"]["#text"])
  }))
}

const mapXmlResultQualifierVariableTOAho = (
  rqv: Br7ResultQualifierVariable | Br7ResultQualifierVariable[] | undefined
): ResultQualifierVariable[] => {
  if (!rqv) {
    return []
  }
  const rqvArray = Array.isArray(rqv) ? rqv : [rqv]
  return rqvArray.map((r) => ({ Code: r["ds:Code"]["#text"] }))
}

const mapBailCondition = (bailCondition: Br7TextString | Br7TextString[] | undefined): string[] => {
  if (!bailCondition) {
    return []
  }
  const allBailConditions = Array.isArray(bailCondition) ? bailCondition : [bailCondition]
  return allBailConditions.map((bc) => bc["#text"])
}

const parseDateOrFallbackToString = (input: string | undefined): Date | string | undefined => {
  if (!input) {
    return undefined
  }

  const parsedDate = new Date(input)
  if (isNaN(parsedDate.getTime())) {
    return input
  }

  return parsedDate
}

const mapXmlResultToAho = (xmlResult: Br7Result): Result => ({
  CJSresultCode: Number(xmlResult["ds:CJSresultCode"]["#text"]),
  OffenceRemandStatus: xmlResult["ds:OffenceRemandStatus"] ? xmlResult["ds:OffenceRemandStatus"]["#text"] : undefined,
  SourceOrganisation: mapXmlOrganisationalUnitToAho(xmlResult["ds:SourceOrganisation"]),
  CourtType: xmlResult["ds:CourtType"]?.["#text"],
  ConvictingCourt: xmlResult["br7:ConvictingCourt"]?.["#text"],
  ResultHearingType: xmlResult["ds:ResultHearingType"]?.["#text"],
  ResultHearingDate: new Date(xmlResult["ds:ResultHearingDate"]?.["#text"] ?? ""),
  BailCondition: mapBailCondition(xmlResult["ds:BailCondition"]),
  NextResultSourceOrganisation: xmlResult["ds:NextResultSourceOrganisation"]
    ? {
        TopLevelCode: xmlResult["ds:NextResultSourceOrganisation"]["ds:TopLevelCode"]?.["#text"],
        SecondLevelCode: xmlResult["ds:NextResultSourceOrganisation"]["ds:SecondLevelCode"]["#text"],
        ThirdLevelCode: xmlResult["ds:NextResultSourceOrganisation"]["ds:ThirdLevelCode"]["#text"],
        BottomLevelCode: xmlResult["ds:NextResultSourceOrganisation"]["ds:BottomLevelCode"]["#text"],
        OrganisationUnitCode: xmlResult["ds:NextResultSourceOrganisation"]["ds:OrganisationUnitCode"]["#text"]
      }
    : undefined,
  Duration: mapDuration(xmlResult["ds:Duration"]),
  DateSpecifiedInResult: mapDateSpecifiedInResult(xmlResult["ds:DateSpecifiedInResult"]),
  // TimeSpecifiedInResult: xmlResult,
  AmountSpecifiedInResult: mapAmountSpecifiedInResult(xmlResult["ds:AmountSpecifiedInResult"]),
  NumberSpecifiedInResult: mapNumberSpecifiedInResult(xmlResult["ds:NumberSpecifiedInResult"]),
  NextCourtType: xmlResult["ds:NextCourtType"]?.["#text"],
  NextHearingDate: parseDateOrFallbackToString(xmlResult["ds:NextHearingDate"]?.["#text"]),
  NextHearingTime: xmlResult["ds:NextHearingTime"]?.["#text"],
  PleaStatus: xmlResult["ds:PleaStatus"]?.["#text"] as CjsPlea,
  Verdict: xmlResult["ds:Verdict"]?.["#text"],
  ResultVariableText: xmlResult["ds:ResultVariableText"]?.["#text"],
  WarrantIssueDate: xmlResult["ds:WarrantIssueDate"] ? new Date(xmlResult["ds:WarrantIssueDate"]["#text"]) : undefined,
  // TargetCourtType: xmlResult.
  // CRESTDisposalCode: xmlResult.
  ModeOfTrialReason: xmlResult["ds:ModeOfTrialReason"]?.["#text"],
  PNCDisposalType: xmlResult["br7:PNCDisposalType"] ? Number(xmlResult["br7:PNCDisposalType"]["#text"]) : undefined,
  PNCAdjudicationExists: xmlResult["br7:PNCAdjudicationExists"]
    ? xmlResult["br7:PNCAdjudicationExists"]["#text"] === "Y"
    : undefined,
  ResultClass: xmlResult["br7:ResultClass"]?.["#text"] as ResultClass,
  ReasonForOffenceBailConditions: xmlResult["br7:ReasonForOffenceBailConditions"]?.["#text"],
  Urgent: xmlResult["br7:Urgent"]
    ? {
        urgent: xmlResult["br7:Urgent"]["br7:urgent"]["#text"] === "Y",
        urgency: Number(xmlResult["br7:Urgent"]["br7:urgency"]["#text"])
      }
    : undefined,
  NumberOfOffencesTIC: xmlResult["br7:NumberOfOffencesTIC"]?.["#text"]
    ? Number(xmlResult["br7:NumberOfOffencesTIC"]["#text"])
    : undefined,
  ResultQualifierVariable: mapXmlResultQualifierVariableTOAho(xmlResult["br7:ResultQualifierVariable"]),
  ResultHalfLifeHours: xmlResult["ds:ResultHalfLifeHours"]
    ? Number(xmlResult["ds:ResultHalfLifeHours"]["#text"])
    : undefined,
  ResultApplicableQualifierCode: []
})

const mapXmlResultsToAho = (xmlResults: Br7Result[] | Br7Result): Result[] =>
  Array.isArray(xmlResults)
    ? xmlResults.map((xmlResult) => mapXmlResultToAho(xmlResult))
    : [mapXmlResultToAho(xmlResults)]

const buildFullOffenceCode = (
  offenceCode: NonMatchingOffenceCode | CommonLawOffenceCode | IndictmentOffenceCode
): string => {
  const actOrSource = "ds:ActOrSource" in offenceCode ? offenceCode["ds:ActOrSource"]?.["#text"] : ""
  const coml = "ds:CommonLawOffence" in offenceCode ? offenceCode["ds:CommonLawOffence"]["#text"] : ""
  const year = "ds:Year" in offenceCode ? offenceCode["ds:Year"]?.["#text"] : ""
  const reason = offenceCode["ds:Reason"]["#text"] ?? ""
  const qualifier = offenceCode["ds:Qualifier"]?.["#text"] ?? ""
  return `${actOrSource}${coml}${year}${reason}${qualifier}`
}

const mapOffenceReasonToAho = (xmlOffenceReason: Br7OffenceReason): OffenceReason => {
  if (xmlOffenceReason["ds:LocalOffenceCode"]) {
    return {
      __type: "LocalOffenceReason",
      LocalOffenceCode: {
        AreaCode: xmlOffenceReason["ds:LocalOffenceCode"]["ds:AreaCode"]["#text"],
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
          CommonLawOffence: code["ds:CommonLawOffence"]["#text"],
          Reason: code["ds:Reason"]["#text"],
          Qualifier: code["ds:Qualifier"]?.["#text"],
          FullCode: code ? buildFullOffenceCode(code) : ""
        }
      }
    } else if ("ds:ActOrSource" in code) {
      return {
        __type: "NationalOffenceReason",
        OffenceCode: {
          __type: "NonMatchingOffenceCode",
          ActOrSource: code["ds:ActOrSource"]["#text"],
          Year: code["ds:Year"]?.["#text"],
          Reason: code?.["ds:Reason"]["#text"],
          Qualifier: code?.["ds:Qualifier"]?.["#text"],
          FullCode: code ? buildFullOffenceCode(code) : ""
        }
      }
    } else {
      return {
        __type: "NationalOffenceReason",
        OffenceCode: {
          __type: "IndictmentOffenceCode",
          Indictment: "",
          Reason: code?.["ds:Reason"]["#text"],
          Qualifier: code?.["ds:Qualifier"]?.["#text"],
          FullCode: code ? buildFullOffenceCode(code) : ""
        }
      }
    }
  }
  throw new Error("Offence Reason Missing from XML")
}

const mapOffenceReasonSequence = (node: Br7ErrorString | undefined): string | null | undefined => {
  if (node?.["#text"]) {
    return node["#text"]
  }
  if (node?.["@_Error"]) {
    return null
  }
  return undefined
}

const mapXmlCPRToAho = (xmlCPR: Br7CriminalProsecutionReference): CriminalProsecutionReference => ({
  DefendantOrOffender: {
    Year: xmlCPR["ds:DefendantOrOffender"]["ds:Year"]?.["#text"] ?? "",
    OrganisationUnitIdentifierCode: mapXmlOrganisationalUnitToAho(
      xmlCPR["ds:DefendantOrOffender"]["ds:OrganisationUnitIdentifierCode"]
    ),
    DefendantOrOffenderSequenceNumber:
      xmlCPR["ds:DefendantOrOffender"]["ds:DefendantOrOffenderSequenceNumber"]?.["#text"] ?? "",
    CheckDigit: xmlCPR["ds:DefendantOrOffender"]["ds:CheckDigit"]?.["#text"] ?? ""
  },
  OffenceReason: xmlCPR["ds:OffenceReason"] ? mapOffenceReasonToAho(xmlCPR["ds:OffenceReason"]) : undefined,
  OffenceReasonSequence: mapOffenceReasonSequence(xmlCPR["ds:OffenceReasonSequence"])
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

const mapCourtCaseReferenceNumber = (element: Br7TextString | undefined): string | undefined | null => {
  if (element === undefined) {
    return undefined
  }
  const value = element["#text"]
  if (value === "") {
    return null
  }
  return value
}

const mapXmlOffencesToAho = (xmlOffences: Br7Offence[] | Br7Offence): Offence[] => {
  if (!xmlOffences) {
    return []
  }

  const offences: Br7Offence[] = Array.isArray(xmlOffences) ? xmlOffences : [xmlOffences]
  return offences.map((xmlOffence) => ({
    CriminalProsecutionReference: mapXmlCPRToAho(xmlOffence["ds:CriminalProsecutionReference"]),
    OffenceCategory: xmlOffence["ds:OffenceCategory"]?.["#text"],
    OffenceTitle: xmlOffence["ds:OffenceTitle"]?.["#text"],
    ArrestDate: xmlOffence["ds:ArrestDate"] ? new Date(xmlOffence["ds:ArrestDate"]["#text"]) : undefined,
    ChargeDate: xmlOffence["ds:ChargeDate"] ? new Date(xmlOffence["ds:ChargeDate"]["#text"]) : undefined,
    ActualOffenceDateCode: String(xmlOffence["ds:ActualOffenceDateCode"]["#text"]),
    ActualOffenceStartDate: {
      StartDate: new Date(xmlOffence["ds:ActualOffenceStartDate"]["ds:StartDate"]["#text"])
    },
    ActualOffenceEndDate:
      xmlOffence["ds:ActualOffenceEndDate"] && xmlOffence["ds:ActualOffenceEndDate"]["ds:EndDate"]?.["#text"]
        ? {
            EndDate: new Date(xmlOffence["ds:ActualOffenceEndDate"]["ds:EndDate"]["#text"])
          }
        : undefined,
    LocationOfOffence: xmlOffence["ds:LocationOfOffence"]?.["#text"],
    ActualOffenceWording: xmlOffence["ds:ActualOffenceWording"]["#text"],
    AlcoholLevel: xmlOffence["ds:AlcoholLevel"]
      ? {
          Amount: Number(xmlOffence["ds:AlcoholLevel"]["ds:Amount"]["#text"]),
          Method: xmlOffence["ds:AlcoholLevel"]["ds:Method"]["#text"]
        }
      : undefined,
    ConvictionDate: xmlOffence["ds:ConvictionDate"] ? new Date(xmlOffence["ds:ConvictionDate"]["#text"]) : undefined,
    CommittedOnBail: xmlOffence["br7:CommittedOnBail"]["#text"],
    CourtOffenceSequenceNumber: Number(xmlOffence["br7:CourtOffenceSequenceNumber"]["#text"]),
    ManualSequenceNumber: xmlOffence["br7:ManualSequenceNo"]
      ? xmlOffence["br7:ManualSequenceNo"]["#text"] === "Y"
      : undefined,
    AddedByTheCourt: xmlOffence["br7:AddedByTheCourt"] ? xmlOffence["br7:AddedByTheCourt"]["#text"] === "Y" : undefined,
    ManualCourtCaseReference: xmlOffence["br7:ManualCourtCaseReference"]
      ? xmlOffence["br7:ManualCourtCaseReference"]?.["#text"] === "Y"
      : undefined,
    CourtCaseReferenceNumber: mapCourtCaseReferenceNumber(xmlOffence["br7:CourtCaseReferenceNumber"]),
    Result: mapXmlResultsToAho(xmlOffence["br7:Result"]),
    RecordableOnPNCindicator: offenceRecordableOnPnc(xmlOffence),
    NotifiableToHOindicator: xmlOffence["ds:NotifiableToHOindicator"]
      ? xmlOffence["ds:NotifiableToHOindicator"]["#text"] === "Y"
      : undefined,
    HomeOfficeClassification: xmlOffence["ds:HomeOfficeClassification"]?.["#text"]
    // ResultHalfLifeHours: xmlOffence.
  }))
}

const getGivenNames = (
  givenName: Br7NameSequenceTextString | Br7NameSequenceTextString[] | undefined
): string[] | undefined => {
  if (!givenName) {
    return undefined
  }

  return Array.isArray(givenName) ? givenName.map((x) => x["#text"]) : [givenName["#text"]]
}

const mapXmlCaseToAho = (xmlCase: Br7Case): Case => ({
  PTIURN: xmlCase["ds:PTIURN"]["#text"],
  RecordableOnPNCindicator: caseRecordableOnPnc(xmlCase),
  Urgent: xmlCase["br7:Urgent"]
    ? {
        urgent: xmlCase["br7:Urgent"]["br7:urgent"]["#text"] === "Y",
        urgency: Number(xmlCase["br7:Urgent"]["br7:urgency"]["#text"])
      }
    : undefined,
  PreChargeDecisionIndicator: xmlCase["ds:PreChargeDecisionIndicator"]["#text"] === "Y",
  ForceOwner: xmlCase["br7:ForceOwner"] ? mapXmlOrganisationalUnitToAho(xmlCase["br7:ForceOwner"]) : undefined,
  CourtCaseReferenceNumber: xmlCase["ds:CourtCaseReferenceNumber"]?.["#text"],
  CourtReference: {
    MagistratesCourtReference: xmlCase["br7:CourtReference"]["ds:MagistratesCourtReference"]["#text"]
  },
  PenaltyNoticeCaseReferenceNumber: xmlCase["br7:PenaltyNoticeCaseReference"]?.["#text"],
  HearingDefendant: {
    ArrestSummonsNumber: xmlCase["br7:HearingDefendant"]["br7:ArrestSummonsNumber"]["#text"],
    PNCIdentifier: xmlCase["br7:HearingDefendant"]["br7:PNCIdentifier"]?.["#text"],
    PNCCheckname: xmlCase["br7:HearingDefendant"]["br7:PNCCheckname"]?.["#text"],
    OrganisationName: xmlCase["br7:HearingDefendant"]["br7:OrganisationName"]?.["#text"],
    DefendantDetail: xmlCase["br7:HearingDefendant"]["br7:DefendantDetail"]
      ? {
          PersonName: {
            Title: xmlCase["br7:HearingDefendant"]["br7:DefendantDetail"]["br7:PersonName"]["ds:Title"]?.["#text"],
            GivenName: getGivenNames(
              xmlCase["br7:HearingDefendant"]["br7:DefendantDetail"]["br7:PersonName"]["ds:GivenName"]
            ),
            FamilyName:
              xmlCase["br7:HearingDefendant"]["br7:DefendantDetail"]["br7:PersonName"]["ds:FamilyName"]["#text"]
          },
          GeneratedPNCFilename:
            xmlCase["br7:HearingDefendant"]["br7:DefendantDetail"]["br7:GeneratedPNCFilename"]?.["#text"],
          BirthDate: xmlCase["br7:HearingDefendant"]["br7:DefendantDetail"]["br7:BirthDate"]
            ? new Date(xmlCase["br7:HearingDefendant"]["br7:DefendantDetail"]["br7:BirthDate"]["#text"])
            : undefined,
          Gender: Number(xmlCase["br7:HearingDefendant"]["br7:DefendantDetail"]["br7:Gender"]["#text"])
        }
      : undefined,
    Address: {
      AddressLine1: xmlCase["br7:HearingDefendant"]["br7:Address"]["ds:AddressLine1"]["#text"],
      AddressLine2: xmlCase["br7:HearingDefendant"]["br7:Address"]["ds:AddressLine2"]?.["#text"],
      AddressLine3: xmlCase["br7:HearingDefendant"]["br7:Address"]["ds:AddressLine3"]?.["#text"],
      AddressLine4: xmlCase["br7:HearingDefendant"]["br7:Address"]["ds:AddressLine4"]?.["#text"],
      AddressLine5: xmlCase["br7:HearingDefendant"]["br7:Address"]["ds:AddressLine5"]?.["#text"]
    },
    RemandStatus: xmlCase["br7:HearingDefendant"]["br7:RemandStatus"]["#text"],
    CourtPNCIdentifier: xmlCase["br7:HearingDefendant"]["br7:CourtPNCIdentifier"]?.["#text"],
    BailConditions: mapBailCondition(xmlCase["br7:HearingDefendant"]["br7:BailConditions"]),
    ReasonForBailConditions: xmlCase["br7:HearingDefendant"]["br7:ReasonForBailConditions"]?.["#text"],
    Offence: mapXmlOffencesToAho(xmlCase["br7:HearingDefendant"]["br7:Offence"])
  },
  ManualForceOwner: xmlCase["br7:ManualForceOwner"]?.["#text"] ? true : undefined
})

const mapXmlHearingToAho = (xmlHearing: Br7Hearing): Hearing => ({
  CourtHearingLocation: mapXmlOrganisationalUnitToAho(xmlHearing["ds:CourtHearingLocation"]),
  DateOfHearing: new Date(xmlHearing["ds:DateOfHearing"]["#text"]),
  TimeOfHearing: xmlHearing["ds:TimeOfHearing"]["#text"],
  HearingLanguage: xmlHearing["ds:HearingLanguage"]["#text"] ?? "",
  HearingDocumentationLanguage: xmlHearing["ds:HearingDocumentationLanguage"]["#text"] ?? "",
  DefendantPresentAtHearing: xmlHearing["ds:DefendantPresentAtHearing"]["#text"] ?? "",
  CourtHouseCode: Number(xmlHearing["br7:CourtHouseCode"]["#text"]),
  SourceReference: {
    DocumentName: xmlHearing["br7:SourceReference"]["br7:DocumentName"]["#text"],
    UniqueID: xmlHearing["br7:SourceReference"]["br7:UniqueID"]["#text"],
    DocumentType: xmlHearing["br7:SourceReference"]["br7:DocumentType"]["#text"]
  },
  CourtType: xmlHearing["br7:CourtType"] ? xmlHearing["br7:CourtType"]["#text"] : "",
  CourtHouseName: xmlHearing["br7:CourtHouseName"]?.["#text"]
})

const mapXmlToAho = (aho: AhoXml): AnnotatedHearingOutcome | undefined => {
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
      ? new Date(aho["br7:AnnotatedHearingOutcome"]?.["br7:PNCQueryDate"]["#text"])
      : undefined,
    PncErrorMessage: aho["br7:AnnotatedHearingOutcome"]?.["br7:PNCErrorMessage"]?.["#text"]
  }
}

export default (xml: string): AnnotatedHearingOutcome | Error => {
  const options = {
    ignoreAttributes: false,
    parseTagValue: false,
    parseAttributeValue: false,
    processEntities: false,
    trimValues: false,
    alwaysCreateTextNode: true,
    attributeValueProcessor: decodeEntitiesProcessor,
    tagValueProcessor: decodeEntitiesProcessor
  }

  const parser = new XMLParser(options)
  const rawParsedObj = parser.parse(xml)
  const legacyAho = mapXmlToAho(rawParsedObj)
  if (legacyAho) {
    legacyAho.Exceptions = extractExceptionsFromAho(xml)
    return legacyAho
  }
  return new Error("Could not parse AHO XML")
}
