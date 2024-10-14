import { isEqual } from "lodash"
import type { AmendmentKeys, Amendments, OffenceField, ResultQualifierCode } from "types/Amendments"

const isNotEmpty = (values: (OffenceField<number> | OffenceField<string> | ResultQualifierCode)[]): boolean => {
  const isEmptyKeys = Object.keys(values).length === 0 && values.constructor === Object
  const isEmptyArrays = Object.values(values).length === 0

  return !(isEmptyKeys || isEmptyArrays)
}

const handleArray = (
  map: Map<AmendmentKeys, (OffenceField<number> | OffenceField<string> | ResultQualifierCode)[]>,
  amendmentField: AmendmentKeys,
  amendments: Amendments,
  savedAmendments: Amendments
) => {
  const newValues: (OffenceField<number> | OffenceField<string> | ResultQualifierCode)[] = []
  const amendmentsArray = amendments[amendmentField] as
    | OffenceField<number>[]
    | OffenceField<string>[]
    | ResultQualifierCode[]

  const savedAmendmentsArray =
    (savedAmendments[amendmentField] as OffenceField<number>[] | OffenceField<string>[] | ResultQualifierCode[]) ?? []

  amendmentsArray.forEach((amendment) => {
    const matchedSaved = savedAmendmentsArray.find(
      (saveAmendment) => amendment.offenceIndex === saveAmendment.offenceIndex
    )

    if (!isEqual(amendment, matchedSaved)) {
      newValues.push(amendment)
    }
  })

  // Cannot use Lodash's `isEmpty` as the `key: 0` is treated as falsy
  if (isNotEmpty(newValues)) {
    map.set(amendmentField, newValues)
  }
}

const excludeSavedAmendments = (
  amendmentFields: AmendmentKeys[],
  amendments: Amendments,
  savedAmendments: Amendments
) => {
  const map = new Map()

  amendmentFields.forEach((amendmentField) => {
    if (Array.isArray(amendments[amendmentField])) {
      handleArray(map, amendmentField, amendments, savedAmendments)
    } else if (!isEqual(amendments[amendmentField], savedAmendments[amendmentField])) {
      map.set(amendmentField, amendments[amendmentField])
    }
  })

  return Object.fromEntries(map)
}

export default excludeSavedAmendments
