import type { CriminalProsecutionReference, OffenceReason } from "../../../types/AnnotatedHearingOutcome"
import type { ParsedAsn } from "../../types/ParsedAsn"

const formatOuCode = (
  topLevelCode: string | undefined,
  secondLevelCode: null | string,
  thirdLevelCode: null | string,
  bottomLevelCode: null | string
) => {
  if (secondLevelCode && thirdLevelCode && bottomLevelCode) {
    return `${topLevelCode ? topLevelCode : ""}${secondLevelCode}${thirdLevelCode}${bottomLevelCode}`
  }

  return ""
}

export default (
  parsedAsn: ParsedAsn,
  parsedOffenceReason: OffenceReason | undefined
): CriminalProsecutionReference => ({
  DefendantOrOffender: {
    CheckDigit: parsedAsn.checkDigit ?? "",
    DefendantOrOffenderSequenceNumber: parsedAsn.sequenceNumber ?? "",
    OrganisationUnitIdentifierCode: {
      ...(parsedAsn.topLevelCode && { TopLevelCode: parsedAsn.topLevelCode }),
      BottomLevelCode: parsedAsn.bottomLevelCode,
      OrganisationUnitCode: formatOuCode(
        parsedAsn.topLevelCode,
        parsedAsn.secondLevelCode,
        parsedAsn.thirdLevelCode,
        parsedAsn.bottomLevelCode
      ),
      SecondLevelCode: parsedAsn.secondLevelCode,
      ThirdLevelCode: parsedAsn.thirdLevelCode
    },
    Year: parsedAsn.year
  },
  ...(parsedOffenceReason && { OffenceReason: parsedOffenceReason })
})
