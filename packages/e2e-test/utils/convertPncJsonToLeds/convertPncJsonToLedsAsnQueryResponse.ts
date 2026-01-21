import { parseDisposalDuration } from "@moj-bichard7/core/lib/policeGateway/leds/mapToAddDisposalRequest/parseDisposalDuration"
import { toTitleCase } from "@moj-bichard7/core/lib/policeGateway/leds/mapToAddDisposalRequest/toTitleCase"
import type { AsnQueryResponse, DisposalResult, Offence } from "@moj-bichard7/core/types/leds/AsnQueryResponse"
import type { Adjudication, Plea } from "@moj-bichard7/core/types/leds/DisposalRequest"

import { convertDate, convertTime } from "@moj-bichard7/core/lib/policeGateway/leds/dateTimeConverter"
import { randomUUID } from "crypto"
import type { Adj } from "../convertPncXmlToJson/convertAdj"
import type { Cof } from "../convertPncXmlToJson/convertCof"
import type { Dis } from "../convertPncXmlToJson/convertDis"
import type { PncAsnQueryJson } from "../convertPncXmlToJson/convertPncXmlToJson"

type Params = {
  asn: string
  personId: string
  reportId: string
  courtCaseId: string
}

const parseDisposalQualifiers = (qualifiers?: string) => {
  if (!qualifiers) {
    return {
      disposalQualifiers: undefined,
      disposalQualifierDuration: undefined
    }
  }

  const disposalQualifiers =
    qualifiers
      .substring(0, 9)
      .trim()
      .match(/.{1,2}/g) || []
  const { units, count } = parseDisposalDuration(qualifiers.substring(8, 12))

  return {
    disposalQualifiers,
    disposalQualifierDuration: { units, count }
  }
}

const mapDisposalResults = (disposalResults: Dis[]): DisposalResult[] => {
  const mappedDisposalResults = disposalResults.map((disposalResult) => {
    const { units, count } = parseDisposalDuration(disposalResult.qtyDuration)
    const { disposalQualifiers, disposalQualifierDuration } = parseDisposalQualifiers(disposalResult.qualifiers)

    return {
      disposalId: randomUUID(),
      disposalCode: disposalResult.type ? Number(disposalResult.type) : 0,
      disposalDuration: disposalResult.qtyDuration ? { units, count } : undefined,
      disposalFine: disposalResult.qtyMonetaryValue
        ? {
            amount: Number(disposalResult.qtyMonetaryValue),
            units: Number(disposalResult.qtyUnitsFined)
          }
        : undefined,
      disposalEffectiveDate: disposalResult.qtyDate ? convertDate(disposalResult.qtyDate) : undefined,
      disposalQualifiers,
      disposalQualifierDuration,
      disposalText: disposalResult.text
    }
  })

  return mappedDisposalResults
}

const mapOffences = (offences: (Cof & Partial<Adj> & { disposals: Dis[] })[]): Offence[] => {
  const mappedOffences = offences.map((offence) => {
    return {
      courtOffenceSequenceNumber: Number(offence.referenceNumber),
      cjsOffenceCode: offence.cjsOffenceCode,
      roleQualifiers: [offence.offenceQualifier1].filter(Boolean),
      legislationQualifiers: [offence.offenceQualifier2].filter(Boolean),
      plea: offence.plea ? (toTitleCase(offence.plea) as Plea) : undefined,
      offenceTic: 0,
      offenceStartDate: convertDate(offence.offenceStartDate),
      offenceStartTime: offence.offenceStartTime ? convertTime(offence.offenceStartTime) : undefined,
      offenceEndDate: offence.offenceEndDate ? convertDate(offence.offenceEndDate) : undefined,
      offenceEndTime: offence.offenceEndTime ? convertTime(offence.offenceEndTime) : undefined,
      offenceId: randomUUID(),
      adjudications:
        offence.dateOfSentence && offence.adjudication
          ? [
              {
                appearanceNumber: 1,
                adjudicationId: randomUUID(),
                disposalDate: convertDate(offence.dateOfSentence),
                adjudication: toTitleCase(offence.adjudication) as Adjudication
              }
            ]
          : undefined,
      disposalResults: mapDisposalResults(offence.disposals)
    }
  })

  return mappedOffences
}

export const convertPncJsonToLedsAsnQueryResponse = (
  pncJson: PncAsnQueryJson,
  { asn, personId, reportId, courtCaseId }: Params
): AsnQueryResponse => {
  const courtCaseReferences = Array.from(new Set(pncJson.offences.map((offence) => offence.courtCaseReference)))

  return {
    personId,
    personUrn: pncJson.pncIdentifier,
    reportId,
    asn,
    ownerCode: pncJson.forceStationCode,
    disposals: courtCaseReferences.map((courtCaseReference) => ({
      courtCaseId,
      courtCaseReference: courtCaseReference,
      caseStatusMarker: "impending-prosecution-detail",
      court: {
        courtIdentityType: "code",
        courtCode: "0000"
      },
      offences: mapOffences(pncJson.offences.filter((offence) => offence.courtCaseReference === courtCaseReference))
    }))
  }
}
