import { format } from "date-fns"
import { XMLBuilder } from "fast-xml-parser"
import type {
  AnnotatedHearingOutcome,
  Case,
  Duration,
  Hearing,
  Offence,
  OffenceReason,
  OrganisationUnitCodes,
  Result,
  Urgent
} from "src/types/AnnotatedHearingOutcome"
import type Exception from "src/types/Exception"
import type { PNCDisposal, PncOffence, PncQueryResult } from "src/types/PncQueryResult"
import type {
  Adj,
  Br7Case,
  Br7Duration,
  Br7Hearing,
  Br7LiteralTextString,
  Br7Offence,
  Br7OffenceReason,
  Br7OrganisationUnit,
  Br7Result,
  Br7TextString,
  Br7Urgent,
  Cxe01,
  DISList,
  RawAho,
  RawAhoPncOffence
} from "src/types/RawAho"
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
} from "src/use-cases/dataLookup"
import addExceptionsToRawAho from "./addExceptionsToRawAho"

const hasError = (exceptions: Exception[] | undefined, path: (string | number)[] = []): boolean => {
  if (!exceptions || exceptions.length === 0) {
    return false
  }
  if (path.length > 0) {
    const currentPath = path.join("")
    return exceptions.some((e) => e.path.join("").startsWith(currentPath))
  }
  return false
}

enum LiteralType {
  OffenceRemandStatus,
  YesNo,
  PleaStatus,
  AlcoholLevelMethod,
  Gender,
  CourtType
}

const literal = (value: string | boolean, type: LiteralType): Br7LiteralTextString => {
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
  } else if (type === LiteralType.OffenceRemandStatus) {
    literalText = value
    literalAttribute = lookupRemandStatusByCjsCode(value)?.description
  } else if (type === LiteralType.PleaStatus) {
    literalText = value
    literalAttribute = lookupPleaStatusByCjsCode(value)?.description
  } else if (type === LiteralType.AlcoholLevelMethod) {
    literalText = value
    literalAttribute = lookupAlcoholLevelMethodByCjsCode(value)?.description
  } else if (type === LiteralType.Gender) {
    literalText = value
    literalAttribute = lookupGenderByCjsCode(value)?.description
  } else if (type === LiteralType.CourtType) {
    literalText = value
    literalAttribute = lookupCourtTypeByCjsCode(value)?.description
  } else {
    throw new Error("Invalid literal type specified")
  }

  if (!literalAttribute || literalText === undefined) {
    throw new Error("Literal lookup not found")
  }

  return { "#text": literalText, "@_Literal": literalAttribute }
}

const optionalLiteral = (value: string | boolean | undefined, type: LiteralType): Br7LiteralTextString | undefined => {
  if (value === undefined) {
    return undefined
  }
  return literal(value, type)
}

const text = (t: string): Br7TextString => ({ "#text": t })
const optionalText = (t: string | undefined): Br7TextString | undefined => (t ? { "#text": t } : undefined)

const mapAhoOrgUnitToXml = (orgUnit: OrganisationUnitCodes): Br7OrganisationUnit => ({
  "ds:TopLevelCode": optionalText(orgUnit.TopLevelCode),
  "ds:SecondLevelCode": text(orgUnit.SecondLevelCode),
  "ds:ThirdLevelCode": text(orgUnit.ThirdLevelCode),
  "ds:BottomLevelCode": text(orgUnit.BottomLevelCode),
  "ds:OrganisationUnitCode": text(orgUnit.OrganisationUnitCode),
  "@_SchemaVersion": "2.0"
})

const mapAhoUrgentToXml = (urgent: Urgent): Br7Urgent => ({
  "br7:urgent": { "#text": urgent.urgent ? "Y" : "N", "@_Literal": urgent.urgent ? "Yes" : "No" },
  "br7:urgency": text(urgent.urgency.toString())
})

const mapAhoDuration = (duration: Duration[]): Br7Duration[] =>
  duration.map((d) => ({
    "ds:DurationType": text(d.DurationType),
    "ds:DurationUnit": text(d.DurationUnit),
    "ds:DurationLength": d.DurationLength
  }))

const mapAhoResultsToXml = (results: Result[], exceptions: Exception[] | undefined): Br7Result[] =>
  results.map((result) => ({
    "ds:CJSresultCode": text(result.CJSresultCode.toString()),
    "ds:OffenceRemandStatus": optionalLiteral(result.OffenceRemandStatus, LiteralType.OffenceRemandStatus),
    "ds:SourceOrganisation": mapAhoOrgUnitToXml(result.SourceOrganisation),
    "ds:CourtType": optionalText(result.CourtType),
    "ds:ResultHearingType": result.ResultHearingType
      ? { "#text": result.ResultHearingType, "@_Literal": "Other" }
      : undefined,
    "ds:ResultHearingDate": optionalText(
      result.ResultHearingDate ? format(result.ResultHearingDate, "yyyy-MM-dd") : undefined
    ),
    "ds:BailCondition": result.BailCondition?.map(text),
    "ds:NextResultSourceOrganisation": result.NextResultSourceOrganisation
      ? {
          "@_SchemaVersion": "2.0",
          "ds:TopLevelCode": optionalText(result.NextResultSourceOrganisation?.TopLevelCode),
          "ds:SecondLevelCode": text(result.NextResultSourceOrganisation?.SecondLevelCode),
          "ds:ThirdLevelCode": text(result.NextResultSourceOrganisation?.ThirdLevelCode),
          "ds:BottomLevelCode": text(result.NextResultSourceOrganisation?.BottomLevelCode),
          "ds:OrganisationUnitCode": text(result.NextResultSourceOrganisation?.OrganisationUnitCode)
        }
      : undefined,
    "ds:NextCourtType": optionalText(result.NextCourtType),
    "ds:NextHearingDate": optionalText(
      result.NextHearingDate ? format(result.NextHearingDate, "yyyy-MM-dd") : undefined
    ),
    "ds:NextHearingTime": optionalText(result.NextHearingTime?.split(":").slice(0, 2).join(":")),
    "ds:Duration": result.Duration ? mapAhoDuration(result.Duration) : undefined,
    "ds:AmountSpecifiedInResult": result.AmountSpecifiedInResult?.map((amount) => ({
      "#text": amount.toFixed(2),
      "@_Type": "Fine"
    })),
    "ds:PleaStatus": optionalLiteral(result.PleaStatus, LiteralType.PleaStatus),
    "ds:Verdict": result.Verdict
      ? {
          "#text": result.Verdict,
          "@_Literal": result.Verdict ? lookupVerdictByCjsCode(result.Verdict)?.description : undefined
        }
      : undefined,
    "ds:ModeOfTrialReason": result.ModeOfTrialReason
      ? {
          "#text": result.ModeOfTrialReason,
          "@_Literal": result.ModeOfTrialReason
            ? lookupModeOfTrialReasonByCjsCode(result.ModeOfTrialReason)?.description
            : undefined
        }
      : undefined,
    "ds:ResultVariableText": optionalText(result.ResultVariableText),
    "ds:WarrantIssueDate": result.WarrantIssueDate ? text(format(result.WarrantIssueDate, "yyyy-MM-dd")) : undefined,
    "ds:ResultHalfLifeHours": result.ResultHalfLifeHours ? text(result.ResultHalfLifeHours.toString()) : undefined,
    "br7:PNCDisposalType": result.PNCDisposalType ? text(result.PNCDisposalType.toString()) : undefined,
    "br7:ResultClass": optionalText(result.ResultClass),
    "br7:ReasonForOffenceBailConditions": optionalText(result.ReasonForOffenceBailConditions),
    "br7:Urgent": result.Urgent ? mapAhoUrgentToXml(result.Urgent) : undefined,
    "br7:PNCAdjudicationExists":
      result.PNCAdjudicationExists !== undefined
        ? { "#text": result.PNCAdjudicationExists ? "Y" : "N", "@_Literal": "No" }
        : undefined,
    "br7:NumberOfOffencesTIC": optionalText(result.NumberOfOffencesTIC?.toString()),
    "br7:ResultQualifierVariable": result.ResultQualifierVariable.map((rqv) => ({
      "@_SchemaVersion": "3.0",
      "ds:Code": text(rqv.Code)
    })),
    "br7:ConvictingCourt": optionalText(result.ConvictingCourt),
    "@_hasError": hasError(exceptions, ["AnnotatedHearingOutcome", "HearingOutcome", "Case"]),
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
      case "NonMatchingOffenceCode":
        return {
          "ds:OffenceCode": {
            "ds:ActOrSource": text(offenceReason.OffenceCode.ActOrSource),
            "ds:Year": optionalText(offenceReason.OffenceCode.Year),
            "ds:Reason": text(offenceReason.OffenceCode.Reason),
            "ds:Qualifier": optionalText(offenceReason.OffenceCode.Qualifier)
          }
        }
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
    }
  }
}

const mapAhoOffencesToXml = (offences: Offence[], exceptions: Exception[] | undefined): Br7Offence[] =>
  offences.map((offence, index) => ({
    "ds:CriminalProsecutionReference": {
      "ds:DefendantOrOffender": {
        "ds:Year": optionalText(offence.CriminalProsecutionReference.DefendantOrOffender?.Year),
        "ds:OrganisationUnitIdentifierCode": {
          "ds:SecondLevelCode": text(
            offence.CriminalProsecutionReference.DefendantOrOffender.OrganisationUnitIdentifierCode.SecondLevelCode
          ),
          "ds:ThirdLevelCode": text(
            offence.CriminalProsecutionReference.DefendantOrOffender.OrganisationUnitIdentifierCode.ThirdLevelCode
          ),
          "ds:BottomLevelCode": text(
            offence.CriminalProsecutionReference.DefendantOrOffender.OrganisationUnitIdentifierCode.BottomLevelCode
          ),
          "ds:OrganisationUnitCode": text(
            offence.CriminalProsecutionReference.DefendantOrOffender.OrganisationUnitIdentifierCode.OrganisationUnitCode
          ),
          "@_SchemaVersion": "2.0"
        },
        "ds:DefendantOrOffenderSequenceNumber": text(
          offence.CriminalProsecutionReference.DefendantOrOffender?.DefendantOrOffenderSequenceNumber
        ),
        "ds:CheckDigit": text(offence.CriminalProsecutionReference.DefendantOrOffender?.CheckDigit)
      },
      "ds:OffenceReason": offence.CriminalProsecutionReference.OffenceReason
        ? mapAhoOffenceReasonToXml(offence.CriminalProsecutionReference.OffenceReason)
        : undefined,
      "ds:OffenceReasonSequence": optionalText(
        offence.CriminalProsecutionReference.OffenceReasonSequence?.toString().padStart(3, "0")
      ),
      "@_SchemaVersion": "2.0"
    },
    "ds:OffenceCategory": {
      "#text": String(offence.OffenceCategory),
      "@_Literal": offence.OffenceCategory
        ? lookupOffenceCategoryByCjsCode(offence.OffenceCategory)?.description
        : undefined
    },
    "ds:ArrestDate": offence.ArrestDate ? text(format(offence.ArrestDate, "yyyy-MM-dd")) : undefined,
    "ds:ChargeDate": offence.ChargeDate ? text(format(offence.ChargeDate, "yyyy-MM-dd")) : undefined,
    "ds:ActualOffenceDateCode": {
      "#text": offence.ActualOffenceDateCode,
      "@_Literal": offence.ActualOffenceDateCode
        ? lookupOffenceDateCodeByCjsCode(offence.ActualOffenceDateCode)?.description
        : undefined
    },
    "ds:ActualOffenceStartDate": {
      "ds:StartDate": text(format(offence.ActualOffenceStartDate.StartDate, "yyyy-MM-dd"))
    },
    "ds:ActualOffenceEndDate":
      offence.ActualOffenceEndDate && offence.ActualOffenceEndDate.EndDate
        ? {
            "ds:EndDate": offence.ActualOffenceEndDate?.EndDate
              ? text(format(offence.ActualOffenceEndDate.EndDate, "yyyy-MM-dd"))
              : undefined
          }
        : undefined,
    "ds:LocationOfOffence": text(offence.LocationOfOffence),
    "ds:OffenceTitle": optionalText(offence.OffenceTitle),
    "ds:ActualOffenceWording": text(offence.ActualOffenceWording),
    "ds:RecordableOnPNCindicator": optionalLiteral(offence.RecordableOnPNCindicator, LiteralType.YesNo),
    "ds:NotifiableToHOindicator": optionalLiteral(offence.NotifiableToHOindicator, LiteralType.YesNo),
    "ds:HomeOfficeClassification": optionalText(offence.HomeOfficeClassification),
    "ds:AlcoholLevel": offence.AlcoholLevel
      ? {
          "ds:Amount": text(offence.AlcoholLevel?.Amount),
          "ds:Method": literal(offence.AlcoholLevel.Method, LiteralType.AlcoholLevelMethod)
        }
      : undefined,
    "ds:ConvictionDate": offence.ConvictionDate ? text(format(offence.ConvictionDate, "yyyy-MM-dd")) : undefined,
    "br7:CommittedOnBail": { "#text": String(offence.CommittedOnBail), "@_Literal": "Don't Know" },
    "br7:CourtOffenceSequenceNumber": text(offence.CourtOffenceSequenceNumber.toString()),
    "br7:AddedByTheCourt": optionalLiteral(offence.AddedByTheCourt, LiteralType.YesNo),
    "br7:CourtCaseReferenceNumber": optionalText(offence.CourtCaseReferenceNumber),
    "br7:Result": mapAhoResultsToXml(offence.Result, exceptions),
    "@_hasError": hasError(exceptions, [
      "AnnotatedHearingOutcome",
      "HearingOutcome",
      "Case",
      "HearingDefendant",
      "Offence",
      index
    ]),
    "@_SchemaVersion": "4.0"
  }))

const mapAhoCaseToXml = (c: Case, exceptions: Exception[] | undefined): Br7Case => ({
  "ds:PTIURN": text(c.PTIURN),
  "ds:PreChargeDecisionIndicator": literal(c.PreChargeDecisionIndicator, LiteralType.YesNo),
  "ds:CourtCaseReferenceNumber": optionalText(c.CourtCaseReferenceNumber),
  "br7:CourtReference": { "ds:MagistratesCourtReference": text(c.CourtReference.MagistratesCourtReference) },
  "br7:PenaltyNoticeCaseReference": optionalText(c.PenaltyNoticeCaseReferenceNumber),
  "br7:RecordableOnPNCindicator": optionalLiteral(c.RecordableOnPNCindicator, LiteralType.YesNo),
  "br7:Urgent": c.Urgent ? mapAhoUrgentToXml(c.Urgent) : undefined,
  "br7:ForceOwner": c.ForceOwner ? mapAhoOrgUnitToXml(c.ForceOwner) : undefined,
  "br7:HearingDefendant": {
    "br7:ArrestSummonsNumber": text(c.HearingDefendant.ArrestSummonsNumber),
    "br7:PNCIdentifier": optionalText(c.HearingDefendant.PNCIdentifier),
    "br7:PNCCheckname": optionalText(c.HearingDefendant.PNCCheckname),
    "br7:DefendantDetail": {
      "br7:PersonName": {
        "ds:Title": optionalText(c.HearingDefendant.DefendantDetail.PersonName.Title),
        "ds:GivenName": {
          "#text": c.HearingDefendant.DefendantDetail.PersonName.GivenName.join(" "),
          "@_NameSequence": "1"
        },
        "ds:FamilyName": { "#text": c.HearingDefendant.DefendantDetail.PersonName.FamilyName, "@_NameSequence": "1" }
      },
      "br7:GeneratedPNCFilename": optionalText(c.HearingDefendant.DefendantDetail.GeneratedPNCFilename),
      "br7:BirthDate": c.HearingDefendant.DefendantDetail.BirthDate
        ? text(format(c.HearingDefendant.DefendantDetail.BirthDate, "yyyy-MM-dd"))
        : undefined,
      "br7:Gender": literal(c.HearingDefendant.DefendantDetail.Gender.toString(), LiteralType.Gender)
    },
    "br7:Address": {
      "ds:AddressLine1": text(c.HearingDefendant.Address.AddressLine1),
      "ds:AddressLine2": optionalText(c.HearingDefendant.Address.AddressLine2),
      "ds:AddressLine3": optionalText(c.HearingDefendant.Address.AddressLine3)
    },
    "br7:RemandStatus": literal(c.HearingDefendant.RemandStatus, LiteralType.OffenceRemandStatus),
    "br7:BailConditions":
      c.HearingDefendant.BailConditions.length > 0 ? c.HearingDefendant.BailConditions.map(text) : undefined,
    "br7:ReasonForBailConditions": optionalText(c.HearingDefendant.ReasonForBailConditions),
    "br7:CourtPNCIdentifier": optionalText(c.HearingDefendant.CourtPNCIdentifier),
    "br7:Offence": mapAhoOffencesToXml(c.HearingDefendant.Offence, exceptions),
    "@_hasError": hasError(exceptions, ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant"])
  },
  "@_hasError": hasError(exceptions, ["AnnotatedHearingOutcome", "HearingOutcome", "Case"]),
  "@_SchemaVersion": "4.0"
})

const mapOffenceADJ = (adjudication: {
  verdict: string
  sentenceDate: string
  offenceTICNumber: number
  plea: string
  weedFlag?: string
}): Adj => ({
  "@_Adjudication1": adjudication.verdict,
  "@_DateOfSentence": adjudication.sentenceDate,
  "@_IntfcUpdateType": "",
  "@_OffenceTICNumber": String(adjudication.offenceTICNumber),
  "@_Plea": adjudication.plea,
  "@_WeedFlag": adjudication.weedFlag ?? ""
})

const mapOffenceDIS = (disposals: PNCDisposal[]): DISList => ({
  DIS: disposals.map((d) => ({
    "@_IntfcUpdateType": "I",
    "@_QtyDate": d.qtyDate,
    "@_QtyDuration": d.qtyDuration,
    "@_QtyMonetaryValue": d.qtyMonetaryValue ?? "",
    "@_QtyUnitsFined": d.qtyUnitsFined,
    "@_Qualifiers": d.qualifiers,
    "@_Text": d.text,
    "@_Type": String(d.type)
  }))
})

const mapAhoHearingToXml = (hearing: Hearing, exceptions: Exception[] | undefined): Br7Hearing => ({
  "ds:CourtHearingLocation": mapAhoOrgUnitToXml(hearing.CourtHearingLocation),
  "ds:DateOfHearing": text(format(hearing.DateOfHearing, "yyyy-MM-dd")),
  "ds:TimeOfHearing": text(hearing.TimeOfHearing),
  "ds:HearingLanguage": { "#text": hearing.HearingLanguage, "@_Literal": "Don't Know" },
  "ds:HearingDocumentationLanguage": { "#text": hearing.HearingDocumentationLanguage, "@_Literal": "Don't Know" },
  "ds:DefendantPresentAtHearing": {
    "#text": hearing.DefendantPresentAtHearing,
    "@_Literal": lookupDefendantPresentAtHearingByCjsCode(hearing.DefendantPresentAtHearing)?.description
  },
  "br7:SourceReference": {
    "br7:DocumentName": text(hearing.SourceReference.DocumentName),
    "br7:UniqueID": text(hearing.SourceReference.UniqueID),
    "br7:DocumentType": text(hearing.SourceReference.DocumentType)
  },
  "br7:CourtType": optionalLiteral(hearing.CourtType, LiteralType.CourtType),
  "br7:CourtHouseCode": text(hearing.CourtHouseCode.toString()),
  "br7:CourtHouseName": optionalText(hearing.CourtHouseName),
  "@_hasError": hasError(exceptions, ["AnnotatedHearingOutcome", "HearingOutcome", "Hearing"]),
  "@_SchemaVersion": "4.0"
})

const mapAhoPncOffencesToXml = (offences: PncOffence[]): RawAhoPncOffence[] =>
  offences.map((offence) => ({
    COF: {
      "@_ACPOOffenceCode": offence.offence.acpoOffenceCode,
      "@_CJSOffenceCode": offence.offence.cjsOffenceCode,
      "@_IntfcUpdateType": "K",
      "@_OffEndDate": offence.offence.endDate ? format(offence.offence.endDate, "ddMMyyyy") : "",
      "@_OffEndTime": offence.offence.endTime?.replace(":", "") ?? "",
      "@_OffStartDate": format(offence.offence.startDate, "ddMMyyyy") ?? "",
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
  CourtCases: pncQuery.courtCases
    ? {
        CourtCase: pncQuery.courtCases?.map((c) => ({
          CCR: { "@_CourtCaseRefNo": c.courtCaseReference, "@_CrimeOffenceRefNo": "", "@_IntfcUpdateType": "K" },
          Offences: {
            Offence: mapAhoPncOffencesToXml(c.offences)
          }
        }))
      }
    : undefined,
  PenaltyCases: pncQuery.penaltyCases
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

const mapAhoToXml = (aho: AnnotatedHearingOutcome): RawAho => {
  return {
    "?xml": { "@_version": "1.0", "@_encoding": "UTF-8", "@_standalone": "yes" },
    "br7:AnnotatedHearingOutcome": {
      "br7:HearingOutcome": {
        "br7:Hearing": mapAhoHearingToXml(aho.AnnotatedHearingOutcome.HearingOutcome.Hearing, aho.Exceptions),
        "br7:Case": mapAhoCaseToXml(aho.AnnotatedHearingOutcome.HearingOutcome.Case, aho.Exceptions)
      },
      "br7:HasError": hasError(aho.Exceptions),
      CXE01: aho.PncQuery ? mapAhoCXE01ToXml(aho.PncQuery) : undefined,
      "br7:PNCQueryDate": aho.PncQueryDate ? format(aho.PncQueryDate, "yyyy-MM-dd") : undefined,
      "@_xmlns:br7": "http://schemas.cjse.gov.uk/datastandards/BR7/2007-12",
      "@_xmlns:ds": "http://schemas.cjse.gov.uk/datastandards/2006-10",
      "@_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"
    }
  } as RawAho
}

const convertAhoToXml = (hearingOutcome: AnnotatedHearingOutcome): string => {
  const options = {
    ignoreAttributes: false,
    suppressEmptyNode: true,
    processEntities: false,
    suppressBooleanAttributes: false,
    tagValueProcessor: (_: string, value: string) => {
      if (typeof value === "string") {
        return value.replace("&", "&amp;")
      }
      return value
    }
  }

  const builder = new XMLBuilder(options)
  const xmlAho = mapAhoToXml(hearingOutcome)
  addExceptionsToRawAho(xmlAho, hearingOutcome.Exceptions)
  const xml = builder.build(xmlAho)

  return xml
}

export default convertAhoToXml
