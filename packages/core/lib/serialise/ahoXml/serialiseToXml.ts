import type { CjsCodeAndDescription } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"

import type {
  Adj,
  AhoXml,
  AhoXmlPncOffence,
  Br7Case,
  Br7Duration,
  Br7Hearing,
  Br7LiteralTextString,
  Br7Offence,
  Br7OffenceReason,
  Br7OrganisationUnit,
  Br7PncErrorMessageString,
  Br7Result,
  Br7SequenceTextString,
  Br7TextString,
  Br7TypeTextString,
  Br7Urgent,
  Cxe01,
  DISList,
  DsDefendantOrOffender
} from "../../../types/AhoXml"
import type {
  AnnotatedHearingOutcome,
  Case,
  DateSpecifiedInResult,
  DefendantOrOffender,
  Duration,
  Hearing,
  NumberSpecifiedInResult,
  Offence,
  OffenceReason,
  OrganisationUnitCodes,
  Result,
  Urgent
} from "../../../types/AnnotatedHearingOutcome"
import type Exception from "../../../types/Exception"
import type { PncException } from "../../../types/Exception"
import type { PncAdjudication, PncDisposal, PncOffence, PncQueryResult } from "../../../types/PncQueryResult"
import type { PncUpdateDataset } from "../../../types/PncUpdateDataset"

import { toISODate, toPNCDate } from "../../../lib/dates"
import {
  lookupAlcoholLevelMethodByCjsCode,
  lookupCourtTypeByCjsCode,
  lookupDefendantPresentAtHearingByCjsCode,
  lookupGenderByCjsCode,
  lookupModeOfTrialReasonByCjsCode,
  lookupOffenceCategoryByCjsCode,
  lookupOffenceDateCodeByCjsCode,
  lookupPleaStatusByCjsCode,
  lookupRemandStatusByCjsCode,
  lookupVerdictByCjsCode
} from "../../dataLookup"
import generateXml from "../generateXml"
import { addExceptionsToAhoXml, addExceptionsToPncUpdateDatasetXml } from "./addExceptionsToAhoXml"
import addFalseHasErrorAttributesToAhoXml from "./addFalseHasErrorAttributesToAhoXml"
import addNullElementsForExceptions from "./addNullElementsForExceptions"

enum LiteralType {
  ActualOffenceDateCode,
  AlcoholLevelMethod,
  CourtType,
  DefendantPresentAtHearing,
  Gender,
  ModeOfTrialReason,
  OffenceCategory,
  OffenceRemandStatus,
  PleaStatus,
  Verdict,
  YesNo
}

const findLiteralAttribute = (type: LiteralType, literalText: string): string | undefined => {
  let offence: CjsCodeAndDescription | undefined

  switch (type) {
    case LiteralType.ActualOffenceDateCode:
      offence = lookupOffenceDateCodeByCjsCode(literalText)
      break
    case LiteralType.AlcoholLevelMethod:
      offence = lookupAlcoholLevelMethodByCjsCode(literalText)
      break
    case LiteralType.CourtType:
      offence = lookupCourtTypeByCjsCode(literalText)
      break
    case LiteralType.DefendantPresentAtHearing:
      offence = lookupDefendantPresentAtHearingByCjsCode(literalText)
      break
    case LiteralType.Gender:
      offence = lookupGenderByCjsCode(literalText)
      break
    case LiteralType.ModeOfTrialReason:
      offence = lookupModeOfTrialReasonByCjsCode(literalText)
      break
    case LiteralType.OffenceCategory:
      offence = lookupOffenceCategoryByCjsCode(literalText)
      break
    case LiteralType.OffenceRemandStatus:
      offence = lookupRemandStatusByCjsCode(literalText)
      break
    case LiteralType.PleaStatus:
      offence = lookupPleaStatusByCjsCode(literalText)
      break
    case LiteralType.Verdict:
      offence = lookupVerdictByCjsCode(literalText)
      break
    default:
      throw new Error("Invalid literal type specified")
  }

  return offence?.description
}

const literal = (value: boolean | string, type: LiteralType): Br7LiteralTextString => {
  let literalText: string | undefined
  let literalAttribute: string | undefined
  if (value === undefined) {
    throw new Error("Text not supplied for required literal value")
  }

  if (typeof value === "boolean") {
    if (type === LiteralType.YesNo) {
      literalText = value ? "Y" : "N"
      literalAttribute = value ? "Yes" : "No"
    }
  } else {
    literalText = value
    literalAttribute = findLiteralAttribute(type, literalText)
  }

  if (!literalAttribute || literalText === undefined) {
    return { "#text": literalText ?? "" }
  }

  return { "#text": literalText, "@_Literal": literalAttribute }
}

const optionalLiteral = (value: boolean | string | undefined, type: LiteralType): Br7LiteralTextString | undefined => {
  if (value === undefined) {
    return undefined
  }

  return literal(value, type)
}

const text = (t: string): Br7TextString => ({ "#text": t })
const nullText = (t: null | string): Br7TextString => ({ "#text": t ?? "" })
const optionalText = (t: string | undefined): Br7TextString | undefined =>
  t !== undefined ? { "#text": t } : undefined
const optionalFormatText = (t: Date | string | undefined): Br7TextString | undefined => {
  if (!t) {
    return undefined
  }

  if (typeof t === "string") {
    return text(t)
  }

  return text(toISODate(t))
}

export const mapAhoOrgUnitToXml = (orgUnit: OrganisationUnitCodes): Br7OrganisationUnit => ({
  "ds:TopLevelCode": optionalText(orgUnit.TopLevelCode),
  "ds:SecondLevelCode": nullText(orgUnit.SecondLevelCode),
  "ds:ThirdLevelCode": nullText(orgUnit.ThirdLevelCode),
  "ds:BottomLevelCode": nullText(orgUnit.BottomLevelCode),
  "ds:OrganisationUnitCode": nullText(orgUnit.OrganisationUnitCode),
  "@_SchemaVersion": "2.0"
})

const mapAhoUrgentToXml = (urgent: Urgent): Br7Urgent => ({
  "br7:urgent": literal(urgent.urgent, LiteralType.YesNo),
  "br7:urgency": text(urgent.urgency.toString())
})

const mapAhoDuration = (duration: Duration[]): Br7Duration[] =>
  duration.map((d) => ({
    "ds:DurationType": text(d.DurationType),
    "ds:DurationUnit": text(d.DurationUnit),
    "ds:DurationLength": text(d.DurationLength.toString())
  }))

const mapDateSpecifiedInResult = (dates: DateSpecifiedInResult[] | undefined): Br7SequenceTextString[] | undefined => {
  if (!dates || dates.length === 0) {
    return undefined
  }

  return dates.map((date) => ({ "#text": toISODate(date.Date), "@_Sequence": date.Sequence.toString() }))
}

const mapNumberSpecifiedInResult = (
  numbers: NumberSpecifiedInResult[] | undefined
): Br7TypeTextString[] | undefined => {
  if (!numbers || numbers.length === 0) {
    return undefined
  }

  return numbers.map((number) => ({ "#text": number.Number.toString(), "@_Type": number.Type.toString() }))
}

const mapNextResultSourceOrganisation = (
  ou: null | OrganisationUnitCodes | undefined
): Br7OrganisationUnit | undefined => {
  if (ou === null) {
    return mapAhoOrgUnitToXml({
      SecondLevelCode: "",
      ThirdLevelCode: "",
      BottomLevelCode: "",
      OrganisationUnitCode: ""
    })
  }

  if (!ou) {
    return undefined
  }

  return mapAhoOrgUnitToXml(ou)
}

const mapAhoResultsToXml = (results: Result[]): Br7Result[] =>
  results.map((result) => ({
    "ds:CJSresultCode": text(result.CJSresultCode.toString()),
    "ds:OffenceRemandStatus": optionalLiteral(result.OffenceRemandStatus, LiteralType.OffenceRemandStatus),
    "ds:SourceOrganisation": mapAhoOrgUnitToXml(result.SourceOrganisation),
    "ds:CourtType": optionalText(result.CourtType) ?? { "#text": "" },
    "ds:ResultHearingType": result.ResultHearingType
      ? { "#text": result.ResultHearingType, "@_Literal": "Other" }
      : undefined,
    "ds:ResultHearingDate": optionalFormatText(result.ResultHearingDate),
    "ds:BailCondition": result.BailCondition?.map(text),
    "ds:Duration": result.Duration ? mapAhoDuration(result.Duration) : undefined,
    "ds:DateSpecifiedInResult": mapDateSpecifiedInResult(result.DateSpecifiedInResult),
    // ds:TimeSpecifiedInResult
    "ds:AmountSpecifiedInResult": result.AmountSpecifiedInResult?.map((amount) => ({
      "#text": amount.Amount.toFixed(amount.DecimalPlaces),
      "@_Type": amount.Type ?? ""
    })),
    "ds:NumberSpecifiedInResult": mapNumberSpecifiedInResult(result.NumberSpecifiedInResult),
    "ds:NextResultSourceOrganisation": mapNextResultSourceOrganisation(result.NextResultSourceOrganisation),
    "ds:NextCourtType": optionalText(result.NextCourtType),
    // ds:NextHearingType
    "ds:NextHearingDate":
      result.NextHearingDate === null ? nullText(result.NextHearingDate) : optionalFormatText(result.NextHearingDate),
    "ds:NextHearingTime": optionalText(result.NextHearingTime?.split(":").slice(0, 2).join(":")),
    "ds:PleaStatus": optionalLiteral(result.PleaStatus, LiteralType.PleaStatus),
    "ds:Verdict": optionalLiteral(result.Verdict, LiteralType.Verdict),
    "ds:ModeOfTrialReason": optionalLiteral(result.ModeOfTrialReason, LiteralType.ModeOfTrialReason),
    "ds:ResultVariableText": optionalText(result.ResultVariableText),
    "ds:WarrantIssueDate": optionalFormatText(result.WarrantIssueDate),
    "ds:ResultHalfLifeHours": optionalText(result.ResultHalfLifeHours?.toString()),
    "br7:PNCDisposalType": optionalText(result.PNCDisposalType?.toString()),
    "br7:ResultClass": optionalText(result.ResultClass),
    "br7:Urgent": result.Urgent ? mapAhoUrgentToXml(result.Urgent) : undefined,
    "br7:PNCAdjudicationExists": optionalLiteral(result.PNCAdjudicationExists, LiteralType.YesNo),
    "br7:NumberOfOffencesTIC": optionalText(result.NumberOfOffencesTIC?.toString()),
    "br7:ReasonForOffenceBailConditions": optionalText(result.ReasonForOffenceBailConditions),
    "br7:ResultQualifierVariable": result.ResultQualifierVariable.map((rqv) => ({
      "@_SchemaVersion": "3.0",
      "ds:Code": text(rqv.Code)
    })),
    "br7:ConvictingCourt": optionalText(result.ConvictingCourt),
    "@_SchemaVersion": "2.0"
  }))

const mapAhoOffenceReasonToXml = (offenceReason: OffenceReason): Br7OffenceReason | undefined => {
  if (offenceReason.__type === "LocalOffenceReason") {
    return {
      "ds:LocalOffenceCode": {
        "ds:AreaCode": text(offenceReason.LocalOffenceCode.AreaCode),
        "ds:OffenceCode": text(offenceReason.LocalOffenceCode.OffenceCode)
      }
    }
  }

  if (offenceReason.__type === "NationalOffenceReason") {
    switch (offenceReason.OffenceCode.__type) {
      case "CommonLawOffenceCode":
        return {
          "ds:OffenceCode": {
            "ds:CommonLawOffence": text(offenceReason.OffenceCode.CommonLawOffence),
            "ds:Reason": text(offenceReason.OffenceCode.Reason),
            "ds:Qualifier": optionalText(offenceReason.OffenceCode.Qualifier)
          }
        }
      case "IndictmentOffenceCode":
        return {
          "ds:OffenceCode": {
            "ds:Reason": text(offenceReason.OffenceCode.Reason),
            "ds:Qualifier": optionalText(offenceReason.OffenceCode.Qualifier)
          }
        }
      case "NonMatchingOffenceCode":
        return {
          "ds:OffenceCode": {
            "ds:ActOrSource": text(offenceReason.OffenceCode.ActOrSource),
            "ds:Year": optionalText(offenceReason.OffenceCode.Year),
            "ds:Reason": text(offenceReason.OffenceCode.Reason),
            "ds:Qualifier": optionalText(offenceReason.OffenceCode.Qualifier)
          }
        }
    }
  }
}

const mapDefendantOrOffender = (defendantOrOffender?: DefendantOrOffender): DsDefendantOrOffender | undefined => {
  if (defendantOrOffender === undefined) {
    return undefined
  }

  return {
    "ds:Year": defendantOrOffender.Year !== null ? text(defendantOrOffender.Year) : { "#text": "" },
    "ds:OrganisationUnitIdentifierCode": mapAhoOrgUnitToXml(defendantOrOffender.OrganisationUnitIdentifierCode),
    "ds:DefendantOrOffenderSequenceNumber": text(defendantOrOffender.DefendantOrOffenderSequenceNumber),
    "ds:CheckDigit": text(defendantOrOffender.CheckDigit)
  }
}

const mapAhoOffencesToXml = (offences: Offence[]): Br7Offence[] =>
  offences.map((offence) => ({
    "ds:CriminalProsecutionReference": {
      "ds:DefendantOrOffender": mapDefendantOrOffender(offence.CriminalProsecutionReference.DefendantOrOffender),
      "ds:OffenceReason": offence.CriminalProsecutionReference.OffenceReason
        ? mapAhoOffenceReasonToXml(offence.CriminalProsecutionReference.OffenceReason)
        : undefined,
      "ds:OffenceReasonSequence":
        offence.CriminalProsecutionReference.OffenceReasonSequence === null
          ? {}
          : optionalText(offence.CriminalProsecutionReference.OffenceReasonSequence),
      "@_SchemaVersion": "2.0"
    },
    "ds:OffenceCategory": optionalLiteral(offence.OffenceCategory, LiteralType.OffenceCategory),
    "ds:ArrestDate": optionalFormatText(offence.ArrestDate),
    "ds:ChargeDate": optionalFormatText(offence.ChargeDate),
    "ds:ActualOffenceDateCode": literal(offence.ActualOffenceDateCode, LiteralType.ActualOffenceDateCode),
    "ds:ActualOffenceStartDate": {
      "ds:StartDate": text(toISODate(offence.ActualOffenceStartDate.StartDate))
    },
    "ds:ActualOffenceEndDate":
      offence.ActualOffenceEndDate && offence.ActualOffenceEndDate.EndDate
        ? {
            "ds:EndDate": optionalFormatText(offence.ActualOffenceEndDate.EndDate)
          }
        : undefined,
    "ds:LocationOfOffence": optionalText(offence.LocationOfOffence),
    "ds:OffenceTitle": optionalText(offence.OffenceTitle),
    "ds:ActualOffenceWording": text(offence.ActualOffenceWording),
    "ds:RecordableOnPNCindicator": optionalLiteral(offence.RecordableOnPNCindicator, LiteralType.YesNo),
    "ds:NotifiableToHOindicator": optionalLiteral(offence.NotifiableToHOindicator, LiteralType.YesNo),
    "ds:HomeOfficeClassification": optionalText(offence.HomeOfficeClassification),
    "ds:AlcoholLevel": offence.AlcoholLevel
      ? {
          "ds:Amount": text(offence.AlcoholLevel?.Amount.toString()),
          "ds:Method": literal(offence.AlcoholLevel.Method, LiteralType.AlcoholLevelMethod)
        }
      : undefined,
    "ds:ConvictionDate": optionalFormatText(offence.ConvictionDate),
    "br7:CommittedOnBail": { "#text": offence.CommittedOnBail, "@_Literal": "Don't Know" },
    "br7:CourtOffenceSequenceNumber": text(offence.CourtOffenceSequenceNumber.toString()),
    "br7:AddedByTheCourt": optionalLiteral(offence.AddedByTheCourt, LiteralType.YesNo),
    "br7:ManualCourtCaseReference": optionalLiteral(offence.ManualCourtCaseReference, LiteralType.YesNo),
    "br7:ManualSequenceNo": optionalLiteral(offence.ManualSequenceNumber, LiteralType.YesNo),
    "br7:CourtCaseReferenceNumber":
      offence.CourtCaseReferenceNumber === null ? { "#text": "" } : optionalText(offence.CourtCaseReferenceNumber),
    "br7:Result": mapAhoResultsToXml(offence.Result),
    "@_SchemaVersion": "4.0"
  }))

const mapAhoCaseToXml = (c: Case): Br7Case => ({
  "ds:PTIURN": text(c.PTIURN),
  "ds:PreChargeDecisionIndicator": literal(c.PreChargeDecisionIndicator, LiteralType.YesNo),
  "ds:CourtCaseReferenceNumber": optionalText(c.CourtCaseReferenceNumber),
  "br7:CourtReference": { "ds:MagistratesCourtReference": text(c.CourtReference.MagistratesCourtReference) },
  "br7:PenaltyNoticeCaseReference": optionalText(c.PenaltyNoticeCaseReferenceNumber),
  "br7:RecordableOnPNCindicator": optionalLiteral(c.RecordableOnPNCindicator, LiteralType.YesNo),
  "br7:Urgent": c.Urgent ? mapAhoUrgentToXml(c.Urgent) : undefined,
  "br7:ManualForceOwner": optionalLiteral(c.ManualForceOwner, LiteralType.YesNo),
  "br7:ForceOwner": c.ForceOwner ? mapAhoOrgUnitToXml(c.ForceOwner) : undefined,
  "br7:HearingDefendant": {
    "br7:ArrestSummonsNumber": text(c.HearingDefendant.ArrestSummonsNumber),
    "br7:PNCIdentifier": optionalText(c.HearingDefendant.PNCIdentifier),
    "br7:PNCCheckname": optionalText(c.HearingDefendant.PNCCheckname),
    "br7:OrganisationName": optionalText(c.HearingDefendant.OrganisationName),
    "br7:DefendantDetail": c.HearingDefendant.DefendantDetail
      ? {
          "br7:PersonName": {
            "ds:Title": optionalText(c.HearingDefendant.DefendantDetail.PersonName.Title),
            "ds:GivenName": c.HearingDefendant.DefendantDetail.PersonName.GivenName?.map((name, index) => ({
              "#text": name,
              "@_NameSequence": `${index + 1}`
            })),
            "ds:FamilyName": {
              "#text": c.HearingDefendant.DefendantDetail.PersonName.FamilyName,
              "@_NameSequence": "1"
            }
          },
          "br7:GeneratedPNCFilename": optionalText(c.HearingDefendant.DefendantDetail.GeneratedPNCFilename),
          "br7:BirthDate": optionalFormatText(c.HearingDefendant.DefendantDetail.BirthDate),
          "br7:Gender": literal(c.HearingDefendant.DefendantDetail.Gender.toString(), LiteralType.Gender)
        }
      : undefined,
    "br7:Address": {
      "ds:AddressLine1": text(c.HearingDefendant.Address.AddressLine1),
      "ds:AddressLine2": optionalText(c.HearingDefendant.Address.AddressLine2),
      "ds:AddressLine3": optionalText(c.HearingDefendant.Address.AddressLine3),
      "ds:AddressLine4": optionalText(c.HearingDefendant.Address.AddressLine4),
      "ds:AddressLine5": optionalText(c.HearingDefendant.Address.AddressLine5)
    },
    "br7:RemandStatus": literal(c.HearingDefendant.RemandStatus, LiteralType.OffenceRemandStatus),
    "br7:BailConditions":
      c.HearingDefendant.BailConditions.length > 0
        ? c.HearingDefendant.BailConditions.map((bc) => {
            const bcText = text(bc)
            bcText["#text"] = bcText["#text"].trim()
            return bcText
          })
        : undefined,
    "br7:ReasonForBailConditions": optionalText(c.HearingDefendant.ReasonForBailConditions),
    "br7:CourtPNCIdentifier": optionalText(c.HearingDefendant.CourtPNCIdentifier),
    "br7:Offence": mapAhoOffencesToXml(c.HearingDefendant.Offence)
  },
  "@_SchemaVersion": "4.0"
})

const mapOffenceADJ = (adjudication: PncAdjudication): Adj => ({
  "@_Adjudication1": adjudication.verdict,
  "@_DateOfSentence": adjudication.sentenceDate ? toPNCDate(adjudication.sentenceDate) : "",
  "@_IntfcUpdateType": "I",
  "@_OffenceTICNumber": adjudication.offenceTICNumber.toString().padStart(4, "0"),
  "@_Plea": adjudication.plea
})

const mapOffenceDIS = (disposals: PncDisposal[]): DISList => ({
  DIS: disposals.map((d) => ({
    "@_IntfcUpdateType": "I",
    "@_QtyDate": d.qtyDate ?? "",
    "@_QtyDuration": d.qtyDuration ?? "",
    "@_QtyMonetaryValue": d.qtyMonetaryValue ?? "",
    "@_QtyUnitsFined": d.qtyUnitsFined ?? "",
    "@_Qualifiers": d.qualifiers ?? "",
    "@_Text": d.text ?? "",
    "@_Type": String(d.type)
  }))
})

const mapAhoHearingToXml = (hearing: Hearing): Br7Hearing => ({
  "ds:CourtHearingLocation": mapAhoOrgUnitToXml(hearing.CourtHearingLocation),
  "ds:DateOfHearing": text(toISODate(hearing.DateOfHearing)),
  "ds:TimeOfHearing": text(hearing.TimeOfHearing),
  "ds:HearingLanguage": { "#text": hearing.HearingLanguage, "@_Literal": "Don't Know" },
  "ds:HearingDocumentationLanguage": { "#text": hearing.HearingDocumentationLanguage, "@_Literal": "Don't Know" },
  "ds:DefendantPresentAtHearing": literal(hearing.DefendantPresentAtHearing, LiteralType.DefendantPresentAtHearing),
  "br7:SourceReference": {
    "br7:DocumentName": text(hearing.SourceReference.DocumentName),
    "br7:UniqueID": text(hearing.SourceReference.UniqueID),
    "br7:DocumentType": text(hearing.SourceReference.DocumentType)
  },
  "br7:CourtType":
    hearing.CourtType !== null ? optionalLiteral(hearing.CourtType, LiteralType.CourtType) : { "#text": "" },
  "br7:CourtHouseCode": text(hearing.CourtHouseCode.toString()),
  "br7:CourtHouseName": optionalText(hearing.CourtHouseName),
  "@_SchemaVersion": "4.0"
})

const mapAhoPncOffencesToXml = (offences: PncOffence[]): AhoXmlPncOffence[] =>
  offences.map((offence) => ({
    COF: {
      "@_ACPOOffenceCode": offence.offence.acpoOffenceCode ?? "",
      "@_CJSOffenceCode": offence.offence.cjsOffenceCode,
      "@_IntfcUpdateType": "K",
      "@_OffEndDate": offence.offence.endDate ? toPNCDate(offence.offence.endDate) : "",
      "@_OffEndTime": offence.offence.endTime?.replace(":", "") ?? "",
      "@_OffStartDate": toPNCDate(offence.offence.startDate) ?? "",
      "@_OffStartTime": offence.offence.startTime?.replace(":", "") ?? "",
      "@_OffenceQualifier1": offence.offence.qualifier1 ?? "",
      "@_OffenceQualifier2": offence.offence.qualifier2 ?? "",
      "@_OffenceTitle": offence.offence.title ?? "",
      "@_ReferenceNumber": String(offence.offence.sequenceNumber).padStart(3, "0")
    },
    ADJ: offence.adjudication ? mapOffenceADJ(offence.adjudication) : undefined,
    DISList: offence.disposals ? mapOffenceDIS(offence.disposals) : undefined
  }))

const mapAhoCXE01ToXml = (pncQuery: PncQueryResult): Cxe01 => ({
  FSC: { "@_FSCode": pncQuery.forceStationCode, "@_IntfcUpdateType": "K" },
  IDS: {
    "@_CRONumber": pncQuery.croNumber ?? "",
    "@_Checkname": pncQuery.checkName,
    "@_IntfcUpdateType": "K",
    "@_PNCID": pncQuery.pncId
  },
  CourtCases:
    pncQuery.courtCases && pncQuery.courtCases.length > 0
      ? {
          CourtCase: pncQuery.courtCases?.map((c) => ({
            CCR: { "@_CourtCaseRefNo": c.courtCaseReference, "@_CrimeOffenceRefNo": "", "@_IntfcUpdateType": "K" },
            Offences: {
              Offence: mapAhoPncOffencesToXml(c.offences)
            }
          }))
        }
      : undefined,
  PenaltyCases:
    pncQuery.penaltyCases && pncQuery.penaltyCases.length > 0
      ? {
          PenaltyCase: pncQuery.penaltyCases?.map((c) => ({
            PCR: { "@_IntfcUpdateType": "K", "@_PenaltyCaseRefNo": c.penaltyCaseReference },
            Offences: {
              Offence: mapAhoPncOffencesToXml(c.offences)
            }
          }))
        }
      : undefined
})

const xmlnsTags = {
  "@_xmlns:br7": "http://schemas.cjse.gov.uk/datastandards/BR7/2007-12",
  "@_xmlns:ds": "http://schemas.cjse.gov.uk/datastandards/2006-10",
  "@_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"
}

const mapPncExceptionsToXml = (exceptions: Exception[]): Br7PncErrorMessageString[] | undefined => {
  const pncExceptions = exceptions.filter((exception) => "message" in exception) satisfies PncException[]

  if (pncExceptions.length > 0) {
    return pncExceptions.map(({ code, message }) => ({ "#text": message, "@_classification": code }))
  }

  return undefined
}

const mapAhoToXml = (aho: AnnotatedHearingOutcome, validate = true): AhoXml => {
  const hearingOutcome = {
    "br7:HearingOutcome": {
      "br7:Hearing": mapAhoHearingToXml(aho.AnnotatedHearingOutcome.HearingOutcome.Hearing),
      "br7:Case": mapAhoCaseToXml(aho.AnnotatedHearingOutcome.HearingOutcome.Case),
      ...(!validate && xmlnsTags)
    }
  }

  const standalone = !validate && aho.Exceptions.length > 0 ? {} : { "@_standalone": "yes" }

  return {
    "?xml": { "@_version": "1.0", "@_encoding": "UTF-8", ...standalone },
    ...(validate
      ? {
          "br7:AnnotatedHearingOutcome": {
            ...hearingOutcome,
            CXE01: aho.PncQuery ? mapAhoCXE01ToXml(aho.PncQuery) : undefined,
            "br7:PNCQueryDate": aho.PncQueryDate ? optionalFormatText(aho.PncQueryDate) : undefined,
            "br7:PNCErrorMessage": mapPncExceptionsToXml(aho.Exceptions),
            ...xmlnsTags
          }
        }
      : {
          ...hearingOutcome
        })
  }
}

const mapPncUpdateDatasetToXml = (pud: PncUpdateDataset, includeExceptions: boolean = true): AhoXml => {
  const hearingOutcome = {
    "br7:HearingOutcome": {
      "br7:Hearing": mapAhoHearingToXml(pud.AnnotatedHearingOutcome.HearingOutcome.Hearing),
      "br7:Case": mapAhoCaseToXml(pud.AnnotatedHearingOutcome.HearingOutcome.Case)
    },
    "br7:HasError": { "#text": (!!pud.HasError).toString() }
  }

  return {
    "?xml": { "@_version": "1.0", "@_encoding": "UTF-8", "@_standalone": "yes" },
    "br7:AnnotatedHearingOutcome": {
      ...hearingOutcome,
      CXE01: pud.PncQuery ? mapAhoCXE01ToXml(pud.PncQuery) : undefined,
      "br7:PNCQueryDate": pud.PncQueryDate ? optionalFormatText(pud.PncQueryDate) : undefined,
      ...(includeExceptions ? { "br7:PNCErrorMessage": mapPncExceptionsToXml(pud.Exceptions) } : {}),
      ...xmlnsTags
    }
  }
}

const convertPncUpdateDatasetToXml = (
  pud: PncUpdateDataset,
  addFalseHasErrorAttributes: boolean = true,
  includeExceptions: boolean = true
): AhoXml => {
  const pudClone: PncUpdateDataset = structuredClone(pud)
  addNullElementsForExceptions(pudClone)

  const xmlPud = mapPncUpdateDatasetToXml(pudClone, includeExceptions)

  if ((includeExceptions && pudClone.Exceptions.length > 0) || addFalseHasErrorAttributes) {
    addExceptionsToPncUpdateDatasetXml(xmlPud, pudClone.Exceptions, addFalseHasErrorAttributes)
  }

  if (!includeExceptions && xmlPud["br7:AnnotatedHearingOutcome"]?.["br7:HasError"]?.["#text"]) {
    if (xmlPud["?xml"]) {
      xmlPud["?xml"]["@_standalone"] = undefined
    }

    xmlPud["br7:AnnotatedHearingOutcome"]["br7:HasError"]["#text"] = String(pudClone.Exceptions.length > 0)
  }

  return xmlPud
}

const convertAhoToXml = (
  hearingOutcome: AnnotatedHearingOutcome,
  validate = true,
  generateFalseHasErrorAttributes = false
): AhoXml => {
  const hearingOutcomeClone: AnnotatedHearingOutcome = structuredClone(hearingOutcome)
  addNullElementsForExceptions(hearingOutcomeClone)

  const xmlAho = mapAhoToXml(hearingOutcomeClone, validate)
  if (validate) {
    addExceptionsToAhoXml(xmlAho, hearingOutcomeClone.Exceptions)
  } else if (generateFalseHasErrorAttributes) {
    addFalseHasErrorAttributesToAhoXml(xmlAho)
  }

  return xmlAho
}

const serialiseToXml = (
  hearingOutcome: AnnotatedHearingOutcome,
  validate = true,
  generateFalseHasErrorAttributes = false
): string => {
  const xmlAho = convertAhoToXml(hearingOutcome, validate, generateFalseHasErrorAttributes)

  return generateXml(xmlAho)
}

export default serialiseToXml
export { convertAhoToXml, convertPncUpdateDatasetToXml }
