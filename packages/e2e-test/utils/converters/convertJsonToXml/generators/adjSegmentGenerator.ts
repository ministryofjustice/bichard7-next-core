import type { MockOffence } from "../../../../types/MockAsnQueryResponse"
import {
  ADJUDICATION_FIELD_LENGTH,
  DATE_OF_SENTENCE_FIELD_LENGTH,
  OFFENCE_TIC_NUMBER_FIELD_LENGTH,
  PLEA_FIELD_LENGTH,
  UPDATE_TYPE_FIELD_LENGTH,
  WEED_FLAG_FIELD_LENGTH
} from "../../../constants"
import { convertToPncDate } from "../helpers/convertToPncDate"
import generateRow from "../helpers/generateRow"

const adjSegmentGenerator = (updateType: string | undefined, offence: MockOffence): string | undefined => {
  if (!offence.adjudications?.length) {
    return undefined
  }

  const firstAdj = offence.adjudications?.[0]
  const plea = offence.plea?.toUpperCase()
  const adjudication = firstAdj?.adjudication.toUpperCase()
  const dateOfSentence = firstAdj?.disposalDate && convertToPncDate(firstAdj?.disposalDate)
  const offenceTICNumber = offence.offenceTic?.toString()
  const weedFlag = ""

  const adjSegment = generateRow("ADJ", [
    [updateType, UPDATE_TYPE_FIELD_LENGTH],
    [plea, PLEA_FIELD_LENGTH],
    [adjudication, ADJUDICATION_FIELD_LENGTH],
    [dateOfSentence, DATE_OF_SENTENCE_FIELD_LENGTH],
    [offenceTICNumber, OFFENCE_TIC_NUMBER_FIELD_LENGTH],
    [weedFlag, WEED_FLAG_FIELD_LENGTH]
  ])

  return adjSegment
}

export default adjSegmentGenerator
