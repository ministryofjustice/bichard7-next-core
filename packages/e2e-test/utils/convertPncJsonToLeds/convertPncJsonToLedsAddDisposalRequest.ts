import { convertDate, convertTime } from "@moj-bichard7/core/lib/policeGateway/leds/dateTimeConverter"
import mapCourt from "@moj-bichard7/core/lib/policeGateway/leds/mapToAddDisposalRequest/mapCourt"
import { parseDisposalDuration } from "@moj-bichard7/core/lib/policeGateway/leds/mapToAddDisposalRequest/parseDisposalDuration"
import { toTitleCase } from "@moj-bichard7/core/lib/policeGateway/leds/mapToAddDisposalRequest/toTitleCase"
import type { AddDisposalRequest } from "@moj-bichard7/core/types/leds/AddDisposalRequest"
import type {
  AdditionalArrestOffences,
  Adjudication,
  Defendant,
  Offence,
  Plea
} from "@moj-bichard7/core/types/leds/DisposalRequest"
import { randomUUID } from "crypto"
import type { Ach } from "../convertPncXmlToJson/convertAch"
import type { Adj } from "../convertPncXmlToJson/convertAdj"
import type { Cch } from "../convertPncXmlToJson/convertCch"
import type { Crt } from "../convertPncXmlToJson/convertCrt"
import type { Dis } from "../convertPncXmlToJson/convertDis"
import type { PncNormalDisposalJson } from "../convertPncXmlToJson/convertPncXmlToJson"

const mapDefendant = (generatedPNCFilename: string): Defendant => {
  const [lastName, firstNames] = generatedPNCFilename.split("/")

  return {
    defendantType: "individual",
    defendantFirstNames: firstNames.split(" "),
    defendantLastName: lastName
  }
}

const mapCarryForward = (carryForward?: Crt | undefined) => {
  if (!carryForward?.courtCode) {
    return undefined
  }

  return {
    appearanceDate: carryForward.courtDate ? convertDate(carryForward.courtDate) : undefined,
    court: mapCourt(carryForward.courtCode, carryForward.courtName)
  }
}

const mapOffences = (
  offences: (Cch & Partial<Adj> & { disposals: Dis[]; courtCaseReference: string })[]
): Offence[] => {
  return offences.map((offence) => ({
    courtOffenceSequenceNumber: Number(offence.offenceSequenceNumber),
    cjsOffenceCode: offence.cjsOffenceCode,
    plea: toTitleCase(offence.plea) as Plea,
    offenceTic: offence.offenceTICNumber ? Number(offence.offenceTICNumber) : undefined,
    offenceId: randomUUID(),
    dateOfSentence: offence.dateOfSentence,
    adjudication: toTitleCase(offence.adjudication) as Adjudication,
    disposalResults: offence.disposals.map((disposal) => ({
      disposalCode: Number(disposal.type),
      disposalDuration: parseDisposalDuration(disposal.qtyDuration),
      disposalFine: disposal.qtyMonetaryValue ? { amount: Number(disposal.qtyMonetaryValue) } : undefined,
      disposalEffectiveDate: convertDate(disposal.qtyDate),
      disposalQualifiers: disposal.qualifiers.match(/.{1,2}/g)?.map((q) => q.trim()) || undefined,
      disposalText: disposal.text
    }))
  }))
}

const mapAdditionalArrestOffences = (
  asn: string,
  additionalArrestOffences: (Ach & Partial<Adj> & { disposals: Dis[]; courtCaseReference: string })[]
): AdditionalArrestOffences[] => {
  const additionalOffences = additionalArrestOffences.map((offence) => ({
    courtOffenceSequenceNumber: Number(offence.arrestOffenceNumber),
    cjsOffenceCode: offence.cjsOffenceCode,
    plea: toTitleCase(offence.plea) as Plea,
    adjudication: toTitleCase(offence.adjudication) as Adjudication,
    offenceDescription: offence.offenceDescription,
    committedOnBail: Boolean(offence.committedOnBail),
    locationFsCode: offence.offenceLocationFSCode,
    locationText: offence.locationOfOffence,
    dateOfSentence: offence.dateOfSentence,
    offenceTic: Number(offence.offenceTICNumber),
    offenceStartDate: convertDate(offence.offenceStartDate),
    offenceStartTime: offence.offenceStartTime ? convertTime(offence.offenceStartTime) : undefined,
    offenceEndDate: offence.offenceEndDate ? convertDate(offence.offenceEndDate) : undefined,
    offenceEndTime: offence.offenceEndTime ? convertTime(offence.offenceEndTime) : undefined,
    disposalResults: offence.disposals.map((disposal) => ({
      disposalCode: Number(disposal.type),
      disposalDuration: parseDisposalDuration(disposal.qtyDuration),
      disposalFine: disposal.qtyMonetaryValue ? { amount: Number(disposal.qtyMonetaryValue) } : undefined,
      disposalEffectiveDate: convertDate(disposal.qtyDate),
      disposalQualifiers: disposal.qualifiers.match(/.{1,2}/g)?.map((q) => q.trim()) || undefined,
      disposalText: disposal.text
    }))
  }))

  return [
    {
      asn,
      additionalOffences
    }
  ]
}

export const convertPncJsonToLedsAddDisposalRequest = (pncJson: PncNormalDisposalJson): AddDisposalRequest => {
  const carryForward = mapCarryForward(pncJson.carryForward)
  const asn = pncJson.additionalOffences.arrestSummonsNumber
  const additionalOffences = pncJson.additionalOffences.offences
  const referToCourtCase = pncJson.referToCourtCase?.ptiUrn
    ? {
        referToCourtCase: { reference: pncJson.referToCourtCase.ptiUrn }
      }
    : {}

  return {
    ownerCode: pncJson.forceStationCode,
    personUrn: pncJson.pncIdentifier,
    checkName: pncJson.pncCheckName,
    courtCaseReference: pncJson.offences[0].courtCaseReference,
    court: mapCourt(pncJson.courtCode, pncJson.courtName),
    dateOfConviction: convertDate(pncJson.dateOfHearing),
    defendant: mapDefendant(pncJson.generatedPNCFilename),
    carryForward,
    ...referToCourtCase,
    offences: mapOffences(pncJson.offences),
    additionalArrestOffences: mapAdditionalArrestOffences(asn, additionalOffences)
  }
}
