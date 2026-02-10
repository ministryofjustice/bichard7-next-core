import { parseDisposalDuration } from "@moj-bichard7/core/lib/policeGateway/leds/mapToAddDisposalRequest/parseDisposalDuration"
import { toTitleCase } from "@moj-bichard7/core/lib/policeGateway/leds/mapToAddDisposalRequest/toTitleCase"
import type { AsnQueryResponse, DisposalResult, Offence } from "@moj-bichard7/core/types/leds/AsnQueryResponse"
import type { Adjudication, Plea } from "@moj-bichard7/core/types/leds/DisposalRequest"

import { convertDate, convertTime } from "@moj-bichard7/core/lib/policeGateway/leds/dateTimeConverter"
import type { ErrorResponse } from "@moj-bichard7/core/types/leds/ErrorResponse"
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
  const disposalQualifierDuration = parseDisposalDuration(qualifiers.substring(8, 12))

  return {
    disposalQualifiers,
    disposalQualifierDuration
  }
}

const mapDisposalResults = (disposalResults: Dis[]): DisposalResult[] => {
  const mappedDisposalResults = disposalResults.map((disposalResult) => {
    const disposalDuration = parseDisposalDuration(disposalResult.qtyDuration)
    const { disposalQualifiers, disposalQualifierDuration } = parseDisposalQualifiers(disposalResult.qualifiers)

    return {
      disposalId: randomUUID(),
      disposalCode: disposalResult.type ? Number(disposalResult.type) : 0,
      disposalDuration,
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
): AsnQueryResponse | ErrorResponse => {
  if ("txt" in pncJson) {
    return {
      status: 404,
      title: "string",
      type: "conflict/version",
      details: "string",
      instance: "string",
      leds: {
        errors: [
          {
            errorDetailType: pncJson.txt,
            message: pncJson.txt
          }
        ]
      }
    }
  }

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
