import type { CriminalProsecutionReference, OffenceReason } from "src/types/AnnotatedHearingOutcome"
import type { ParsedASN } from "src/types/ParsedASN"

export default (
  parsedASN: ParsedASN,
  parsedOffenceReason: OffenceReason | undefined
): CriminalProsecutionReference => ({
  DefendantOrOffender: {
    Year: parsedASN.year,
    OrganisationUnitIdentifierCode: {
      ...(parsedASN.topLevelCode && { TopLevelCode: parsedASN.topLevelCode }),
      SecondLevelCode: parsedASN.secondLevelCode,
      ThirdLevelCode: parsedASN.thirdLevelCode,
      BottomLevelCode: parsedASN.bottomLevelCode,
      OrganisationUnitCode: `${parsedASN.topLevelCode ? parsedASN.topLevelCode : ""}${parsedASN.secondLevelCode}${
        parsedASN.thirdLevelCode
      }${parsedASN.bottomLevelCode}`
    },
    DefendantOrOffenderSequenceNumber: parsedASN.sequenceNumber,
    CheckDigit: parsedASN.checkDigit
  },
  ...(parsedOffenceReason && { OffenceReason: parsedOffenceReason })
})
