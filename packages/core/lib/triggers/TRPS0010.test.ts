jest.mock("../../phase2/lib/isRecordableOffence")
jest.mock("./hasCompletedDisposal")
jest.mock("../../phase2/lib/isResultCompatibleWithDisposal")

import type { Offence } from "../../types/AnnotatedHearingOutcome"

import isRecordableOffence from "../../phase2/lib/isRecordableOffence"
import isResultCompatibleWithDisposal from "../../phase2/lib/isResultCompatibleWithDisposal"
import generateAhoFromOffenceList from "../../phase2/tests/fixtures/helpers/generateAhoFromOffenceList"
import generatePncUpdateDatasetFromOffenceList from "../../phase2/tests/fixtures/helpers/generatePncUpdateDatasetFromOffenceList"
import Phase from "../../types/Phase"
import { PncOperation } from "../../types/PncOperation"
import hasCompletedDisposal from "./hasCompletedDisposal"
import TRPS0010 from "./TRPS0010"

const mockedIsRecordableOffence = isRecordableOffence as jest.Mock
const mockedHasCompletedDisarr = hasCompletedDisposal as jest.Mock
const mockedDisarrCompatibleResultClass = isResultCompatibleWithDisposal as jest.Mock

describe("TRPS0010", () => {
  it("should not return a trigger if phase is not PNC_UPDATE and hearing outcome is PNC updated dataset", () => {
    const options = { phase: Phase.HEARING_OUTCOME }
    const generatedHearingOutcome = generatePncUpdateDatasetFromOffenceList([
      {
        CriminalProsecutionReference: {
          OffenceReason: {
            __type: "NationalOffenceReason"
          }
        },
        Result: [
          {
            CJSresultCode: 9999
          }
        ]
      }
    ] as Offence[])
    generatedHearingOutcome.PncOperations = [
      {
        code: PncOperation.NORMAL_DISPOSAL,
        data: undefined,
        status: "Completed"
      }
    ]
    const result = TRPS0010(generatedHearingOutcome, options)
    expect(result).toEqual([])
  })

  it("should not return a trigger if phase is PNC_UPDATE and hearingOutcome is not a PncUpdateDataset", () => {
    const options = { phase: Phase.PNC_UPDATE }
    const generatedHearingOutcome = generateAhoFromOffenceList([
      {
        CriminalProsecutionReference: {
          OffenceReason: {
            __type: "NationalOffenceReason"
          }
        },
        Result: [
          {
            CJSresultCode: 1234
          }
        ]
      }
    ] as Offence[])
    const result = TRPS0010(generatedHearingOutcome, options)
    expect(result).toEqual([])
  })

  it("should not return a trigger if not PNC_UPDATE and hearing outcome is not a PncUpdateDataset", () => {
    const options = { phase: Phase.HEARING_OUTCOME }
    const generatedHearingOutcome = generateAhoFromOffenceList([
      {
        CriminalProsecutionReference: {
          OffenceReason: {
            __type: "NationalOffenceReason"
          }
        },
        Result: [
          {
            CJSresultCode: 1234
          }
        ]
      }
    ] as Offence[])
    const result = TRPS0010(generatedHearingOutcome, options)
    expect(result).toEqual([])
  })

  it("should not return a trigger if there are no offences", () => {
    const options = { phase: Phase.PNC_UPDATE }
    const generatedHearingOutcome = generatePncUpdateDatasetFromOffenceList([] as Offence[])
    const result = TRPS0010(generatedHearingOutcome, options)
    expect(result).toEqual([])
  })

  it.each([
    { addedByCourt: false, disarrCompatibleResultClass: false, hasCompletedDisarr: false, isRecordable: false },
    { addedByCourt: true, disarrCompatibleResultClass: false, hasCompletedDisarr: false, isRecordable: false },
    { addedByCourt: false, disarrCompatibleResultClass: false, hasCompletedDisarr: false, isRecordable: true },
    { addedByCourt: false, disarrCompatibleResultClass: false, hasCompletedDisarr: true, isRecordable: false },
    { addedByCourt: false, disarrCompatibleResultClass: true, hasCompletedDisarr: false, isRecordable: false },
    { addedByCourt: true, disarrCompatibleResultClass: false, hasCompletedDisarr: false, isRecordable: true },
    { addedByCourt: true, disarrCompatibleResultClass: false, hasCompletedDisarr: true, isRecordable: true },
    { addedByCourt: false, disarrCompatibleResultClass: true, hasCompletedDisarr: true, isRecordable: true },
    { addedByCourt: false, disarrCompatibleResultClass: true, hasCompletedDisarr: true, isRecordable: false },
    { addedByCourt: true, disarrCompatibleResultClass: true, hasCompletedDisarr: false, isRecordable: false },
    { addedByCourt: true, disarrCompatibleResultClass: false, hasCompletedDisarr: true, isRecordable: false },
    { addedByCourt: false, disarrCompatibleResultClass: true, hasCompletedDisarr: false, isRecordable: true },
    { addedByCourt: true, disarrCompatibleResultClass: true, hasCompletedDisarr: false, isRecordable: true },
    { addedByCourt: true, disarrCompatibleResultClass: true, hasCompletedDisarr: true, isRecordable: false }
  ])(
    "should return an empty array if AddedByTheCourt is $addedByCourt, isRecordableOffence is $isRecordable, hasCompletedDisarr is $hasCompletedDisarr, and disarrCompatibleResultClass is $disarrCompatibleResultClass for offence",
    ({ addedByCourt, disarrCompatibleResultClass, hasCompletedDisarr, isRecordable }) => {
      const options = { phase: Phase.PNC_UPDATE }
      const generatedHearingOutcome = generatePncUpdateDatasetFromOffenceList([
        {
          CriminalProsecutionReference: {
            OffenceReason: {
              __type: "NationalOffenceReason",
              OffenceCode: {
                __type: "NonMatchingOffenceCode",
                ActOrSource: "Act",
                FullCode: "test",
                Reason: "test"
              }
            },
            OffenceReasonSequence: "A1"
          },
          Result: [
            {
              CJSresultCode: 9999
            }
          ]
        }
      ] as Offence[])

      generatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].AddedByTheCourt =
        addedByCourt

      mockedIsRecordableOffence.mockReturnValue(isRecordable)
      mockedHasCompletedDisarr.mockReturnValue(hasCompletedDisarr)
      mockedDisarrCompatibleResultClass.mockReturnValue(disarrCompatibleResultClass)

      const result = TRPS0010(generatedHearingOutcome, options)
      expect(result).toHaveLength(0)
    }
  )

  it("should return an empty array if AddedByTheCourt is true, isRecordableOffence is true, hasCompletedDisarr is true, and disarrCompatibleResultClass is true for offence", () => {
    const options = { phase: Phase.PNC_UPDATE }
    const generatedHearingOutcome = generatePncUpdateDatasetFromOffenceList([
      {
        CourtOffenceSequenceNumber: 1,
        CriminalProsecutionReference: {
          OffenceReason: {
            __type: "NationalOffenceReason",
            OffenceCode: {
              __type: "NonMatchingOffenceCode",
              ActOrSource: "Act",
              FullCode: "test",
              Reason: "test"
            }
          },
          OffenceReasonSequence: "A1"
        },
        Result: [
          {
            CJSresultCode: 9999
          }
        ]
      }
    ] as Offence[])

    generatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].AddedByTheCourt =
      true

    mockedIsRecordableOffence.mockReturnValue(true)
    mockedHasCompletedDisarr.mockReturnValue(true)
    mockedDisarrCompatibleResultClass.mockReturnValue(true)

    const result = TRPS0010(generatedHearingOutcome, options)
    expect(result).toEqual([{ code: "TRPS0010", offenceSequenceNumber: 1 }])
  })
})
