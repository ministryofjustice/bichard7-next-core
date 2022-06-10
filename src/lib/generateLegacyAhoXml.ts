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
import type { PNCDisposal, PncQueryResult } from "src/types/PncQueryResult"
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
  Br7Urgent,
  Cxe01,
  DISList,
  RawAho
} from "src/types/RawAho"
import {
  lookupDefendantPresentAtHearingByCjsCode,
  lookupModeOfTrialReasonByCjsCode,
  lookupOffenceCategoryByCjsCode,
  lookupOffenceDateCodeByCjsCode,
  lookupRemandStatusByCjsCode,
  lookupSummonsCodeByCjsCode,
  lookupVerdictByCjsCode
} from "src/use-cases/dataLookup"

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
  YesNo
}

const literal = (value: string | boolean, type: LiteralType): Br7LiteralTextString => {
  let literalText: string
  let literalAttribute: string
  if (value === undefined) {
    throw new Error("Text not supplied for required literal value")
  }

  if (type === LiteralType.OffenceRemandStatus && typeof value === "string") {
    literalText = value
    const remandStatus = lookupRemandStatusByCjsCode(value)
    if (!remandStatus) {
      throw new Error("Remand status lookup not found")
    }
    literalAttribute = remandStatus.description
  } else if (type === LiteralType.YesNo) {
    literalText = value ? "Y" : "N"
    literalAttribute = value ? "Yes" : "No"
  } else {
    throw new Error("Invalid literal type specified")
  }
  return { "#text": literalText, "@_Literal": literalAttribute }
}

const optionalLiteral = (value: string | boolean | undefined, type: LiteralType): Br7LiteralTextString | undefined => {
  if (value === undefined) {
    return undefined
  }
  return literal(value, type)
}

const mapAhoOrgUnitToXml = (orgUnit: OrganisationUnitCodes): Br7OrganisationUnit => ({
  "ds:TopLevelCode": orgUnit.TopLevelCode,
  "ds:SecondLevelCode": orgUnit.SecondLevelCode,
  "ds:ThirdLevelCode": orgUnit.ThirdLevelCode,
  "ds:BottomLevelCode": orgUnit.BottomLevelCode,
  "ds:OrganisationUnitCode": orgUnit.OrganisationUnitCode,
  "@_SchemaVersion": "2.0"
})

const mapAhoUrgentToXml = (urgent: Urgent): Br7Urgent => ({
  "br7:urgent": { "#text": urgent.urgent ? "Y" : "N", "@_Literal": urgent.urgent ? "Yes" : "No" },
  "br7:urgency": urgent.urgency
})

const mapAhoDuration = (duration: Duration[]): Br7Duration[] =>
  duration.map((d) => ({
    "ds:DurationType": d.DurationType,
    "ds:DurationUnit": d.DurationUnit,
    "ds:DurationLength": d.DurationLength
  }))

const mapAhoResultsToXml = (results: Result[], exceptions: Exception[] | undefined): Br7Result[] =>
  results.map((result) => ({
    "ds:CJSresultCode": result.CJSresultCode,
    "ds:OffenceRemandStatus": optionalLiteral(result.OffenceRemandStatus, LiteralType.OffenceRemandStatus),
    "ds:SourceOrganisation": mapAhoOrgUnitToXml(result.SourceOrganisation),
    "ds:CourtType": result.CourtType,
    "ds:ResultHearingType": { "#text": result.ResultHearingType, "@_Literal": "Other" },
    "ds:ResultHearingDate": result.ResultHearingDate ? format(result.ResultHearingDate, "yyyy-MM-dd") : undefined,
    "ds:NextResultSourceOrganisation": result.NextResultSourceOrganisation
      ? {
          "@_SchemaVersion": "2.0",
          "ds:TopLevelCode": result.NextResultSourceOrganisation?.TopLevelCode,
          "ds:SecondLevelCode": result.NextResultSourceOrganisation?.SecondLevelCode,
          "ds:ThirdLevelCode": result.NextResultSourceOrganisation?.ThirdLevelCode,
          "ds:BottomLevelCode": result.NextResultSourceOrganisation?.BottomLevelCode,
          "ds:OrganisationUnitCode": result.NextResultSourceOrganisation?.OrganisationUnitCode
        }
      : undefined,
    "ds:NextCourtType": result.NextCourtType,
    "ds:NextHearingDate": result.NextHearingDate ? format(result.NextHearingDate, "yyyy-MM-dd") : undefined,
    "ds:NextHearingTime": result.NextHearingTime?.split(":").slice(0, 2).join(":"),
    "ds:Duration": result.Duration ? mapAhoDuration(result.Duration) : undefined,
    "ds:AmountSpecifiedInResult": result.AmountSpecifiedInResult?.map((amount) => ({
      "#text": amount.toFixed(2),
      "@_Type": "Fine"
    })),
    "ds:PleaStatus": { "#text": result.PleaStatus, "@_Literal": "Not Guilty" },
    "ds:Verdict": result.Verdict
      ? {
          "#text": result.Verdict,
          "@_Literal": result.Verdict ? lookupVerdictByCjsCode(result.Verdict)?.description : undefined
        }
      : undefined,
    "ds:ModeOfTrialReason": {
      "#text": result.ModeOfTrialReason,
      "@_Literal": result.ModeOfTrialReason
        ? lookupModeOfTrialReasonByCjsCode(result.ModeOfTrialReason)?.description
        : undefined
    },
    "ds:ResultVariableText": result.ResultVariableText,
    "ds:ResultHalfLifeHours": result.ResultHalfLifeHours,
    "br7:PNCDisposalType": result.PNCDisposalType,
    "br7:ResultClass": result.ResultClass,
    "br7:Urgent": result.Urgent ? mapAhoUrgentToXml(result.Urgent) : undefined,
    "br7:PNCAdjudicationExists": { "#text": result.PNCAdjudicationExists ? "Y" : "N", "@_Literal": "No" },
    "br7:ConvictingCourt": result.ConvictingCourt,
    "@_hasError": hasError(exceptions, ["AnnotatedHearingOutcome", "HearingOutcome", "Case"]),
    "@_SchemaVersion": "2.0"
  }))

const mapAhoOffenceReasonToXml = (offenceReason: OffenceReason): Br7OffenceReason | undefined => {
  if (offenceReason.__type === "LocalOffenceReason") {
    return {
      "ds:LocalOffenceCode": {
        "ds:AreaCode": offenceReason.LocalOffenceCode.AreaCode,
        "ds:OffenceCode": { "#text": offenceReason.LocalOffenceCode.OffenceCode }
      }
    }
  }
  if (offenceReason.__type === "NationalOffenceReason") {
    switch (offenceReason.OffenceCode.__type) {
      case "NonMatchingOffenceCode":
        return {
          "ds:OffenceCode": {
            "ds:ActOrSource": offenceReason.OffenceCode.ActOrSource,
            "ds:Year": offenceReason.OffenceCode.Year,
            "ds:Reason": offenceReason.OffenceCode.Reason,
            "ds:Qualifier": offenceReason.OffenceCode.Qualifier
          }
        }
      case "CommonLawOffenceCode":
        return {
          "ds:OffenceCode": {
            "ds:CommonLawOffence": offenceReason.OffenceCode.CommonLawOffence,
            "ds:Reason": offenceReason.OffenceCode.Reason,
            "ds:Qualifier": offenceReason.OffenceCode.Qualifier
          }
        }
      case "IndictmentOffenceCode":
        return {
          "ds:OffenceCode": {
            "ds:Reason": offenceReason.OffenceCode.Reason,
            "ds:Qualifier": offenceReason.OffenceCode.Qualifier
          }
        }
    }
  }
}

const mapAhoOffencesToXml = (offences: Offence[], exceptions: Exception[] | undefined): Br7Offence[] =>
  offences.map((offence, index) => ({
    "ds:CriminalProsecutionReference": {
      "ds:DefendantOrOffender": {
        "ds:Year": offence.CriminalProsecutionReference.DefendantOrOffender?.Year,
        "ds:OrganisationUnitIdentifierCode": {
          "ds:SecondLevelCode":
            offence.CriminalProsecutionReference.DefendantOrOffender?.OrganisationUnitIdentifierCode.SecondLevelCode,
          "ds:ThirdLevelCode":
            offence.CriminalProsecutionReference.DefendantOrOffender?.OrganisationUnitIdentifierCode.ThirdLevelCode,
          "ds:BottomLevelCode":
            offence.CriminalProsecutionReference.DefendantOrOffender?.OrganisationUnitIdentifierCode.BottomLevelCode,
          "ds:OrganisationUnitCode":
            offence.CriminalProsecutionReference.DefendantOrOffender?.OrganisationUnitIdentifierCode
              .OrganisationUnitCode,
          "@_SchemaVersion": "2.0"
        },
        "ds:DefendantOrOffenderSequenceNumber":
          offence.CriminalProsecutionReference.DefendantOrOffender?.DefendantOrOffenderSequenceNumber,
        "ds:CheckDigit": offence.CriminalProsecutionReference.DefendantOrOffender?.CheckDigit
      },
      "ds:OffenceReason": offence.CriminalProsecutionReference.OffenceReason
        ? mapAhoOffenceReasonToXml(offence.CriminalProsecutionReference.OffenceReason)
        : undefined,
      "ds:OffenceReasonSequence": offence.CriminalProsecutionReference.OffenceReasonSequence?.toString().padStart(
        3,
        "0"
      ),
      "@_SchemaVersion": "2.0"
    },
    "ds:OffenceCategory": {
      "#text": String(offence.OffenceCategory),
      "@_Literal": offence.OffenceCategory
        ? lookupOffenceCategoryByCjsCode(offence.OffenceCategory)?.description
        : undefined
    },
    "ds:ArrestDate": offence.ArrestDate ? format(offence.ArrestDate, "yyyy-MM-dd") : undefined,
    "ds:ChargeDate": offence.ChargeDate ? format(offence.ChargeDate, "yyyy-MM-dd") : undefined,
    "ds:ActualOffenceDateCode": {
      "#text": Number(offence.ActualOffenceDateCode),
      "@_Literal": offence.ActualOffenceDateCode
        ? lookupOffenceDateCodeByCjsCode(offence.ActualOffenceDateCode)?.description
        : undefined
    },
    "ds:ActualOffenceStartDate": { "ds:StartDate": format(offence.ActualOffenceStartDate.StartDate, "yyyy-MM-dd") },
    "ds:ActualOffenceEndDate":
      offence.ActualOffenceEndDate && offence.ActualOffenceEndDate.EndDate
        ? {
            "ds:EndDate": offence.ActualOffenceEndDate?.EndDate
              ? format(offence.ActualOffenceEndDate.EndDate, "yyyy-MM-dd")
              : undefined
          }
        : undefined,
    "ds:LocationOfOffence": offence.LocationOfOffence,
    "ds:OffenceTitle": offence.OffenceTitle,
    "ds:ActualOffenceWording": offence.ActualOffenceWording,
    "ds:RecordableOnPNCindicator": optionalLiteral(offence.RecordableOnPNCindicator, LiteralType.YesNo),
    "ds:NotifiableToHOindicator": {
      "#text": offence.NotifiableToHOindicator ? "Y" : "N",
      "@_Literal": offence.NotifiableToHOindicator ? "Yes" : "No"
    },
    "ds:HomeOfficeClassification": offence.HomeOfficeClassification,
    "ds:ConvictionDate": offence.ConvictionDate ? format(offence.ConvictionDate, "yyyy-MM-dd") : undefined,
    "br7:CommittedOnBail": { "#text": String(offence.CommittedOnBail), "@_Literal": "Don't Know" },
    "br7:CourtOffenceSequenceNumber": offence.CourtOffenceSequenceNumber,
    // "br7:AddedByTheCourt": { "#text": offence.AddedByTheCourt ? "Y" : "N", "@_Literal": "Yes" },
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
  "ds:PTIURN": c.PTIURN,
  "ds:PreChargeDecisionIndicator": { "#text": c.PreChargeDecisionIndicator ? "Y" : "N", "@_Literal": "No" },
  "ds:CourtCaseReferenceNumber": c.CourtCaseReferenceNumber,
  "br7:CourtReference": { "ds:MagistratesCourtReference": c.CourtReference.MagistratesCourtReference },
  "br7:RecordableOnPNCindicator": { "#text": c.RecordableOnPNCindicator ? "Y" : "N", "@_Literal": "Yes" },
  "br7:Urgent": c.Urgent ? mapAhoUrgentToXml(c.Urgent) : undefined,
  "br7:ForceOwner": c.ForceOwner ? mapAhoOrgUnitToXml(c.ForceOwner) : undefined,
  "br7:HearingDefendant": {
    "br7:ArrestSummonsNumber": {
      "#text": c.HearingDefendant.ArrestSummonsNumber,
      "@_Error": c.HearingDefendant.ArrestSummonsNumber
        ? lookupSummonsCodeByCjsCode(c.HearingDefendant.ArrestSummonsNumber)?.description
        : undefined
    },
    "br7:PNCIdentifier": c.HearingDefendant.PNCIdentifier,
    "br7:PNCCheckname": c.HearingDefendant.PNCCheckname,
    "br7:DefendantDetail": {
      "br7:PersonName": {
        "ds:Title": c.HearingDefendant.DefendantDetail.PersonName.Title,
        "ds:GivenName": {
          "#text": c.HearingDefendant.DefendantDetail.PersonName.GivenName.join(" "),
          "@_NameSequence": "1"
        },
        "ds:FamilyName": { "#text": c.HearingDefendant.DefendantDetail.PersonName.FamilyName, "@_NameSequence": "1" }
      },
      "br7:GeneratedPNCFilename": c.HearingDefendant.DefendantDetail.GeneratedPNCFilename,
      "br7:BirthDate": c.HearingDefendant.DefendantDetail.BirthDate
        ? format(c.HearingDefendant.DefendantDetail.BirthDate, "yyyy-MM-dd")
        : undefined,
      "br7:Gender": { "#text": Number(c.HearingDefendant.DefendantDetail.Gender), "@_Literal": "male" }
    },
    "br7:Address": {
      "ds:AddressLine1": c.HearingDefendant.Address.AddressLine1,
      "ds:AddressLine2": c.HearingDefendant.Address.AddressLine2,
      "ds:AddressLine3": c.HearingDefendant.Address.AddressLine3
    },
    "br7:RemandStatus": literal(c.HearingDefendant.RemandStatus, LiteralType.OffenceRemandStatus),
    "br7:CourtPNCIdentifier": c.HearingDefendant.CourtPNCIdentifier,
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
  "ds:DateOfHearing": format(hearing.DateOfHearing, "yyyy-MM-dd"),
  "ds:TimeOfHearing": hearing.TimeOfHearing,
  "ds:HearingLanguage": { "#text": hearing.HearingLanguage, "@_Literal": "Don't Know" },
  "ds:HearingDocumentationLanguage": { "#text": hearing.HearingDocumentationLanguage, "@_Literal": "Don't Know" },
  "ds:DefendantPresentAtHearing": {
    "#text": hearing.DefendantPresentAtHearing,
    "@_Literal": lookupDefendantPresentAtHearingByCjsCode(hearing.DefendantPresentAtHearing)?.description
  },
  "br7:SourceReference": {
    "br7:DocumentName": hearing.SourceReference.DocumentName,
    "br7:UniqueID": hearing.SourceReference.UniqueID,
    "br7:DocumentType": hearing.SourceReference.DocumentType
  },
  "br7:CourtType": { "#text": hearing.CourtType, "@_Literal": "MC adult" },
  "br7:CourtHouseCode": hearing.CourtHouseCode,
  "br7:CourtHouseName": hearing.CourtHouseName,
  "@_hasError": hasError(exceptions, ["AnnotatedHearingOutcome", "HearingOutcome", "Hearing"]),
  "@_SchemaVersion": "4.0"
})

const mapAhoCXE01ToXml = (pncQuery: PncQueryResult): Cxe01 => ({
  FSC: { "@_FSCode": pncQuery.forceStationCode, "@_IntfcUpdateType": "K" },
  IDS: {
    "@_CRONumber": pncQuery.croNumber ?? "",
    "@_Checkname": pncQuery.checkName,
    "@_IntfcUpdateType": "K",
    "@_PNCID": pncQuery.pncId
  },
  CourtCases: {
    CourtCase: pncQuery.cases?.map((c) => ({
      CCR: { "@_CourtCaseRefNo": c.courtCaseReference, "@_CrimeOffenceRefNo": "", "@_IntfcUpdateType": "K" },
      Offences: {
        Offence: c.offences.map((offence) => ({
          COF: {
            "@_ACPOOffenceCode": offence.offence.acpoOffenceCode,
            "@_CJSOffenceCode": offence.offence.cjsOffenceCode,
            "@_IntfcUpdateType": "K",
            "@_OffEndDate": offence.offence.endDate ? format(offence.offence.endDate, "ddMMyyyy") : "",
            "@_OffEndTime": offence.offence.endTime ?? "",
            "@_OffStartDate": format(offence.offence.startDate, "ddMMyyyy") ?? "",
            "@_OffStartTime": offence.offence.startTime ?? "0000",
            "@_OffenceQualifier1": offence.offence.qualifier1 ?? "",
            "@_OffenceQualifier2": offence.offence.qualifier2 ?? "",
            "@_OffenceTitle": offence.offence.title ?? "",
            "@_ReferenceNumber": String(offence.offence.sequenceNumber).padStart(3, "0")
          },
          ADJ: offence.adjudication ? mapOffenceADJ(offence.adjudication) : undefined,
          DISList: offence.disposals ? mapOffenceDIS(offence.disposals) : undefined
        }))
      }
    }))
  }
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
    processEntities: false
  }

  const builder = new XMLBuilder(options)
  const xmlAho = mapAhoToXml(hearingOutcome)
  const xml = builder.build(xmlAho)

  return xml
}

export default convertAhoToXml
