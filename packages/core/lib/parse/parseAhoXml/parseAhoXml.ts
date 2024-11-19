import { isError } from "@moj-bichard7/common/types/Result"
import { XMLParser } from "fast-xml-parser"

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
  DsDefendantOrOffender,
  IndictmentOffenceCode,
  NonMatchingOffenceCode
} from "../../../types/AhoXml"
import type {
  AmountSpecifiedInResult,
  AnnotatedHearingOutcome,
  Case,
  CriminalProsecutionReference,
  DateSpecifiedInResult,
  DefendantOrOffender,
  Duration,
  Hearing,
  NumberSpecifiedInResult,
  Offence,
  OffenceReason,
  OrganisationUnitCodes,
  Result,
  ResultQualifierVariable
} from "../../../types/AnnotatedHearingOutcome"
import type { CjsPlea } from "../../../types/Plea"
import type ResultClass from "../../../types/ResultClass"

import countDecimalPlaces from "../../countDecimalPlaces"
import { decodeAttributeEntitiesProcessor, decodeTagEntitiesProcessor } from "../../encoding"
import extractExceptionsFromAho from "./extractExceptionsFromXml"
import mapXmlCxe01ToAho from "./mapXmlCxe01ToAho"

export const mapXmlOrganisationalUnitToAho = (xmlOrgUnit: Br7OrganisationUnit): OrganisationUnitCodes => ({
  BottomLevelCode: xmlOrgUnit["ds:BottomLevelCode"]["#text"] ?? "",
  OrganisationUnitCode: xmlOrgUnit["ds:OrganisationUnitCode"]["#text"] ?? "",
  SecondLevelCode: xmlOrgUnit["ds:SecondLevelCode"]["#text"] ?? "",
  ThirdLevelCode: xmlOrgUnit["ds:ThirdLevelCode"]["#text"] ?? "",
  TopLevelCode: xmlOrgUnit["ds:TopLevelCode"]?.["#text"]
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
    DecimalPlaces: countDecimalPlaces(amount["#text"]),
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
    DurationLength: Number(d["ds:DurationLength"]["#text"]),
    DurationType: d["ds:DurationType"]["#text"],
    DurationUnit: d["ds:DurationUnit"]["#text"]
  }))
}

const mapXmlResultQualifierVariableToAho = (
  rqv: Br7ResultQualifierVariable | Br7ResultQualifierVariable[] | undefined
): ResultQualifierVariable[] => {
  if (!rqv) {
    return []
  }

  const rqvArray = Array.isArray(rqv) ? rqv : [rqv]
  return rqvArray.map((r) => {
    const duration = r["ds:Duration"]

    return {
      Code: r["ds:Code"]["#text"],
      ...(duration && {
        Duration: {
          DurationLength: Number(duration["ds:DurationLength"]["#text"]),
          DurationType: duration["ds:DurationType"]["#text"],
          DurationUnit: duration["ds:DurationUnit"]["#text"]
        }
      })
    }
  })
}

const mapBailCondition = (bailCondition: Br7TextString | Br7TextString[] | undefined): string[] => {
  if (!bailCondition) {
    return []
  }

  const allBailConditions = Array.isArray(bailCondition) ? bailCondition : [bailCondition]
  return allBailConditions.map((bc) => bc["#text"])
}

const parseDateOrFallbackToString = (input?: Br7ErrorString): Date | null | string | undefined => {
  if (input && input["@_Error"] && !input["#text"]) {
    return null
  }

  if (!input || !input["#text"]) {
    return undefined
  }

  const parsedDate = new Date(input["#text"])
  if (isNaN(parsedDate.getTime()) || !input["#text"].match(/\d{4}-\d{2}-\d{2}/)) {
    return input["#text"]
  }

  return parsedDate
}

const mapXmlResultToAho = (xmlResult: Br7Result): Result => ({
  // TimeSpecifiedInResult: xmlResult,
  AmountSpecifiedInResult: mapAmountSpecifiedInResult(xmlResult["ds:AmountSpecifiedInResult"]),
  BailCondition: mapBailCondition(xmlResult["ds:BailCondition"]),
  CJSresultCode: Number(xmlResult["ds:CJSresultCode"]["#text"]),
  ConvictingCourt: xmlResult["br7:ConvictingCourt"]?.["#text"],
  CourtType: xmlResult["ds:CourtType"]?.["#text"],
  DateSpecifiedInResult: mapDateSpecifiedInResult(xmlResult["ds:DateSpecifiedInResult"]),
  Duration: mapDuration(xmlResult["ds:Duration"]),
  // TargetCourtType: xmlResult.
  // CRESTDisposalCode: xmlResult.
  ModeOfTrialReason: xmlResult["ds:ModeOfTrialReason"]?.["#text"],
  NextCourtType: xmlResult["ds:NextCourtType"]?.["#text"],
  NextHearingDate: parseDateOrFallbackToString(xmlResult["ds:NextHearingDate"]),
  NextHearingTime: xmlResult["ds:NextHearingTime"]?.["#text"],
  NextResultSourceOrganisation: xmlResult["ds:NextResultSourceOrganisation"]
    ? {
        BottomLevelCode: xmlResult["ds:NextResultSourceOrganisation"]["ds:BottomLevelCode"]["#text"],
        OrganisationUnitCode: xmlResult["ds:NextResultSourceOrganisation"]["ds:OrganisationUnitCode"]["#text"],
        SecondLevelCode: xmlResult["ds:NextResultSourceOrganisation"]["ds:SecondLevelCode"]["#text"],
        ThirdLevelCode: xmlResult["ds:NextResultSourceOrganisation"]["ds:ThirdLevelCode"]["#text"],
        TopLevelCode: xmlResult["ds:NextResultSourceOrganisation"]["ds:TopLevelCode"]?.["#text"]
      }
    : undefined,
  NumberOfOffencesTIC: xmlResult["br7:NumberOfOffencesTIC"]?.["#text"]
    ? Number(xmlResult["br7:NumberOfOffencesTIC"]["#text"])
    : undefined,
  NumberSpecifiedInResult: mapNumberSpecifiedInResult(xmlResult["ds:NumberSpecifiedInResult"]),
  OffenceRemandStatus: xmlResult["ds:OffenceRemandStatus"] ? xmlResult["ds:OffenceRemandStatus"]["#text"] : undefined,
  PleaStatus: xmlResult["ds:PleaStatus"]?.["#text"] as CjsPlea,
  PNCAdjudicationExists: xmlResult["br7:PNCAdjudicationExists"]
    ? xmlResult["br7:PNCAdjudicationExists"]["#text"] === "Y"
    : undefined,
  PNCDisposalType: xmlResult["br7:PNCDisposalType"] ? Number(xmlResult["br7:PNCDisposalType"]["#text"]) : undefined,
  ReasonForOffenceBailConditions: xmlResult["br7:ReasonForOffenceBailConditions"]?.["#text"],
  ResultApplicableQualifierCode: [],
  ResultClass: xmlResult["br7:ResultClass"]?.["#text"] as ResultClass,
  ResultHalfLifeHours: xmlResult["ds:ResultHalfLifeHours"]
    ? Number(xmlResult["ds:ResultHalfLifeHours"]["#text"])
    : undefined,
  ResultHearingDate: new Date(xmlResult["ds:ResultHearingDate"]?.["#text"] ?? ""),
  ResultHearingType: xmlResult["ds:ResultHearingType"]?.["#text"],
  ResultQualifierVariable: mapXmlResultQualifierVariableToAho(xmlResult["br7:ResultQualifierVariable"]),
  ResultVariableText: xmlResult["ds:ResultVariableText"]?.["#text"],
  SourceOrganisation: mapXmlOrganisationalUnitToAho(xmlResult["ds:SourceOrganisation"]),
  Urgent: xmlResult["br7:Urgent"]
    ? {
        urgency: Number(xmlResult["br7:Urgent"]["br7:urgency"]["#text"]),
        urgent: xmlResult["br7:Urgent"]["br7:urgent"]["#text"] === "Y"
      }
    : undefined,
  Verdict: xmlResult["ds:Verdict"]?.["#text"],
  WarrantIssueDate: xmlResult["ds:WarrantIssueDate"] ? new Date(xmlResult["ds:WarrantIssueDate"]["#text"]) : undefined
})

const mapXmlResultsToAho = (xmlResults: Br7Result | Br7Result[]): Result[] =>
  Array.isArray(xmlResults)
    ? xmlResults.map((xmlResult) => mapXmlResultToAho(xmlResult))
    : [mapXmlResultToAho(xmlResults)]

const buildFullOffenceCode = (
  offenceCode: CommonLawOffenceCode | IndictmentOffenceCode | NonMatchingOffenceCode
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
          FullCode: code ? buildFullOffenceCode(code) : "",
          Qualifier: code["ds:Qualifier"]?.["#text"],
          Reason: code["ds:Reason"]["#text"]
        }
      }
    } else if ("ds:ActOrSource" in code) {
      return {
        __type: "NationalOffenceReason",
        OffenceCode: {
          __type: "NonMatchingOffenceCode",
          ActOrSource: code["ds:ActOrSource"]["#text"],
          FullCode: code ? buildFullOffenceCode(code) : "",
          Qualifier: code?.["ds:Qualifier"]?.["#text"],
          Reason: code?.["ds:Reason"]["#text"],
          Year: code["ds:Year"]?.["#text"]
        }
      }
    } else {
      return {
        __type: "NationalOffenceReason",
        OffenceCode: {
          __type: "IndictmentOffenceCode",
          FullCode: code ? buildFullOffenceCode(code) : "",
          Indictment: "",
          Qualifier: code?.["ds:Qualifier"]?.["#text"],
          Reason: code?.["ds:Reason"]["#text"]
        }
      }
    }
  }

  throw new Error("Offence Reason Missing from XML")
}

const mapErrorString = (node: Br7ErrorString | undefined): null | string | undefined => {
  if (node?.["#text"]) {
    return node["#text"]
  }

  if (node?.["@_Error"]) {
    return null
  }

  return undefined
}

const mapXmlDefendantOrOffender = (defendantOrOffender?: DsDefendantOrOffender): DefendantOrOffender | undefined => {
  if (defendantOrOffender === undefined) {
    return undefined
  }

  return {
    CheckDigit: defendantOrOffender["ds:CheckDigit"]?.["#text"] ?? "",
    DefendantOrOffenderSequenceNumber: defendantOrOffender["ds:DefendantOrOffenderSequenceNumber"]?.["#text"] ?? "",
    OrganisationUnitIdentifierCode: mapXmlOrganisationalUnitToAho(
      defendantOrOffender["ds:OrganisationUnitIdentifierCode"]
    ),
    Year: defendantOrOffender["ds:Year"]?.["#text"] ?? ""
  }
}

const mapXmlCPRToAho = (xmlCPR: Br7CriminalProsecutionReference): CriminalProsecutionReference => ({
  DefendantOrOffender: mapXmlDefendantOrOffender(xmlCPR["ds:DefendantOrOffender"]),
  OffenceReason: xmlCPR["ds:OffenceReason"] ? mapOffenceReasonToAho(xmlCPR["ds:OffenceReason"]) : undefined,
  OffenceReasonSequence: mapErrorString(xmlCPR["ds:OffenceReasonSequence"])
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

const mapCourtCaseReferenceNumber = (element: Br7TextString | undefined): null | string | undefined => {
  if (element === undefined) {
    return undefined
  }

  const value = element["#text"]
  if (value === "") {
    return null
  }

  return value
}

const mapXmlOffencesToAho = (xmlOffences: Br7Offence | Br7Offence[]): Offence[] => {
  if (!xmlOffences) {
    return []
  }

  const getElementText = (el?: Br7ErrorString): string | undefined => {
    if (!el) {
      return undefined
    }

    if (el["#text"] !== undefined) {
      return el["#text"]
    }

    if (el["@_Error"]) {
      return ""
    }

    return undefined
  }

  const offences: Br7Offence[] = Array.isArray(xmlOffences) ? xmlOffences : [xmlOffences]
  return offences.map((xmlOffence) => ({
    ActualOffenceDateCode: String(xmlOffence["ds:ActualOffenceDateCode"]["#text"]),
    ActualOffenceEndDate:
      xmlOffence["ds:ActualOffenceEndDate"] && xmlOffence["ds:ActualOffenceEndDate"]["ds:EndDate"]?.["#text"]
        ? {
            EndDate: new Date(xmlOffence["ds:ActualOffenceEndDate"]["ds:EndDate"]["#text"])
          }
        : undefined,
    ActualOffenceStartDate: {
      StartDate: new Date(xmlOffence["ds:ActualOffenceStartDate"]["ds:StartDate"]["#text"])
    },
    ActualOffenceWording: xmlOffence["ds:ActualOffenceWording"]["#text"] ?? "",
    AddedByTheCourt: xmlOffence["br7:AddedByTheCourt"] ? xmlOffence["br7:AddedByTheCourt"]["#text"] === "Y" : undefined,
    AlcoholLevel: xmlOffence["ds:AlcoholLevel"]
      ? {
          Amount: Number(xmlOffence["ds:AlcoholLevel"]["ds:Amount"]["#text"]),
          Method: xmlOffence["ds:AlcoholLevel"]["ds:Method"]["#text"]
        }
      : undefined,
    ArrestDate: xmlOffence["ds:ArrestDate"] ? new Date(xmlOffence["ds:ArrestDate"]["#text"]) : undefined,
    ChargeDate: xmlOffence["ds:ChargeDate"] ? new Date(xmlOffence["ds:ChargeDate"]["#text"]) : undefined,
    CommittedOnBail: xmlOffence["br7:CommittedOnBail"]["#text"],
    ConvictionDate: xmlOffence["ds:ConvictionDate"] ? new Date(xmlOffence["ds:ConvictionDate"]["#text"]) : undefined,
    CourtCaseReferenceNumber: mapCourtCaseReferenceNumber(xmlOffence["br7:CourtCaseReferenceNumber"]),
    CourtOffenceSequenceNumber: Number(xmlOffence["br7:CourtOffenceSequenceNumber"]["#text"]),
    CriminalProsecutionReference: mapXmlCPRToAho(xmlOffence["ds:CriminalProsecutionReference"]),
    HomeOfficeClassification: xmlOffence["ds:HomeOfficeClassification"]?.["#text"],
    LocationOfOffence: xmlOffence["ds:LocationOfOffence"]?.["#text"],
    ManualCourtCaseReference: xmlOffence["br7:ManualCourtCaseReference"]
      ? xmlOffence["br7:ManualCourtCaseReference"]?.["#text"] === "Y"
      : undefined,
    ManualSequenceNumber: xmlOffence["br7:ManualSequenceNo"]
      ? xmlOffence["br7:ManualSequenceNo"]["#text"] === "Y"
      : undefined,
    NotifiableToHOindicator: xmlOffence["ds:NotifiableToHOindicator"]
      ? xmlOffence["ds:NotifiableToHOindicator"]["#text"] === "Y"
      : undefined,
    OffenceCategory: xmlOffence["ds:OffenceCategory"]?.["#text"],
    OffenceTitle: getElementText(xmlOffence["ds:OffenceTitle"]),
    RecordableOnPNCindicator: offenceRecordableOnPnc(xmlOffence),
    Result: mapXmlResultsToAho(xmlOffence["br7:Result"])
    // ResultHalfLifeHours: xmlOffence.
  }))
}

const getGivenNames = (
  givenName: Br7NameSequenceTextString | Br7NameSequenceTextString[] | undefined
): string[] | undefined => {
  if (!givenName) {
    return undefined
  }

  return Array.isArray(givenName) ? givenName.map((x) => x["#text"]) : [givenName["#text"].replace(/\s+/g, " ").trim()]
}

export const mapXmlCaseToAho = (xmlCase: Br7Case): Case => ({
  CourtCaseReferenceNumber: xmlCase["ds:CourtCaseReferenceNumber"]?.["#text"],
  CourtReference: {
    MagistratesCourtReference: xmlCase["br7:CourtReference"]["ds:MagistratesCourtReference"]["#text"]
  },
  ForceOwner: xmlCase["br7:ForceOwner"] ? mapXmlOrganisationalUnitToAho(xmlCase["br7:ForceOwner"]) : undefined,
  HearingDefendant: {
    Address: {
      AddressLine1: xmlCase["br7:HearingDefendant"]["br7:Address"]["ds:AddressLine1"]["#text"],
      AddressLine2: xmlCase["br7:HearingDefendant"]["br7:Address"]["ds:AddressLine2"]?.["#text"],
      AddressLine3: xmlCase["br7:HearingDefendant"]["br7:Address"]["ds:AddressLine3"]?.["#text"],
      AddressLine4: xmlCase["br7:HearingDefendant"]["br7:Address"]["ds:AddressLine4"]?.["#text"],
      AddressLine5: xmlCase["br7:HearingDefendant"]["br7:Address"]["ds:AddressLine5"]?.["#text"]
    },
    ArrestSummonsNumber: xmlCase["br7:HearingDefendant"]["br7:ArrestSummonsNumber"]["#text"] ?? "",
    BailConditions: mapBailCondition(xmlCase["br7:HearingDefendant"]["br7:BailConditions"]),
    CourtPNCIdentifier: xmlCase["br7:HearingDefendant"]["br7:CourtPNCIdentifier"]?.["#text"],
    DefendantDetail: xmlCase["br7:HearingDefendant"]["br7:DefendantDetail"]
      ? {
          BirthDate: xmlCase["br7:HearingDefendant"]["br7:DefendantDetail"]["br7:BirthDate"]?.["#text"]
            ? new Date(xmlCase["br7:HearingDefendant"]["br7:DefendantDetail"]["br7:BirthDate"]["#text"])
            : undefined,
          Gender: Number(xmlCase["br7:HearingDefendant"]["br7:DefendantDetail"]["br7:Gender"]["#text"]),
          GeneratedPNCFilename:
            xmlCase["br7:HearingDefendant"]["br7:DefendantDetail"]["br7:GeneratedPNCFilename"]?.["#text"],
          PersonName: {
            FamilyName: xmlCase["br7:HearingDefendant"]["br7:DefendantDetail"]["br7:PersonName"]["ds:FamilyName"][
              "#text"
            ]
              .replace(/\s+/g, " ")
              .trim(),
            GivenName: getGivenNames(
              xmlCase["br7:HearingDefendant"]["br7:DefendantDetail"]["br7:PersonName"]["ds:GivenName"]
            )?.map((name) => name.replace(/\s+/g, " ").trim()),
            Title: xmlCase["br7:HearingDefendant"]["br7:DefendantDetail"]["br7:PersonName"]["ds:Title"]?.["#text"]
              .replace(/\s+/g, " ")
              .trim()
          }
        }
      : undefined,
    Offence: mapXmlOffencesToAho(xmlCase["br7:HearingDefendant"]["br7:Offence"]),
    OrganisationName: xmlCase["br7:HearingDefendant"]["br7:OrganisationName"]?.["#text"].replace(/\s+/g, " ").trim(),
    PNCCheckname: xmlCase["br7:HearingDefendant"]["br7:PNCCheckname"]?.["#text"],
    PNCIdentifier: xmlCase["br7:HearingDefendant"]["br7:PNCIdentifier"]?.["#text"],
    ReasonForBailConditions: xmlCase["br7:HearingDefendant"]["br7:ReasonForBailConditions"]?.["#text"],
    RemandStatus: xmlCase["br7:HearingDefendant"]["br7:RemandStatus"]["#text"]
  },
  ManualForceOwner: xmlCase["br7:ManualForceOwner"]?.["#text"] ? true : undefined,
  PenaltyNoticeCaseReferenceNumber: xmlCase["br7:PenaltyNoticeCaseReference"]?.["#text"],
  PreChargeDecisionIndicator: xmlCase["ds:PreChargeDecisionIndicator"]["#text"] === "Y",
  PTIURN: xmlCase["ds:PTIURN"]["#text"] ?? "",
  RecordableOnPNCindicator: caseRecordableOnPnc(xmlCase),
  Urgent: xmlCase["br7:Urgent"]
    ? {
        urgency: Number(xmlCase["br7:Urgent"]["br7:urgency"]["#text"]),
        urgent: xmlCase["br7:Urgent"]["br7:urgent"]["#text"] === "Y"
      }
    : undefined
})

export const mapXmlHearingToAho = (xmlHearing: Br7Hearing): Hearing => ({
  CourtHearingLocation: mapXmlOrganisationalUnitToAho(xmlHearing["ds:CourtHearingLocation"]),
  CourtHouseCode: Number(xmlHearing["br7:CourtHouseCode"]["#text"]),
  CourtHouseName: xmlHearing["br7:CourtHouseName"]?.["#text"],
  CourtType: mapErrorString(xmlHearing["br7:CourtType"]),
  DateOfHearing: new Date(xmlHearing["ds:DateOfHearing"]["#text"]),
  DefendantPresentAtHearing: xmlHearing["ds:DefendantPresentAtHearing"]["#text"] ?? "",
  HearingDocumentationLanguage: xmlHearing["ds:HearingDocumentationLanguage"]["#text"] ?? "",
  HearingLanguage: xmlHearing["ds:HearingLanguage"]["#text"] ?? "",
  SourceReference: {
    DocumentName: xmlHearing["br7:SourceReference"]["br7:DocumentName"]["#text"],
    DocumentType: xmlHearing["br7:SourceReference"]["br7:DocumentType"]["#text"],
    UniqueID: xmlHearing["br7:SourceReference"]["br7:UniqueID"]["#text"]
  },
  TimeOfHearing: xmlHearing["ds:TimeOfHearing"]["#text"]
})

export const mapXmlToAho = (aho: AhoXml): AnnotatedHearingOutcome | Error => {
  const rootElement = aho["br7:AnnotatedHearingOutcome"] ? aho["br7:AnnotatedHearingOutcome"] : aho
  if (!rootElement["br7:HearingOutcome"]) {
    return Error("Could not parse AHO XML")
  }

  return {
    AnnotatedHearingOutcome: {
      HearingOutcome: {
        Case: mapXmlCaseToAho(rootElement["br7:HearingOutcome"]["br7:Case"]),
        Hearing: mapXmlHearingToAho(rootElement["br7:HearingOutcome"]["br7:Hearing"])
      }
    },
    Exceptions: [],
    PncErrorMessage: aho["br7:AnnotatedHearingOutcome"]?.["br7:PNCErrorMessage"]?.["#text"],
    PncQuery: mapXmlCxe01ToAho(aho["br7:AnnotatedHearingOutcome"]?.CXE01),
    PncQueryDate: aho["br7:AnnotatedHearingOutcome"]?.["br7:PNCQueryDate"]
      ? new Date(aho["br7:AnnotatedHearingOutcome"]?.["br7:PNCQueryDate"]["#text"])
      : undefined
  }
}

export default (xml: string): AnnotatedHearingOutcome | Error => {
  const options = {
    alwaysCreateTextNode: true,
    attributeValueProcessor: decodeAttributeEntitiesProcessor,
    ignoreAttributes: false,
    parseAttributeValue: false,
    parseTagValue: false,
    processEntities: false,
    tagValueProcessor: decodeTagEntitiesProcessor,
    trimValues: false
  }

  const parser = new XMLParser(options)
  const rawParsedObj = parser.parse(xml)
  const legacyAho = mapXmlToAho(rawParsedObj)
  if (isError(legacyAho)) {
    return legacyAho
  }

  legacyAho.Exceptions = extractExceptionsFromAho(xml)
  return legacyAho
}
