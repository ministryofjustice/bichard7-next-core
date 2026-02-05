import { convertDate, convertTime } from "@moj-bichard7/core/lib/policeGateway/leds/dateTimeConverter"
import mapCourt from "@moj-bichard7/core/lib/policeGateway/leds/mapToAddDisposalRequest/mapCourt"
import { parseDisposalDuration } from "@moj-bichard7/core/lib/policeGateway/leds/mapToAddDisposalRequest/parseDisposalDuration"
import { toTitleCase } from "@moj-bichard7/core/lib/policeGateway/leds/mapToAddDisposalRequest/toTitleCase"
import type { AddDisposalRequest } from "@moj-bichard7/core/types/leds/AddDisposalRequest"
import type { Adjudication, Plea } from "@moj-bichard7/core/types/leds/DisposalRequest"
import { randomUUID } from "crypto"
import type { Crt } from "../convertPncXmlToJson/convertCrt"
import type { PncNormalDisposalJson } from "../convertPncXmlToJson/convertPncXmlToJson"

const mapCarryForward = (carryForward?: Crt | undefined) => {
  if (!carryForward?.courtCode) {
    return undefined
  }

  return {
    appearanceDate: carryForward.courtDate ? convertDate(carryForward.courtDate) : undefined,
    court: mapCourt(carryForward.courtCode, carryForward.courtName)
  }
}

export const convertPncJsonToLedsAddDisposalRequest = (pncJson: PncNormalDisposalJson): AddDisposalRequest => {
  const name = pncJson.generatedPNCFilename
  const [lastName, firstNames] = name.split("/")
  const carryForward = mapCarryForward(pncJson.carryForward)

  return {
    ownerCode: pncJson.forceStationCode,
    personUrn: pncJson.pncIdentifier,
    checkName: pncJson.pncCheckName,
    courtCaseReference: pncJson.offences[0].courtCaseReference,
    court: mapCourt(pncJson.courtCode, pncJson.courtName),
    dateOfConviction: convertDate(pncJson.dateOfHearing),
    defendant: {
      defendantType: "individual",
      defendantFirstNames: firstNames.split(" "),
      defendantLastName: lastName
    },
    carryForward,
    ...(pncJson.referToCourtCase?.ptiUrn && {
      referToCourtCase: {
        reference: pncJson.referToCourtCase.ptiUrn
      }
    }),
    offences: pncJson.offences.map((offence) => ({
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
        disposalQualifiers: disposal.qualifiers.trim().match(/.{1,2}/g) || [],
        disposalText: disposal.text
        // disposalQualifierDuration: {}, /// <-----needs to check
      }))
    })),
    additionalArrestOffences: [
      {
        asn: pncJson.additionalOffences.arrestSummonsNumber,
        additionalOffences: pncJson.additionalOffences.offences.map((offence) => ({
          courtOffenceSequenceNumber: Number(offence.crimeOffenceReferenceNumber), /// <-----needs to check
          cjsOffenceCode: offence.cjsOffenceCode,
          plea: toTitleCase(offence.plea) as Plea,
          adjudication: toTitleCase(offence.adjudication) as Adjudication,
          offenceDescription: offence.offenceDescription,
          committedOnBail: Boolean(offence.committedOnBail),
          locationFsCode: offence.offenceLocationFSCode,
          // locationText: offence.locationOfOffence, /// <-----needs to check
          dateOfSentence: offence.dateOfSentence,
          locationAddress: { addressLines: [offence.locationOfOffence] }, /// <-----needs to check
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
            disposalQualifiers: disposal.qualifiers.trim().match(/.{1,2}/g) || [],
            disposalText: disposal.text
            // disposalQualifierDuration: {}, /// <-----needs to check
          }))
        }))
      }
    ]
  }
}
