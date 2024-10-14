import type { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import type ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import createDummyOffence from "./createDummyOffence"
import createDummyResult from "./createDummyResult"

const createDummyAho = (): AnnotatedHearingOutcome => {
  return {
    Exceptions: [
      {
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          1234,
          "Result",
          5678
        ],
        code: "Exception_Code" as ExceptionCode
      },
      {
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"],
        code: "HO100302" as ExceptionCode
      }
    ],
    AnnotatedHearingOutcome: {
      HearingOutcome: {
        Case: {
          PTIURN: "123456",
          PreChargeDecisionIndicator: false,
          HearingDefendant: {
            ArrestSummonsNumber: "original_value",
            Offence: [createDummyOffence()],
            Result: createDummyResult(),
            Address: {
              AddressLine1: "somewhere"
            },
            RemandStatus: "some_status",
            BailConditions: []
          },
          CourtReference: {
            MagistratesCourtReference: "random_magristrates_ref",
            CrownCourtReference: "random_crown_ref"
          }
        },
        Hearing: {
          CourtHearingLocation: {
            TopLevelCode: "01",
            SecondLevelCode: "23",
            ThirdLevelCode: "45",
            BottomLevelCode: "67",
            OrganisationUnitCode: "01234567"
          },
          DateOfHearing: new Date("1990-01-01"),
          TimeOfHearing: "0900",
          HearingLanguage: "english",
          HearingDocumentationLanguage: "english",
          DefendantPresentAtHearing: "y",
          SourceReference: {
            DocumentName: "example",
            UniqueID: "9999999",
            DocumentType: "document"
          },
          CourtHouseCode: 123
        }
      }
    }
  }
}

export default createDummyAho
