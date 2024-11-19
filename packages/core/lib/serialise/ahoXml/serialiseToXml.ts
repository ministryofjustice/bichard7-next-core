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
    if (type === LiteralType.OffenceRemandStatus) {
      literalAttribute = lookupRemandStatusByCjsCode(value)?.description
    } else if (type === LiteralType.PleaStatus) {
      literalAttribute = lookupPleaStatusByCjsCode(value)?.description
    } else if (type === LiteralType.AlcoholLevelMethod) {
      literalAttribute = lookupAlcoholLevelMethodByCjsCode(value)?.description
    } else if (type === LiteralType.Gender) {
      literalAttribute = lookupGenderByCjsCode(value)?.description
    } else if (type === LiteralType.CourtType) {
      literalAttribute = lookupCourtTypeByCjsCode(value)?.description
    } else if (type === LiteralType.Verdict) {
      literalAttribute = lookupVerdictByCjsCode(value)?.description
    } else if (type === LiteralType.ModeOfTrialReason) {
      literalAttribute = lookupModeOfTrialReasonByCjsCode(value)?.description
    } else if (type === LiteralType.OffenceCategory) {
      literalAttribute = lookupOffenceCategoryByCjsCode(value)?.description
    } else if (type === LiteralType.ActualOffenceDateCode) {
      literalAttribute = lookupOffenceDateCodeByCjsCode(value)?.description
    } else if (type === LiteralType.DefendantPresentAtHearing) {
      literalAttribute = lookupDefendantPresentAtHearingByCjsCode(value)?.description
    } else {
      throw new Error("Invalid literal type specified")
    }
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
  "@_SchemaVersion": "2.0",
  "ds:BottomLevelCode": nullText(orgUnit.BottomLevelCode),
  "ds:OrganisationUnitCode": nullText(orgUnit.OrganisationUnitCode),
  "ds:SecondLevelCode": nullText(orgUnit.SecondLevelCode),
  "ds:ThirdLevelCode": nullText(orgUnit.ThirdLevelCode),
  "ds:TopLevelCode": optionalText(orgUnit.TopLevelCode)
})

const mapAhoUrgentToXml = (urgent: Urgent): Br7Urgent => ({
  "br7:urgency": text(urgent.urgency.toString()),
  "br7:urgent": literal(urgent.urgent, LiteralType.YesNo)
})

const mapAhoDuration = (duration: Duration[]): Br7Duration[] =>
  duration.map((d) => ({
    "ds:DurationLength": text(d.DurationLength.toString()),
    "ds:DurationType": text(d.DurationType),
    "ds:DurationUnit": text(d.DurationUnit)
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
      BottomLevelCode: "",
      OrganisationUnitCode: "",
      SecondLevelCode: "",
      ThirdLevelCode: ""
    })
  }

  if (!ou) {
    return undefined
  }

  return mapAhoOrgUnitToXml(ou)
}

const mapAhoResultsToXml = (results: Result[]): Br7Result[] =>
  results.map((result) => ({
    "@_SchemaVersion": "2.0",
    "br7:ConvictingCourt": optionalText(result.ConvictingCourt),
    "br7:NumberOfOffencesTIC": optionalText(result.NumberOfOffencesTIC?.toString()),
    "br7:PNCAdjudicationExists": optionalLiteral(result.PNCAdjudicationExists, LiteralType.YesNo),
    "br7:PNCDisposalType": optionalText(result.PNCDisposalType?.toString()),
    "br7:ReasonForOffenceBailConditions": optionalText(result.ReasonForOffenceBailConditions),
    "br7:ResultClass": optionalText(result.ResultClass),
    "br7:ResultQualifierVariable": result.ResultQualifierVariable.map((rqv) => ({
      "@_SchemaVersion": "3.0",
      "ds:Code": text(rqv.Code)
    })),
    "br7:Urgent": result.Urgent ? mapAhoUrgentToXml(result.Urgent) : undefined,
    // ds:TimeSpecifiedInResult
    "ds:AmountSpecifiedInResult": result.AmountSpecifiedInResult?.map((amount) => ({
      "#text": amount.Amount.toFixed(amount.DecimalPlaces),
      "@_Type": amount.Type ?? ""
    })),
    "ds:BailCondition": result.BailCondition?.map(text),
    "ds:CJSresultCode": text(result.CJSresultCode.toString()),
    "ds:CourtType": optionalText(result.CourtType) ?? { "#text": "" },
    "ds:DateSpecifiedInResult": mapDateSpecifiedInResult(result.DateSpecifiedInResult),
    "ds:Duration": result.Duration ? mapAhoDuration(result.Duration) : undefined,
    "ds:ModeOfTrialReason": optionalLiteral(result.ModeOfTrialReason, LiteralType.ModeOfTrialReason),
    "ds:NextCourtType": optionalText(result.NextCourtType),
    // ds:NextHearingType
    "ds:NextHearingDate":
      result.NextHearingDate === null ? nullText(result.NextHearingDate) : optionalFormatText(result.NextHearingDate),
    "ds:NextHearingTime": optionalText(result.NextHearingTime?.split(":").slice(0, 2).join(":")),
    "ds:NextResultSourceOrganisation": mapNextResultSourceOrganisation(result.NextResultSourceOrganisation),
    "ds:NumberSpecifiedInResult": mapNumberSpecifiedInResult(result.NumberSpecifiedInResult),
    "ds:OffenceRemandStatus": optionalLiteral(result.OffenceRemandStatus, LiteralType.OffenceRemandStatus),
    "ds:PleaStatus": optionalLiteral(result.PleaStatus, LiteralType.PleaStatus),
    "ds:ResultHalfLifeHours": optionalText(result.ResultHalfLifeHours?.toString()),
    "ds:ResultHearingDate": optionalFormatText(result.ResultHearingDate),
    "ds:ResultHearingType": result.ResultHearingType
      ? { "#text": result.ResultHearingType, "@_Literal": "Other" }
      : undefined,
    "ds:ResultVariableText": optionalText(result.ResultVariableText),
    "ds:SourceOrganisation": mapAhoOrgUnitToXml(result.SourceOrganisation),
    "ds:Verdict": optionalLiteral(result.Verdict, LiteralType.Verdict),
    "ds:WarrantIssueDate": optionalFormatText(result.WarrantIssueDate)
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
            "ds:Qualifier": optionalText(offenceReason.OffenceCode.Qualifier),
            "ds:Reason": text(offenceReason.OffenceCode.Reason)
          }
        }
      case "IndictmentOffenceCode":
        return {
          "ds:OffenceCode": {
            "ds:Qualifier": optionalText(offenceReason.OffenceCode.Qualifier),
            "ds:Reason": text(offenceReason.OffenceCode.Reason)
          }
        }
      case "NonMatchingOffenceCode":
        return {
          "ds:OffenceCode": {
            "ds:ActOrSource": text(offenceReason.OffenceCode.ActOrSource),
            "ds:Qualifier": optionalText(offenceReason.OffenceCode.Qualifier),
            "ds:Reason": text(offenceReason.OffenceCode.Reason),
            "ds:Year": optionalText(offenceReason.OffenceCode.Year)
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
    "ds:CheckDigit": text(defendantOrOffender.CheckDigit),
    "ds:DefendantOrOffenderSequenceNumber": text(defendantOrOffender.DefendantOrOffenderSequenceNumber),
    "ds:OrganisationUnitIdentifierCode": mapAhoOrgUnitToXml(defendantOrOffender.OrganisationUnitIdentifierCode),
    "ds:Year": defendantOrOffender.Year !== null ? text(defendantOrOffender.Year) : { "#text": "" }
  }
}

const mapAhoOffencesToXml = (offences: Offence[]): Br7Offence[] =>
  offences.map((offence) => ({
    "@_SchemaVersion": "4.0",
    "br7:AddedByTheCourt": optionalLiteral(offence.AddedByTheCourt, LiteralType.YesNo),
    "br7:CommittedOnBail": { "#text": offence.CommittedOnBail, "@_Literal": "Don't Know" },
    "br7:CourtCaseReferenceNumber":
      offence.CourtCaseReferenceNumber === null ? { "#text": "" } : optionalText(offence.CourtCaseReferenceNumber),
    "br7:CourtOffenceSequenceNumber": text(offence.CourtOffenceSequenceNumber.toString()),
    "br7:ManualCourtCaseReference": optionalLiteral(offence.ManualCourtCaseReference, LiteralType.YesNo),
    "br7:ManualSequenceNo": optionalLiteral(offence.ManualSequenceNumber, LiteralType.YesNo),
    "br7:Result": mapAhoResultsToXml(offence.Result),
    "ds:ActualOffenceDateCode": literal(offence.ActualOffenceDateCode, LiteralType.ActualOffenceDateCode),
    "ds:ActualOffenceEndDate":
      offence.ActualOffenceEndDate && offence.ActualOffenceEndDate.EndDate
        ? {
            "ds:EndDate": optionalFormatText(offence.ActualOffenceEndDate.EndDate)
          }
        : undefined,
    "ds:ActualOffenceStartDate": {
      "ds:StartDate": text(toISODate(offence.ActualOffenceStartDate.StartDate))
    },
    "ds:ActualOffenceWording": text(offence.ActualOffenceWording),
    "ds:AlcoholLevel": offence.AlcoholLevel
      ? {
          "ds:Amount": text(offence.AlcoholLevel?.Amount.toString()),
          "ds:Method": literal(offence.AlcoholLevel.Method, LiteralType.AlcoholLevelMethod)
        }
      : undefined,
    "ds:ArrestDate": optionalFormatText(offence.ArrestDate),
    "ds:ChargeDate": optionalFormatText(offence.ChargeDate),
    "ds:ConvictionDate": optionalFormatText(offence.ConvictionDate),
    "ds:CriminalProsecutionReference": {
      "@_SchemaVersion": "2.0",
      "ds:DefendantOrOffender": mapDefendantOrOffender(offence.CriminalProsecutionReference.DefendantOrOffender),
      "ds:OffenceReason": offence.CriminalProsecutionReference.OffenceReason
        ? mapAhoOffenceReasonToXml(offence.CriminalProsecutionReference.OffenceReason)
        : undefined,
      "ds:OffenceReasonSequence":
        offence.CriminalProsecutionReference.OffenceReasonSequence === null
          ? {}
          : optionalText(offence.CriminalProsecutionReference.OffenceReasonSequence)
    },
    "ds:HomeOfficeClassification": optionalText(offence.HomeOfficeClassification),
    "ds:LocationOfOffence": optionalText(offence.LocationOfOffence),
    "ds:NotifiableToHOindicator": optionalLiteral(offence.NotifiableToHOindicator, LiteralType.YesNo),
    "ds:OffenceCategory": optionalLiteral(offence.OffenceCategory, LiteralType.OffenceCategory),
    "ds:OffenceTitle": optionalText(offence.OffenceTitle),
    "ds:RecordableOnPNCindicator": optionalLiteral(offence.RecordableOnPNCindicator, LiteralType.YesNo)
  }))

const mapAhoCaseToXml = (c: Case): Br7Case => ({
  "@_SchemaVersion": "4.0",
  "br7:CourtReference": { "ds:MagistratesCourtReference": text(c.CourtReference.MagistratesCourtReference) },
  "br7:ForceOwner": c.ForceOwner ? mapAhoOrgUnitToXml(c.ForceOwner) : undefined,
  "br7:HearingDefendant": {
    "br7:Address": {
      "ds:AddressLine1": text(c.HearingDefendant.Address.AddressLine1),
      "ds:AddressLine2": optionalText(c.HearingDefendant.Address.AddressLine2),
      "ds:AddressLine3": optionalText(c.HearingDefendant.Address.AddressLine3),
      "ds:AddressLine4": optionalText(c.HearingDefendant.Address.AddressLine4),
      "ds:AddressLine5": optionalText(c.HearingDefendant.Address.AddressLine5)
    },
    "br7:ArrestSummonsNumber": text(c.HearingDefendant.ArrestSummonsNumber),
    "br7:BailConditions":
      c.HearingDefendant.BailConditions.length > 0
        ? c.HearingDefendant.BailConditions.map((bc) => {
            const bcText = text(bc)
            bcText["#text"] = bcText["#text"].trim()
            return bcText
          })
        : undefined,
    "br7:CourtPNCIdentifier": optionalText(c.HearingDefendant.CourtPNCIdentifier),
    "br7:DefendantDetail": c.HearingDefendant.DefendantDetail
      ? {
          "br7:BirthDate": optionalFormatText(c.HearingDefendant.DefendantDetail.BirthDate),
          "br7:Gender": literal(c.HearingDefendant.DefendantDetail.Gender.toString(), LiteralType.Gender),
          "br7:GeneratedPNCFilename": optionalText(c.HearingDefendant.DefendantDetail.GeneratedPNCFilename),
          "br7:PersonName": {
            "ds:FamilyName": {
              "#text": c.HearingDefendant.DefendantDetail.PersonName.FamilyName,
              "@_NameSequence": "1"
            },
            "ds:GivenName": c.HearingDefendant.DefendantDetail.PersonName.GivenName?.map((name, index) => ({
              "#text": name,
              "@_NameSequence": `${index + 1}`
            })),
            "ds:Title": optionalText(c.HearingDefendant.DefendantDetail.PersonName.Title)
          }
        }
      : undefined,
    "br7:Offence": mapAhoOffencesToXml(c.HearingDefendant.Offence),
    "br7:OrganisationName": optionalText(c.HearingDefendant.OrganisationName),
    "br7:PNCCheckname": optionalText(c.HearingDefendant.PNCCheckname),
    "br7:PNCIdentifier": optionalText(c.HearingDefendant.PNCIdentifier),
    "br7:ReasonForBailConditions": optionalText(c.HearingDefendant.ReasonForBailConditions),
    "br7:RemandStatus": literal(c.HearingDefendant.RemandStatus, LiteralType.OffenceRemandStatus)
  },
  "br7:ManualForceOwner": optionalLiteral(c.ManualForceOwner, LiteralType.YesNo),
  "br7:PenaltyNoticeCaseReference": optionalText(c.PenaltyNoticeCaseReferenceNumber),
  "br7:RecordableOnPNCindicator": optionalLiteral(c.RecordableOnPNCindicator, LiteralType.YesNo),
  "br7:Urgent": c.Urgent ? mapAhoUrgentToXml(c.Urgent) : undefined,
  "ds:CourtCaseReferenceNumber": optionalText(c.CourtCaseReferenceNumber),
  "ds:PreChargeDecisionIndicator": literal(c.PreChargeDecisionIndicator, LiteralType.YesNo),
  "ds:PTIURN": text(c.PTIURN)
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
  "@_SchemaVersion": "4.0",
  "br7:CourtHouseCode": text(hearing.CourtHouseCode.toString()),
  "br7:CourtHouseName": optionalText(hearing.CourtHouseName),
  "br7:CourtType":
    hearing.CourtType !== null ? optionalLiteral(hearing.CourtType, LiteralType.CourtType) : { "#text": "" },
  "br7:SourceReference": {
    "br7:DocumentName": text(hearing.SourceReference.DocumentName),
    "br7:DocumentType": text(hearing.SourceReference.DocumentType),
    "br7:UniqueID": text(hearing.SourceReference.UniqueID)
  },
  "ds:CourtHearingLocation": mapAhoOrgUnitToXml(hearing.CourtHearingLocation),
  "ds:DateOfHearing": text(toISODate(hearing.DateOfHearing)),
  "ds:DefendantPresentAtHearing": literal(hearing.DefendantPresentAtHearing, LiteralType.DefendantPresentAtHearing),
  "ds:HearingDocumentationLanguage": { "#text": hearing.HearingDocumentationLanguage, "@_Literal": "Don't Know" },
  "ds:HearingLanguage": { "#text": hearing.HearingLanguage, "@_Literal": "Don't Know" },
  "ds:TimeOfHearing": text(hearing.TimeOfHearing)
})

const mapAhoPncOffencesToXml = (offences: PncOffence[]): AhoXmlPncOffence[] =>
  offences.map((offence) => ({
    ADJ: offence.adjudication ? mapOffenceADJ(offence.adjudication) : undefined,
    COF: {
      "@_ACPOOffenceCode": offence.offence.acpoOffenceCode ?? "",
      "@_CJSOffenceCode": offence.offence.cjsOffenceCode,
      "@_IntfcUpdateType": "K",
      "@_OffenceQualifier1": offence.offence.qualifier1 ?? "",
      "@_OffenceQualifier2": offence.offence.qualifier2 ?? "",
      "@_OffenceTitle": offence.offence.title ?? "",
      "@_OffEndDate": offence.offence.endDate ? toPNCDate(offence.offence.endDate) : "",
      "@_OffEndTime": offence.offence.endTime?.replace(":", "") ?? "",
      "@_OffStartDate": toPNCDate(offence.offence.startDate) ?? "",
      "@_OffStartTime": offence.offence.startTime?.replace(":", "") ?? "",
      "@_ReferenceNumber": String(offence.offence.sequenceNumber).padStart(3, "0")
    },
    DISList: offence.disposals ? mapOffenceDIS(offence.disposals) : undefined
  }))

const mapAhoCXE01ToXml = (pncQuery: PncQueryResult): Cxe01 => ({
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
  FSC: { "@_FSCode": pncQuery.forceStationCode, "@_IntfcUpdateType": "K" },
  IDS: {
    "@_Checkname": pncQuery.checkName,
    "@_CRONumber": pncQuery.croNumber ?? "",
    "@_IntfcUpdateType": "K",
    "@_PNCID": pncQuery.pncId
  },
  PenaltyCases:
    pncQuery.penaltyCases && pncQuery.penaltyCases.length > 0
      ? {
          PenaltyCase: pncQuery.penaltyCases?.map((c) => ({
            Offences: {
              Offence: mapAhoPncOffencesToXml(c.offences)
            },
            PCR: { "@_IntfcUpdateType": "K", "@_PenaltyCaseRefNo": c.penaltyCaseReference }
          }))
        }
      : undefined
})

const xmlnsTags = {
  "@_xmlns:br7": "http://schemas.cjse.gov.uk/datastandards/BR7/2007-12",
  "@_xmlns:ds": "http://schemas.cjse.gov.uk/datastandards/2006-10",
  "@_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"
}

const mapAhoToXml = (aho: AnnotatedHearingOutcome, validate = true): AhoXml => {
  const hearingOutcome = {
    "br7:HearingOutcome": {
      "br7:Case": mapAhoCaseToXml(aho.AnnotatedHearingOutcome.HearingOutcome.Case),
      "br7:Hearing": mapAhoHearingToXml(aho.AnnotatedHearingOutcome.HearingOutcome.Hearing),
      ...(!validate && xmlnsTags)
    }
  }

  const standalone = !validate && aho.Exceptions.length > 0 ? {} : { "@_standalone": "yes" }

  return {
    "?xml": { "@_encoding": "UTF-8", "@_version": "1.0", ...standalone },
    ...(validate
      ? {
          "br7:AnnotatedHearingOutcome": {
            ...hearingOutcome,
            "br7:PNCErrorMessage": optionalText(aho.PncErrorMessage),
            "br7:PNCQueryDate": aho.PncQueryDate ? optionalFormatText(aho.PncQueryDate) : undefined,
            CXE01: aho.PncQuery ? mapAhoCXE01ToXml(aho.PncQuery) : undefined,
            ...xmlnsTags
          }
        }
      : {
          ...hearingOutcome
        })
  }
}

const mapPncUpdateDatasetToXml = (pud: PncUpdateDataset): AhoXml => {
  const hearingOutcome = {
    "br7:HasError": { "#text": (!!pud.HasError).toString() },
    "br7:HearingOutcome": {
      "br7:Case": mapAhoCaseToXml(pud.AnnotatedHearingOutcome.HearingOutcome.Case),
      "br7:Hearing": mapAhoHearingToXml(pud.AnnotatedHearingOutcome.HearingOutcome.Hearing)
    }
  }

  return {
    "?xml": { "@_encoding": "UTF-8", "@_standalone": "yes", "@_version": "1.0" },
    "br7:AnnotatedHearingOutcome": {
      ...hearingOutcome,
      "br7:PNCErrorMessage": optionalText(pud.PncErrorMessage),
      "br7:PNCQueryDate": pud.PncQueryDate ? optionalFormatText(pud.PncQueryDate) : undefined,
      CXE01: pud.PncQuery ? mapAhoCXE01ToXml(pud.PncQuery) : undefined,
      ...xmlnsTags
    }
  }
}

const convertPncUpdateDatasetToXml = (pud: PncUpdateDataset, addFalseHasErrorAttributes: boolean = true): AhoXml => {
  const pudClone: PncUpdateDataset = structuredClone(pud)
  addNullElementsForExceptions(pudClone)

  const xmlPud = mapPncUpdateDatasetToXml(pudClone)

  if (pudClone.Exceptions.length > 0 || addFalseHasErrorAttributes) {
    addExceptionsToPncUpdateDatasetXml(xmlPud, pudClone.Exceptions, addFalseHasErrorAttributes)
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
