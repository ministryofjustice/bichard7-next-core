import type { Offence } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import { PncOperation } from "@moj-bichard7/common/types/PncOperation"

import generateAhoFromOffenceList from "../../phase2/tests/fixtures/helpers/generateAhoFromOffenceList"
import generatePncUpdateDatasetFromOffenceList from "../../phase2/tests/fixtures/helpers/generatePncUpdateDatasetFromOffenceList"
import Phase from "../../types/Phase"
import isRecordableOffence from "../offences/isRecordableOffence"
import isResultCompatibleWithDisposal from "../results/isResultCompatibleWithDisposal"
import hasCompletedDisposal from "./hasCompletedDisposal"
import TRPS0011 from "./TRPS0011"
jest.mock("../offences/isRecordableOffence")
jest.mock("./hasCompletedDisposal")
jest.mock("../results/isResultCompatibleWithDisposal")

const mockedIsRecordableOffence = isRecordableOffence as jest.Mock
const mockedHasCompletedDisarr = hasCompletedDisposal as jest.Mock
const mockedDisarrCompatibleResultClass = isResultCompatibleWithDisposal as jest.Mock

describe("TRPS0011", () => {
  it("should not return a trigger if phase is not PNC_UPDATE and hearing outcome is PNC updated dataset", () => {
    const options = { phase: Phase.HEARING_OUTCOME }
    const generatedHearingOutcome = generatePncUpdateDatasetFromOffenceList([
      {
        Result: [
          {
            CJSresultCode: 9999
          }
        ],
        CriminalProsecutionReference: {
          OffenceReason: {
            __type: "NationalOffenceReason"
          }
        }
      }
    ] as Offence[])
    generatedHearingOutcome.PncOperations = [
      {
        code: PncOperation.NORMAL_DISPOSAL,
        status: "Completed",
        data: undefined
      }
    ]
    const result = TRPS0011(generatedHearingOutcome, options)
    expect(result).toEqual([])
  })

  it("should not return a trigger if phase is PNC_UPDATE and hearingOutcome is not a PncUpdateDataset", () => {
    const options = { phase: Phase.PNC_UPDATE }
    const generatedHearingOutcome = generateAhoFromOffenceList([
      {
        Result: [
          {
            CJSresultCode: 1234
          }
        ],
        CriminalProsecutionReference: {
          OffenceReason: {
            __type: "NationalOffenceReason"
          }
        }
      }
    ] as Offence[])
    const result = TRPS0011(generatedHearingOutcome, options)
    expect(result).toEqual([])
  })

  it("should not return a trigger if not PNC_UPDATE and hearing outcome is not a PncUpdateDataset", () => {
    const options = { phase: Phase.HEARING_OUTCOME }
    const generatedHearingOutcome = generateAhoFromOffenceList([
      {
        Result: [
          {
            CJSresultCode: 1234
          }
        ],
        CriminalProsecutionReference: {
          OffenceReason: {
            __type: "NationalOffenceReason"
          }
        }
      }
    ] as Offence[])
    const result = TRPS0011(generatedHearingOutcome, options)
    expect(result).toEqual([])
  })

  it("should not return a trigger if there are no offences", () => {
    const options = { phase: Phase.PNC_UPDATE }
    const generatedHearingOutcome = generatePncUpdateDatasetFromOffenceList([] as Offence[])
    const result = TRPS0011(generatedHearingOutcome, options)
    expect(result).toEqual([])
  })

  it.each([
    { addedByCourt: false, isRecordable: false, hasCompletedDisarr: false, disarrCompatibleResultClass: false },
    { addedByCourt: true, isRecordable: false, hasCompletedDisarr: false, disarrCompatibleResultClass: false },
    { addedByCourt: false, isRecordable: true, hasCompletedDisarr: false, disarrCompatibleResultClass: false },
    { addedByCourt: false, isRecordable: false, hasCompletedDisarr: true, disarrCompatibleResultClass: false },
    { addedByCourt: false, isRecordable: false, hasCompletedDisarr: false, disarrCompatibleResultClass: true },
    { addedByCourt: true, isRecordable: false, hasCompletedDisarr: true, disarrCompatibleResultClass: false },
    { addedByCourt: true, isRecordable: false, hasCompletedDisarr: false, disarrCompatibleResultClass: true },
    { addedByCourt: false, isRecordable: true, hasCompletedDisarr: true, disarrCompatibleResultClass: false },
    { addedByCourt: false, isRecordable: true, hasCompletedDisarr: false, disarrCompatibleResultClass: true },
    { addedByCourt: false, isRecordable: false, hasCompletedDisarr: true, disarrCompatibleResultClass: true },
    { addedByCourt: true, isRecordable: false, hasCompletedDisarr: true, disarrCompatibleResultClass: true },
    { addedByCourt: false, isRecordable: true, hasCompletedDisarr: true, disarrCompatibleResultClass: true },
    { addedByCourt: true, isRecordable: true, hasCompletedDisarr: true, disarrCompatibleResultClass: true }
  ])(
    "should return no trigger if AddedByTheCourt is $addedByCourt, isRecordableOffence is $isRecordable, hasCompletedDisarr is $hasCompletedDisarr, or disarrCompatibleResultClass is $disarrCompatibleResultClass for offence",
    ({ addedByCourt, isRecordable, disarrCompatibleResultClass, hasCompletedDisarr }) => {
      const options = { phase: Phase.PNC_UPDATE }
      const generatedHearingOutcome = generatePncUpdateDatasetFromOffenceList([
        {
          Result: [
            {
              CJSresultCode: 9999
            }
          ],
          CriminalProsecutionReference: {
            OffenceReason: {
              __type: "NationalOffenceReason",
              OffenceCode: {
                __type: "NonMatchingOffenceCode",
                ActOrSource: "Act",
                Reason: "test",
                FullCode: "test"
              }
            },
            OffenceReasonSequence: "A1"
          },
          CourtOffenceSequenceNumber: 1
        }
      ] as Offence[])

      generatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].AddedByTheCourt =
        addedByCourt

      mockedIsRecordableOffence.mockReturnValue(isRecordable)
      mockedHasCompletedDisarr.mockReturnValue(hasCompletedDisarr)
      mockedDisarrCompatibleResultClass.mockReturnValue(disarrCompatibleResultClass)

      const result = TRPS0011(generatedHearingOutcome, options)
      expect(result).toHaveLength(0)
      expect(result).toEqual([])
    }
  )

  it.each([
    { addedByCourt: true, isRecordable: true, hasCompletedDisarr: false, disarrCompatibleResultClass: false },
    { addedByCourt: true, isRecordable: true, hasCompletedDisarr: true, disarrCompatibleResultClass: false },
    { addedByCourt: true, isRecordable: true, hasCompletedDisarr: false, disarrCompatibleResultClass: true }
  ])(
    "should return trigger if AddedByTheCourt is $addedByCourt, isRecordableOffence is $isRecordable, hasCompletedDisarr is $hasCompletedDisarr, or disarrCompatibleResultClass is $disarrCompatibleResultClass for offence",
    ({ addedByCourt, isRecordable, disarrCompatibleResultClass, hasCompletedDisarr }) => {
      const options = { phase: Phase.PNC_UPDATE }
      const generatedHearingOutcome = generatePncUpdateDatasetFromOffenceList([
        {
          Result: [
            {
              CJSresultCode: 9999
            }
          ],
          CriminalProsecutionReference: {
            OffenceReason: {
              __type: "NationalOffenceReason",
              OffenceCode: {
                __type: "NonMatchingOffenceCode",
                ActOrSource: "Act",
                Reason: "test",
                FullCode: "test"
              }
            },
            OffenceReasonSequence: "A1"
          },
          CourtOffenceSequenceNumber: 1
        }
      ] as Offence[])

      generatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].AddedByTheCourt =
        addedByCourt

      mockedIsRecordableOffence.mockReturnValue(isRecordable)
      mockedHasCompletedDisarr.mockReturnValue(hasCompletedDisarr)
      mockedDisarrCompatibleResultClass.mockReturnValue(disarrCompatibleResultClass)

      const result = TRPS0011(generatedHearingOutcome, options)
      expect(result).toHaveLength(1)
      expect(result).toEqual([{ code: "TRPS0011", offenceSequenceNumber: 1 }])
    }
  )
})
