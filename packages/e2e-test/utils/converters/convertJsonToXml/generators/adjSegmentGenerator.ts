import type { OffenceExtended } from "../../../../types/AsnQueryResponseExtended"
import {
  ADJUDICATION_FIELD_SIZE,
  DATE_OF_SENTENCE_FIELD_SIZE,
  OFFENCE_TIC_NUMBER_FIELD_SIZE,
  PLEA_FIELD_SIZE,
  UPDATE_TYPE_FIELD_LENGTH,
  WEED_FLAG_FIELD_LENGTH
} from "../../../constants"
import { convertDate } from "../helpers/convertDate"
import generateRow from "../helpers/generateRow"

const adjSegmentGenerator = (updateType: string | undefined, offence: OffenceExtended): string => {
  const firstAdj = offence.adjudications?.[0]
  const plea = offence.plea?.toUpperCase()
  const adjudication = firstAdj?.adjudication.toUpperCase()
  const dateOfSentence = firstAdj?.disposalDate ? convertDate(firstAdj?.disposalDate) : undefined
  const offenceTICNumber = offence.offenceTic
  const weedFlag = ""

  const adjSegment = generateRow("ADJ", [
    [updateType, UPDATE_TYPE_FIELD_LENGTH],
    [plea, PLEA_FIELD_SIZE],
    [adjudication, ADJUDICATION_FIELD_SIZE],
    [dateOfSentence, DATE_OF_SENTENCE_FIELD_SIZE],
    [String(offenceTICNumber), OFFENCE_TIC_NUMBER_FIELD_SIZE],
    [weedFlag, WEED_FLAG_FIELD_LENGTH]
  ])

  return adjSegment
}

export default adjSegmentGenerator
