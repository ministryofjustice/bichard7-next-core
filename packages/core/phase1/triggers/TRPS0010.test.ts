jest.mock("../../phase2/isRecordableOffence")
jest.mock("./hasCompletedDisarr")
jest.mock("../../phase2/lib/deriveOperationSequence/disarrCompatibleResultClass")
import isRecordableOffence from "../../phase2/isRecordableOffence"
import disarrCompatibleResultClass from "../../phase2/lib/deriveOperationSequence/disarrCompatibleResultClass"
import generateAhoFromOffenceList from "../../phase2/tests/fixtures/helpers/generateAhoFromOffenceList"
import generatePncUpdateDatasetFromOffenceList from "../../phase2/tests/fixtures/helpers/generatePncUpdateDatasetFromOffenceList"
import type { Offence } from "../../types/AnnotatedHearingOutcome"
import Phase from "../../types/Phase"
import hasCompletedDisarr from "./hasCompletedDisarr"
import TRPS0010 from "./TRPS0010"

const mockedIsRecordableOffence = isRecordableOffence as jest.Mock
const mockedHasCompletedDisarr = hasCompletedDisarr as jest.Mock
const mockedDisarrCompatibleResultClass = disarrCompatibleResultClass as jest.Mock

describe("TRPS0010", () => {
  it("should return an empty array if options.phase is not equal to Phase.PNC_UPDATE", () => {
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
    const result = TRPS0010(generatedHearingOutcome, options)
    expect(result).toEqual([])
  })

  it("should return an empty array if hearingOutcome is not a PncUpdateDataset", () => {
    const options = { phase: Phase.PNC_UPDATE }
    const generatedHearingOutcome = generateAhoFromOffenceList([] as Offence[])
    const result = TRPS0010(generatedHearingOutcome, options)
    expect(result).toEqual([])
  })

  it("should return an empty array if there are no offences", () => {
    const options = { phase: Phase.PNC_UPDATE }
    const generatedHearingOutcome = generatePncUpdateDatasetFromOffenceList([] as Offence[])
    const result = TRPS0010(generatedHearingOutcome, options)
    expect(result).toEqual([])
  })

  it.each([
    { addedByCourt: false, isRecordable: false, hasCompletedDisarr: false, disarrCompatibleResultClass: false },
    { addedByCourt: true, isRecordable: false, hasCompletedDisarr: false, disarrCompatibleResultClass: false },
    { addedByCourt: false, isRecordable: true, hasCompletedDisarr: false, disarrCompatibleResultClass: false },
    { addedByCourt: false, isRecordable: false, hasCompletedDisarr: true, disarrCompatibleResultClass: false },
    { addedByCourt: false, isRecordable: false, hasCompletedDisarr: false, disarrCompatibleResultClass: true },
    { addedByCourt: true, isRecordable: true, hasCompletedDisarr: false, disarrCompatibleResultClass: false },
    { addedByCourt: true, isRecordable: true, hasCompletedDisarr: true, disarrCompatibleResultClass: false },
    { addedByCourt: false, isRecordable: true, hasCompletedDisarr: true, disarrCompatibleResultClass: true },
    { addedByCourt: false, isRecordable: false, hasCompletedDisarr: true, disarrCompatibleResultClass: true },
    { addedByCourt: true, isRecordable: false, hasCompletedDisarr: false, disarrCompatibleResultClass: true },
    { addedByCourt: true, isRecordable: false, hasCompletedDisarr: true, disarrCompatibleResultClass: false },
    { addedByCourt: false, isRecordable: true, hasCompletedDisarr: false, disarrCompatibleResultClass: true },
    { addedByCourt: true, isRecordable: true, hasCompletedDisarr: false, disarrCompatibleResultClass: true },
    { addedByCourt: true, isRecordable: false, hasCompletedDisarr: true, disarrCompatibleResultClass: true }
  ])(
    "should return an empty array if AddedByTheCourt is $addedByCourt, isRecordableOffence is $isRecordable, hasCompletedDisarr is $hasCompletedDisarr, and disarrCompatibleResultClass is $disarrCompatibleResultClass for offence",
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
          }
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
})
