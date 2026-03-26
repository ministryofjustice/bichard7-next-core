import { GMH_FIELD_LENGTH, GMT_FIELD_LENGTH } from "../../../constants"
import generateRow from "../helpers/generateRow"

const commonSegmentGenerator = (tag: "GMH" | "GMT", data: string | undefined): string => {
  const fieldLength = tag === "GMH" ? GMH_FIELD_LENGTH : GMT_FIELD_LENGTH
  return generateRow(tag, [[data, fieldLength]])
}

export default commonSegmentGenerator
