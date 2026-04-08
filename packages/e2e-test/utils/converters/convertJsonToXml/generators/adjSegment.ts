import type { ArrestOffence } from "@moj-bichard7/core/types/leds/AddDisposalRequest"
import type { Offence as AsnQueryResponseOffence } from "@moj-bichard7/core/types/leds/AsnQueryResponse"
import type { Offence as AddDisposalOffence } from "@moj-bichard7/core/types/leds/DisposalRequest"
import * as CONSTANT from "../../../constants"
import { convertToPncDate } from "../helpers/convertToPncDateTime"
import generateRow from "../helpers/generateRow"

type AdjData = {
  plea?: string
  adjudication?: string
  dateOfSentence?: string
  offenceTic?: number | string
}

const adjSegmentGenerator = (data: AdjData): string =>
  generateRow("ADJ", [
    [CONSTANT.OFFENCE_UPDATE_TYPE, CONSTANT.UPDATE_TYPE_FIELD_LENGTH],
    [data.plea?.toUpperCase(), CONSTANT.PLEA_FIELD_LENGTH],
    [data.adjudication?.toUpperCase(), CONSTANT.ADJUDICATION_FIELD_LENGTH],
    [data.dateOfSentence && convertToPncDate(data.dateOfSentence), CONSTANT.DATE_OF_SENTENCE_FIELD_LENGTH],
    [
      data.offenceTic ? data.offenceTic.toString().padStart(4, "0") : "".padStart(4, "0"),
      CONSTANT.OFFENCE_TIC_NUMBER_FIELD_LENGTH
    ],
    ["", CONSTANT.WEED_FLAG_FIELD_LENGTH]
  ])

export const adjSegmentFromAsnQueryResponse = (offence: AsnQueryResponseOffence): string | undefined => {
  const firstAdj = offence.adjudications?.[0]

  if (!firstAdj) {
    return undefined
  }

  return adjSegmentGenerator({
    plea: offence.plea,
    adjudication: firstAdj.adjudication,
    dateOfSentence: firstAdj.disposalDate,
    offenceTic: offence.offenceTic
  })
}

export const adjSegmentFromAddDisposalRequest = (offence: AddDisposalOffence | ArrestOffence): string | undefined =>
  adjSegmentGenerator({
    plea: offence.plea,
    adjudication: offence.adjudication,
    dateOfSentence: offence.dateOfSentence,
    offenceTic: offence.offenceTic
  })
