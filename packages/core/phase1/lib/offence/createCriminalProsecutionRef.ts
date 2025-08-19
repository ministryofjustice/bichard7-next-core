import type { CriminalProsecutionReference, OffenceReason } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

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
