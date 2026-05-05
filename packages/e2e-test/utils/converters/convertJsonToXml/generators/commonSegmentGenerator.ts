import { GMH_FIELD_LENGTH, GMT_FIELD_LENGTH, TXT_FIELD_LENGTH } from "../../../constants"
import generateRow from "../helpers/generateRow"

const fieldLengthMapper = {
  GMH: GMH_FIELD_LENGTH,
  GMT: GMT_FIELD_LENGTH,
  TXT: TXT_FIELD_LENGTH
}

const commonSegmentGenerator = (tag: "GMH" | "GMT" | "TXT", data: string | undefined): string => {
  const fieldLength = fieldLengthMapper[tag]
  return generateRow(tag, [[data, fieldLength]])
}

export default commonSegmentGenerator
