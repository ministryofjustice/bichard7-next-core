import isRecordableOffence from "../../phase2/lib/isRecordableOffence"
import generateAhoFromOffenceList from "../../phase2/tests/fixtures/helpers/generateAhoFromOffenceList"
import generatePncUpdateDatasetFromOffenceList from "../../phase2/tests/fixtures/helpers/generatePncUpdateDatasetFromOffenceList"
import type { Offence } from "../../types/AnnotatedHearingOutcome"
import Phase from "../../types/Phase"
import hasCompletedDisarr from "./hasCompletedDisarr"
import TRPS0013 from "./TRPS0013"
jest.mock("../../phase2/lib/isRecordableOffence")
jest.mock("./hasCompletedDisarr")

const mockedIsRecordableOffence = isRecordableOffence as jest.Mock
const mockedHasCompletedDisarr = hasCompletedDisarr as jest.Mock

describe("TRPS0013", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

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
        code: "DISARR",
        status: "Completed",
        data: undefined
      }
    ]
    const result = TRPS0013(generatedHearingOutcome, options)
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
    const result = TRPS0013(generatedHearingOutcome, options)
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
    const result = TRPS0013(generatedHearingOutcome, options)
    expect(result).toEqual([])
  })

  it("should not return a trigger if there are no offences", () => {
    const options = { phase: Phase.PNC_UPDATE }
    const generatedHearingOutcome = generatePncUpdateDatasetFromOffenceList([] as Offence[])
    const result = TRPS0013(generatedHearingOutcome, options)
    expect(result).toEqual([])
  })

  it.each([
    { isRecordable: false, hasCompletedDisarr: false },
    { isRecordable: false, hasCompletedDisarr: false },
    { isRecordable: true, hasCompletedDisarr: false },
    { isRecordable: false, hasCompletedDisarr: true },
    { isRecordable: false, hasCompletedDisarr: false },
    { isRecordable: true, hasCompletedDisarr: false },
    { isRecordable: true, hasCompletedDisarr: true },
    { isRecordable: true, hasCompletedDisarr: true },
    { isRecordable: false, hasCompletedDisarr: true },
    { isRecordable: false, hasCompletedDisarr: false },
    { isRecordable: false, hasCompletedDisarr: true },
    { isRecordable: true, hasCompletedDisarr: false },
    { isRecordable: true, hasCompletedDisarr: false },
    { isRecordable: false, hasCompletedDisarr: true }
  ])(
    "should not return a trigger if isRecordableOffence is $isRecordable, hasCompletedDisarr is $hasCompletedDisarr, does not contain number of TIC for offence",
    ({ isRecordable, hasCompletedDisarr }) => {
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

      mockedIsRecordableOffence.mockReturnValue(isRecordable)
      mockedHasCompletedDisarr.mockReturnValue(hasCompletedDisarr)

      const result = TRPS0013(generatedHearingOutcome, options)
      expect(result).toHaveLength(0)
      expect(result).toEqual([])
    }
  )

  it("should return a trigger if isRecordableOffence is true, hasCompletedDisarr is false, and has a number of TIC for offence", () => {
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
            __type: "NationalOffenceReason"
          }
        },
        CourtOffenceSequenceNumber: 1
      },
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
        },
        CourtOffenceSequenceNumber: 2
      }
    ] as Offence[])
    mockedIsRecordableOffence.mockReturnValue(true)
    mockedHasCompletedDisarr.mockReturnValue(false)
    generatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].Result[0].NumberOfOffencesTIC = 1

    const result = TRPS0013(generatedHearingOutcome, options)
    expect(result).toEqual([{ code: "TRPS0013", offenceSequenceNumber: 1 }])
  })
})
