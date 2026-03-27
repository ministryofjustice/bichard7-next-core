import type { Offence as AsnQueryResponseOffence } from "@moj-bichard7/core/types/leds/AsnQueryResponse"
import type { Offence as AddDisposalOffence } from "@moj-bichard7/core/types/leds/DisposalRequest"
import * as C from "../../../constants"
import { convertToPncDate } from "../helpers/convertToPncDateTime"
import generateRow from "../helpers/generateRow"

type AdjData = {
  plea?: string
  adjudication?: string
  dateOfSentence?: string
  offenceTic?: number | string
}

const generateAdjSegment = (data: AdjData): string =>
  generateRow("ADJ", [
    [C.OFFENCE_UPDATE_TYPE, C.UPDATE_TYPE_FIELD_LENGTH],
    [data.plea?.toUpperCase(), C.PLEA_FIELD_LENGTH],
    [data.adjudication?.toUpperCase(), C.ADJUDICATION_FIELD_LENGTH],
    [data.dateOfSentence && convertToPncDate(data.dateOfSentence), C.DATE_OF_SENTENCE_FIELD_LENGTH],
    [data.offenceTic?.toString(), C.OFFENCE_TIC_NUMBER_FIELD_LENGTH],
    ["", C.WEED_FLAG_FIELD_LENGTH]
  ])

const toAdjData = (offence: AsnQueryResponseOffence | AddDisposalOffence): AdjData | undefined => {
  if ("adjudications" in offence) {
    const firstAdj = offence.adjudications?.[0]
    if (!firstAdj) {
      return undefined
    }

    return {
      plea: offence.plea,
      adjudication: firstAdj.adjudication,
      dateOfSentence: firstAdj.disposalDate,
      offenceTic: offence.offenceTic
    }
  }

  if ("adjudication" in offence) {
    return {
      plea: offence.plea,
      adjudication: offence.adjudication,
      dateOfSentence: offence.dateOfSentence,
      offenceTic: offence.offenceTic
    }
  }
}

const adjSegmentGenerator = (offence: AsnQueryResponseOffence | AddDisposalOffence): string | undefined => {
  const adjData = toAdjData(offence)
  return adjData && generateAdjSegment(adjData)
}

export default adjSegmentGenerator
