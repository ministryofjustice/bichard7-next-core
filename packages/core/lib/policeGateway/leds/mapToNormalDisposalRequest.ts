import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"

import type {
  PncUpdateArrestHearingAdjudicationAndDisposal,
  PncUpdateCourtHearingAdjudicationAndDisposal
} from "../../../phase3/types/HearingDetails"
import type NormalDisposalPncUpdateRequest from "../../../phase3/types/NormalDisposalPncUpdateRequest"
import type { AddDisposalRequest } from "../../../types/leds/AddDisposalRequest"
import type { Adjudication, Court, Defendant, DisposalDurationUnit, Plea } from "../../../types/leds/DisposalRequest"

import { PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR } from "../../../phase3/lib/getPncCourtCode"
import { PncUpdateType } from "../../../phase3/types/HearingDetails"

const mapCourt = (code: null | string, name: null | string): Court => {
  return code === PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR
    ? {
        courtIdentityType: "name",
        courtName: name ?? ""
      }
    : {
        courtIdentityType: "code",
        courtCode: code ?? ""
      }
}

const mapDefendant = (pncUpdateDataset: PncUpdateDataset): Defendant => {
  const hearingDefendant = pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant
  const defendantFirstNames = hearingDefendant.DefendantDetail?.PersonName.GivenName
  const defendantLastName = hearingDefendant.DefendantDetail?.PersonName.FamilyName
  const defendantOrganisationName = hearingDefendant.OrganisationName

  if (defendantLastName !== undefined) {
    return {
      defendantType: "individual",
      defendantFirstNames,
      defendantLastName
    }
  }

  return {
    defendantType: "organisation",
    defendantOrganisationName: defendantOrganisationName!
  }
}

const parseDisposalQuantity = (disposalQuantity: string) => {
  const quantity = disposalQuantity.toLowerCase()
  const durationCode = quantity.slice(0, 1)
  const count = Number(quantity.slice(1, 4).trim()) || 0
  const day = quantity.slice(4, 6)
  const month = quantity.slice(6, 8)
  const year = quantity.slice(8, 12)
  const amount = Number(quantity.slice(12)) || 0
  const disposalEffectiveDate = year && month && day ? `${year}-${month}-${day}` : undefined

  let units: DisposalDurationUnit

  if (quantity.slice(1, 4) === "y999") {
    units = "life"
  } else {
    const unitMap: Record<string, DisposalDurationUnit> = {
      d: "days",
      h: "hours",
      m: "months",
      w: "weeks",
      y: "years"
    }
    units = unitMap[durationCode]
  }

  return { count, units, disposalEffectiveDate, amount }
}

const offences = (hearingsAdjudicationsAndDisposals: PncUpdateCourtHearingAdjudicationAndDisposal[]) => {
  const ordinary = hearingsAdjudicationsAndDisposals.find((item) => item.type === PncUpdateType.ORDINARY)
  const adjudication = hearingsAdjudicationsAndDisposals.find((item) => item.type === PncUpdateType.ADJUDICATION)
  const disposals = hearingsAdjudicationsAndDisposals.filter((item) => item.type === PncUpdateType.DISPOSAL)

  const disposalResults = disposals.map((disposal) => {
    const { count, units, disposalEffectiveDate, amount } = parseDisposalQuantity(disposal.disposalQuantity)

    return {
      disposalCode: Number(disposal.disposalType),
      disposalQualifies: [disposal.disposalQualifiers ?? ""],
      disposalText: disposal.disposalText ?? undefined,
      disposalDuration: { count, units },
      disposalEffectiveDate,
      disposalFine: { amount }
    }
  })

  return [
    {
      courtOffenceSequenceNumber: Number(ordinary?.courtOffenceSequenceNumber),
      cjsOffenceCode: ordinary?.offenceReason ?? "",
      plea: adjudication?.pleaStatus as Plea,
      adjudication: adjudication?.verdict as Adjudication,
      dateOfSentence: adjudication?.hearingDate,
      offenceTic: Number(adjudication?.numberOffencesTakenIntoAccount),
      disposalResults,
      offenceId: "" // Required - offenceId from ASN query
    }
  ]
}

const additionalArrestOffences = (
  asn: null | string,
  arrestsAdjudicationsAndDisposals: PncUpdateArrestHearingAdjudicationAndDisposal[]
) => {
  const adjudication = arrestsAdjudicationsAndDisposals.find((item) => item.type === PncUpdateType.ADJUDICATION)
  const arrest = arrestsAdjudicationsAndDisposals.find((item) => item.type === PncUpdateType.ARREST)
  const disposals = arrestsAdjudicationsAndDisposals.filter((item) => item.type === PncUpdateType.DISPOSAL)

  const disposalResults = disposals.map((disposal) => ({
    disposalCode: Number(disposal.disposalType),
    disposalQualifies: [disposal.disposalQualifiers ?? ""],
    disposalText: disposal?.disposalText ?? undefined
  }))

  return [
    {
      asn: asn ?? "",
      additionalOffences: [
        {
          courtOffenceSequenceNumber: Number(arrest?.courtOffenceSequenceNumber),
          cjsOffenceCode: arrest?.offenceReason ?? "",
          committedOnBail: Boolean(arrest?.committedOnBail?.trim()),
          plea: adjudication?.pleaStatus as Plea,
          adjudication: adjudication?.verdict as Adjudication,
          dateOfSentence: adjudication?.hearingDate,
          offenceTic: Number(adjudication?.numberOffencesTakenIntoAccount),
          offenceStartDate: arrest?.offenceStartDate ?? "",
          offenceStartTime: arrest?.offenceStartTime,
          offenceEndDate: arrest?.offenceEndDate,
          offenceEndTime: arrest?.offenceEndTime,
          disposalResults,
          locationFsCode: arrest?.offenceLocationFSCode ?? "",
          locationText: arrest?.locationOfOffence
        }
      ]
    }
  ]
}

const mapToNormalDisposalRequest = (
  request: NormalDisposalPncUpdateRequest["request"],
  pncUpdateDataset: PncUpdateDataset
): AddDisposalRequest => {
  return {
    ownerCode: request.forceStationCode,
    personUrn: request.pncIdentifier ?? "",
    checkName: request.pncCheckName ?? "",
    courtCaseReference: request.courtCaseReferenceNumber,
    court: mapCourt(request.psaCourtCode, request.courtHouseName),
    dateOfConviction: request.dateOfHearing,
    defendant: mapDefendant(pncUpdateDataset),
    carryForward: request.pendingPsaCourtCode
      ? {
          appearanceDate: request.pendingCourtDate ?? undefined,
          court: mapCourt(request.pendingPsaCourtCode, request.pendingCourtHouseName)
        }
      : undefined,
    referToCourtCase: {
      reference: request.preTrialIssuesUniqueReferenceNumber ?? ""
    },
    offences: offences(request.hearingsAdjudicationsAndDisposals),
    additionalArrestOffences: additionalArrestOffences(
      request.arrestSummonsNumber,
      request.arrestsAdjudicationsAndDisposals
    )
  }
}

export default mapToNormalDisposalRequest
