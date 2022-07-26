import type { CriminalProsecutionReference, OffenceReason } from "src/types/AnnotatedHearingOutcome"
import type { ParsedAsn } from "src/types/ParsedAsn"

const formatOuCode = (
  topLevelCode: string | undefined,
  secondLevelCode: string | null,
  thirdLevelCode: string | null,
  bottomLevelCode: string | null
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
    Year: parsedAsn.year,
    OrganisationUnitIdentifierCode: {
      ...(parsedAsn.topLevelCode && { TopLevelCode: parsedAsn.topLevelCode }),
      SecondLevelCode: parsedAsn.secondLevelCode,
      ThirdLevelCode: parsedAsn.thirdLevelCode,
      BottomLevelCode: parsedAsn.bottomLevelCode,
      OrganisationUnitCode: formatOuCode(
        parsedAsn.topLevelCode,
        parsedAsn.secondLevelCode,
        parsedAsn.thirdLevelCode,
        parsedAsn.bottomLevelCode
      )
    },
    DefendantOrOffenderSequenceNumber: parsedAsn.sequenceNumber ?? "",
    CheckDigit: parsedAsn.checkDigit ?? ""
  },
  ...(parsedOffenceReason && { OffenceReason: parsedOffenceReason })
})
