import type { Offence, OffenceReason, Result } from "../../../types/AnnotatedHearingOutcome"
import type { Operation, PncUpdateDataset } from "../../../types/PncUpdateDataset"

import ResultClass from "../../../types/ResultClass"

const generatePncUpdateDatasetWithOperations = (operations: Operation[] = []): PncUpdateDataset => {
  const offence = {
    OffenceCategory: "ZZ",
    CriminalProsecutionReference: {
      OffenceReason: {
        __type: "NationalOffenceReason",
        OffenceCode: {
          __type: "NonMatchingOffenceCode",
          ActOrSource: "RT",
          Year: "88",
          Reason: 191,
          FullCode: "RT88191"
        }
      } as unknown as OffenceReason
    },
    AddedByTheCourt: true,
    ActualOffenceStartDate: {
      StartDate: new Date("2025-01-01")
    },
    Result: [
      {
        NextHearingDate: "2024-12-11T10:11:12.000Z",
        NextResultSourceOrganisation: {
          TopLevelCode: "B",
          SecondLevelCode: "01",
          ThirdLevelCode: "00",
          BottomLevelCode: "00",
          OrganisationUnitCode: "B000000"
        },
        PNCDisposalType: 2059,
        PNCAdjudicationExists: true,
        ResultClass: ResultClass.ADJOURNMENT_PRE_JUDGEMENT,
        ResultQualifierVariable: [{ Code: "LE" }]
      }
    ] as Result[]
  } as Offence

  const pncUpdateDataset = {
    AnnotatedHearingOutcome: {
      HearingOutcome: {
        Hearing: {
          DateOfHearing: new Date("2024-12-05"),
          CourtHearingLocation: {
            TopLevelCode: "B",
            SecondLevelCode: "01",
            ThirdLevelCode: "00",
            BottomLevelCode: "00",
            OrganisationUnitCode: "B000000"
          },
          CourtHouseName: "Magistrates' Courts London Croydon",
          CourtType: "MCA",
          SourceReference: { UniqueID: "correlation-id" }
        },
        Case: {
          CourtCaseReferenceNumber: "97/1626/008395Q",
          ForceOwner: {
            TopLevelCode: "A",
            SecondLevelCode: "02",
            ThirdLevelCode: "BJ",
            BottomLevelCode: "01",
            OrganisationUnitCode: "A02BJ01"
          },
          HearingDefendant: {
            ArrestSummonsNumber: "1101ZD0100000410780J",
            BailConditions: ["This is a dummy bail condition."],
            Offence: [offence],
            RemandStatus: "CB"
          },
          PTIURN: "01ZD0303208"
        }
      }
    },
    Exceptions: [],
    PncOperations: operations
  }

  return pncUpdateDataset as unknown as PncUpdateDataset
}

export default generatePncUpdateDatasetWithOperations
