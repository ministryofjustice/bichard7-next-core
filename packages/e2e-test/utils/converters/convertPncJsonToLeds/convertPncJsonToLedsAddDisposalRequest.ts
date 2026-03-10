import { convertDate, convertTime } from "@moj-bichard7/core/lib/policeGateway/leds/dateTimeConverter"
import mapCourt from "@moj-bichard7/core/lib/policeGateway/leds/mapToAddDisposalRequest/mapCourt"
import { parseDisposalDuration } from "@moj-bichard7/core/lib/policeGateway/leds/mapToAddDisposalRequest/parseDisposalDuration"
import shouldExcludePleaAndAdjudication from "@moj-bichard7/core/lib/policeGateway/leds/mapToAddDisposalRequest/shouldExcludePleaAndAdjudication"
import { toTitleCase } from "@moj-bichard7/core/lib/policeGateway/leds/mapToAddDisposalRequest/toTitleCase"
import preProcessOffenceCode from "@moj-bichard7/core/lib/policeGateway/leds/preProcessOffenceCode"
import type { AddDisposalRequest, CarryForward } from "@moj-bichard7/core/types/leds/AddDisposalRequest"
import type {
  AdditionalArrestOffences,
  Adjudication,
  Defendant,
  DisposalResult,
  Offence,
  Plea
} from "@moj-bichard7/core/types/leds/DisposalRequest"
import { randomUUID } from "crypto"
import type { Ach } from "../convertPncXmlToJson/convertAch"
import type { Adj } from "../convertPncXmlToJson/convertAdj"
import type { Asr } from "../convertPncXmlToJson/convertAsr"
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

const mapCarryForward = (carryForward?: Crt): CarryForward | undefined => {
  if (!carryForward?.courtCode) {
    return undefined
  }

  return {
    appearanceDate: convertDate(carryForward.courtDate),
    court: mapCourt(carryForward.courtCode, carryForward.courtName)
  }
}

const mapDisposal = (disposal: Dis): DisposalResult => ({
  disposalCode: Number(disposal.type),
  disposalDuration: parseDisposalDuration(disposal.qtyDuration),
  disposalFine: disposal.qtyMonetaryValue ? { amount: Number(disposal.qtyMonetaryValue) } : undefined,
  disposalEffectiveDate: disposal.qtyDate ? convertDate(disposal.qtyDate) : undefined,
  disposalQualifiers: disposal.qualifiers
    .match(/.{1,2}/g)
    ?.map((q) => q.trim())
    .filter(Boolean),
  disposalText: disposal.text || undefined
})

export const mapOffences = (
  offences: (Cch & Partial<Adj> & { disposals: Dis[]; courtCaseReference: string })[],
  isCarriedForwardOrReferredToCourtCase: boolean
): Offence[] => {
  const mappedOffences = offences.map((offence) => {
    const disposalResults = offence.disposals.map(mapDisposal)
    const excludePleaAndAdjudication = shouldExcludePleaAndAdjudication(
      disposalResults,
      isCarriedForwardOrReferredToCourtCase
    )
    const plea = !excludePleaAndAdjudication ? (toTitleCase(offence.plea) as Plea) : undefined
    const adjudication = !excludePleaAndAdjudication ? (toTitleCase(offence.adjudication) as Adjudication) : undefined
    const { offenceCode: cjsOffenceCode, roleQualifier } = preProcessOffenceCode(offence.cjsOffenceCode)

    return {
      courtOffenceSequenceNumber: Number(offence.offenceSequenceNumber),
      cjsOffenceCode,
      roleQualifiers: roleQualifier ? [roleQualifier] : undefined,
      plea,
      adjudication,
      dateOfSentence: offence.dateOfSentence ? convertDate(offence.dateOfSentence) : undefined,
      offenceTic: offence.offenceTICNumber ? Number(offence.offenceTICNumber) : undefined,
      disposalResults,
      offenceId: randomUUID()
    }
  })

  return mappedOffences
}

const mapAdditionalArrestOffences = (
  additionalArrestOffences: Asr & {
    offences: (Ach & Partial<Adj> & { disposals: Dis[]; courtCaseReference: string })[]
  }
): AdditionalArrestOffences[] => {
  const additionalOffences = additionalArrestOffences.offences.map((offence) => ({
    courtOffenceSequenceNumber: Number(offence.arrestOffenceNumber),
    cjsOffenceCode: offence.cjsOffenceCode,
    plea: toTitleCase(offence.plea) as Plea,
    adjudication: toTitleCase(offence.adjudication) as Adjudication,
    offenceDescription: offence.offenceDescription,
    committedOnBail: offence.committedOnBail.toLowerCase() === "y",
    locationFsCode: offence.offenceLocationFSCode,
    locationText: { locationText: offence.locationOfOffence },
    dateOfSentence: offence.dateOfSentence ? convertDate(offence.dateOfSentence) : undefined,
    offenceCode: {
      offenceCodeType: "cjs" as const,
      cjsOffenceCode: offence.cjsOffenceCode,
      description: offence.offenceDescription
    },
    offenceTic: Number(offence.offenceTICNumber),
    offenceStartDate: convertDate(offence.offenceStartDate),
    offenceStartTime: offence.offenceStartTime ? convertTime(offence.offenceStartTime) : undefined,
    offenceEndDate: offence.offenceEndDate ? convertDate(offence.offenceEndDate) : undefined,
    offenceEndTime: offence.offenceEndTime ? convertTime(offence.offenceEndTime) : undefined,
    disposalResults: offence.disposals.map((disposal) => ({
      disposalCode: Number(disposal.type),
      disposalDuration: parseDisposalDuration(disposal.qtyDuration),
      disposalFine: disposal.qtyMonetaryValue ? { amount: Number(disposal.qtyMonetaryValue) } : undefined,
      disposalEffectiveDate: disposal.qtyDate ? convertDate(disposal.qtyDate) : undefined,
      disposalQualifiers: disposal.qualifiers.match(/.{1,2}/g)?.map((q) => q.trim()),
      disposalText: disposal.text || undefined
    }))
  }))

  return [
    {
      asn: additionalArrestOffences.arrestSummonsNumber,
      additionalOffences
    }
  ]
}

export const convertPncJsonToLedsAddDisposalRequest = (pncJson: PncNormalDisposalJson): AddDisposalRequest => {
  const carryForward = mapCarryForward(pncJson.carryForward)
  const referToCourtCase = pncJson.referToCourtCase?.ptiUrn
    ? {
        referToCourtCase: { reference: pncJson.referToCourtCase.ptiUrn }
      }
    : {}
  const additionalArrestOffences = pncJson.additionalOffences
    ? mapAdditionalArrestOffences(pncJson.additionalOffences)
    : undefined
  const isCarriedForwardOrReferredToCourtCase = !!carryForward || !!referToCourtCase

  return {
    ownerCode: pncJson.forceStationCode,
    personUrn: pncJson.pncIdentifier,
    courtCaseReference: pncJson.offences[0].courtCaseReference,
    court: mapCourt(pncJson.courtCode, pncJson.courtName),
    dateOfConviction: convertDate(pncJson.dateOfHearing),
    defendant: mapDefendant(pncJson.generatedPNCFilename),
    carryForward,
    ...referToCourtCase,
    offences: mapOffences(pncJson.offences, isCarriedForwardOrReferredToCourtCase),
    additionalArrestOffences
  }
}
