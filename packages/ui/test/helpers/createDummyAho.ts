import type { AnnotatedHearingOutcome } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import type ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

import createDummyOffence from "./createDummyOffence"
import createDummyResult from "./createDummyResult"

const createDummyAho = (): AnnotatedHearingOutcome => {
  return {
    AnnotatedHearingOutcome: {
      HearingOutcome: {
        Case: {
          CourtReference: {
            CrownCourtReference: "random_crown_ref",
            MagistratesCourtReference: "random_magristrates_ref"
          },
          HearingDefendant: {
            Address: {
              AddressLine1: "somewhere"
            },
            ArrestSummonsNumber: "original_value",
            BailConditions: [],
            Offence: [createDummyOffence()],
            RemandStatus: "some_status",
            Result: createDummyResult()
          },
          PreChargeDecisionIndicator: false,
          PTIURN: "123456"
        },
        Hearing: {
          CourtHearingLocation: {
            BottomLevelCode: "67",
            OrganisationUnitCode: "01234567",
            SecondLevelCode: "23",
            ThirdLevelCode: "45",
            TopLevelCode: "01"
          },
          CourtHouseCode: 123,
          DateOfHearing: new Date("1990-01-01"),
          DefendantPresentAtHearing: "y",
          HearingDocumentationLanguage: "english",
          HearingLanguage: "english",
          SourceReference: {
            DocumentName: "example",
            DocumentType: "document",
            UniqueID: "9999999"
          },
          TimeOfHearing: "0900"
        }
      }
    },
    Exceptions: [
      {
        code: "Exception_Code" as ExceptionCode,
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "Offence", 1234, "Result", 5678]
      },
      {
        code: "HO100302" as ExceptionCode,
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"]
      }
    ]
  }
}

export default createDummyAho
