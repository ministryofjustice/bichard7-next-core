import type {
  PoliceAdjudication,
  PoliceCourtCase,
  PoliceDisposal,
  PoliceQueryResult
} from "@moj-bichard7/common/types/PoliceQueryResult"

import type {
  DisposalDuration,
  AsnQueryResponse as LedsAsnQueryResponse,
  Disposal as LedsDisposal,
  DisposalResult as LedsDisposalResult,
  Offence as LedsOffence
} from "../../../types/leds/AsnQueryResponse"
import type { LedsPoliceOffence } from "../../../types/LedsPoliceOffence"

import {
  DISPOSAL_QUALIFIERS_FIELD_LENGTH,
  PNC_REPRESENTATION_OF_LIFE
} from "../../results/createPoliceDisposalsFromResult/createPoliceDisposal"

const mapToPoliceOffence = (offence: LedsOffence): LedsPoliceOffence["offence"] => ({
  acpoOffenceCode: "12:15:24:1",
  cjsOffenceCode: offence.cjsOffenceCode,
  startDate: new Date(offence.offenceStartDate),
  startTime: offence.offenceStartTime,
  endDate: offence.offenceEndDate ? new Date(offence.offenceEndDate) : undefined,
  endTime: offence.offenceEndTime,
  qualifier1: offence.roleQualifiers?.[0],
  qualifier2: offence.legislationQualifiers?.[0],
  title: offence.offenceDescription?.[0],
  sequenceNumber: offence.courtOffenceSequenceNumber
})

const mapToPoliceAdjudication = (offence: LedsOffence): PoliceAdjudication | undefined => {
  if (!offence.adjudications || offence.adjudications.length === 0 || !offence.plea) {
    return undefined
  }

  const adjudication = offence.adjudications.sort((a, b) => (a.appearanceNumber < b.appearanceNumber ? 1 : -1))[0]
  const verdict = adjudication.adjudication.toUpperCase()
  const sentenceDate = adjudication.disposalDate ? new Date(adjudication.disposalDate) : undefined

  return {
    verdict,
    plea: offence.plea.toUpperCase(),
    sentenceDate: sentenceDate,
    offenceTICNumber: 0,
    weedFlag: undefined
  }
}

const convertDuration = (duration?: DisposalDuration): string | undefined => {
  if (!duration) {
    return undefined
  }

  const { units, count } = duration
  return units === "life" ? PNC_REPRESENTATION_OF_LIFE : `${units.charAt(0).toUpperCase()}${count}`
}

const mapToPoliceDisposal = (disposalResults: LedsDisposalResult[]): PoliceDisposal[] =>
  disposalResults.map((disposalResult) => {
    let qualifiers = disposalResult.disposalQualifies?.join("") ?? ""
    qualifiers +=
      " ".repeat(Math.max(0, DISPOSAL_QUALIFIERS_FIELD_LENGTH - 4 - qualifiers.length)) +
      convertDuration(disposalResult.disposalQualifierDuration)

    return {
      qtyDate: disposalResult.disposalEffectiveDate,
      qtyDuration: convertDuration(disposalResult.disposalDuration),
      qtyMonetaryValue: disposalResult.disposalFine?.amount.toFixed(2),
      qtyUnitsFined: undefined,
      qualifiers,
      text: disposalResult.disposalText,
      type: disposalResult.disposalCode
    }
  })

const mapToPoliceOffences = (offences: LedsOffence[]): LedsPoliceOffence[] =>
  offences.map((offence) => ({
    offenceId: offence.offenceId,
    offence: mapToPoliceOffence(offence),
    adjudication: mapToPoliceAdjudication(offence),
    disposals: offence.disposalResults ? mapToPoliceDisposal(offence.disposalResults) : []
  }))

const mapToPoliceCourtCases = (disposals: LedsDisposal[]): PoliceCourtCase[] =>
  disposals.map((disposal) => ({
    courtCaseReference: disposal.courtCaseReference,
    offences: mapToPoliceOffences(disposal.offences),
    crimeOffenceReference: undefined
  }))

const mapToPoliceQueryResult = (ledsQueryResponse: LedsAsnQueryResponse, checkName: string): PoliceQueryResult => {
  return {
    forceStationCode: ledsQueryResponse.ownerCode,
    checkName,
    pncId: ledsQueryResponse.personUrn,
    courtCases: mapToPoliceCourtCases(ledsQueryResponse.disposals),
    croNumber: undefined,
    penaltyCases: undefined
  }
}

export default mapToPoliceQueryResult
