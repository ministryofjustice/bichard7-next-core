jest.mock("./isMatchToPncAdjudicationAndDisposals")
import type { AnnotatedHearingOutcome, Offence, Result } from "../../../../types/AnnotatedHearingOutcome"
import generateAhoFromOffenceList from "../../../tests/fixtures/helpers/generateAhoFromOffenceList"
import areAllResultsAlreadyPresentOnPnc from "./areAllResultsAlreadyPresentOnPnc"
import { isMatchToPncAdjudicationAndDisposals } from "./isMatchToPncAdjudicationAndDisposals"

const mockedisMatchToPncAdjudicationAndDisposals = isMatchToPncAdjudicationAndDisposals as jest.Mock
type TestInput = {
  output: boolean
  when: string
  offences: {
    ccr?: string
    reasonSequence?: string
    results: { pncDisposalType: number }[]
    isMatchToPncAdjudicationAndDisposalsValue?: boolean
  }[]
}

describe("areAllResultsAlreadyPresentOnPnc", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("given an offence without a pnc record (no pnc case id), returns false", () => {
    const recordableResult: Result = {
      CJSresultCode: 2063,
      PNCDisposalType: 2063,
      PNCAdjudicationExists: false
    } as unknown as Result
    const offence: Offence = {
      Result: [recordableResult],
      CriminalProsecutionReference: {
        OffenceReasonSequence: "001"
      }
    } as Offence
    const aho = generateAhoFromOffenceList([offence])
    const result = areAllResultsAlreadyPresentOnPnc(aho)

    expect(result).toBe(false)
  })

  it.each<TestInput>([
    {
      output: true,
      when: "all offences have results, CCR and reason sequence and offences match PNC adjudications and disposals",
      offences: [
        {
          ccr: "123",
          reasonSequence: "1",
          results: [{ pncDisposalType: 1000 }, { pncDisposalType: 1000 }],
          isMatchToPncAdjudicationAndDisposalsValue: true
        },
        {
          ccr: "234",
          reasonSequence: "2",
          results: [{ pncDisposalType: 1000 }, { pncDisposalType: 1000 }],
          isMatchToPncAdjudicationAndDisposalsValue: true
        }
      ]
    },
    {
      output: false,
      when: "all offences have results, CCR and reason sequence, but one offence does not match PNC adjudications and disposals",
      offences: [
        {
          ccr: "123",
          reasonSequence: "1",
          results: [{ pncDisposalType: 1000 }, { pncDisposalType: 1000 }],
          isMatchToPncAdjudicationAndDisposalsValue: false
        },
        {
          ccr: "234",
          reasonSequence: "2",
          results: [{ pncDisposalType: 1000 }, { pncDisposalType: 1000 }],
          isMatchToPncAdjudicationAndDisposalsValue: true
        }
      ]
    },
    {
      output: true,
      when: "first offence has non-recordable results and no reason sequence, and second offence has results, CCR and reason sequence, and match PNC adjudications and disposals",
      offences: [
        {
          ccr: "123",
          results: [{ pncDisposalType: 1000 }, { pncDisposalType: 1000 }],
          isMatchToPncAdjudicationAndDisposalsValue: undefined
        },
        {
          ccr: "234",
          reasonSequence: "2",
          results: [{ pncDisposalType: 1000 }, { pncDisposalType: 1000 }],
          isMatchToPncAdjudicationAndDisposalsValue: true
        }
      ]
    },
    {
      output: false,
      when: "first offence has recordable results and no reason sequence, and second offence has results, CCR and reason sequence, and match PNC adjudications and disposals",
      offences: [
        {
          ccr: "123",
          results: [{ pncDisposalType: 1001 }, { pncDisposalType: 1002 }],
          isMatchToPncAdjudicationAndDisposalsValue: undefined
        },
        {
          ccr: "234",
          reasonSequence: "2",
          results: [{ pncDisposalType: 1000 }, { pncDisposalType: 1000 }],
          isMatchToPncAdjudicationAndDisposalsValue: true
        }
      ]
    },
    {
      output: false,
      when: "first offence has non-recordable results and no reason sequence, and second offence has results, CCR and reason sequence, but does not match PNC adjudications and disposals",
      offences: [
        {
          ccr: "123",
          results: [{ pncDisposalType: 1000 }, { pncDisposalType: 1000 }],
          isMatchToPncAdjudicationAndDisposalsValue: undefined
        },
        {
          ccr: "234",
          reasonSequence: "2",
          results: [{ pncDisposalType: 1000 }, { pncDisposalType: 1000 }],
          isMatchToPncAdjudicationAndDisposalsValue: false
        }
      ]
    },
    {
      output: true,
      when: "first offence has non-recordable results and no reason sequence, and second offence has non-recordable results and no court case reference",
      offences: [
        {
          ccr: "123",
          results: [{ pncDisposalType: 1000 }, { pncDisposalType: 1000 }],
          isMatchToPncAdjudicationAndDisposalsValue: undefined
        },
        {
          reasonSequence: "2",
          results: [{ pncDisposalType: 1000 }, { pncDisposalType: 1000 }],
          isMatchToPncAdjudicationAndDisposalsValue: true
        }
      ]
    },
    {
      output: true,
      when: "both offences have no results",
      offences: [
        {
          ccr: "123",
          reasonSequence: "1",
          results: [],
          isMatchToPncAdjudicationAndDisposalsValue: undefined
        },
        {
          ccr: "234",
          reasonSequence: "2",
          results: [],
          isMatchToPncAdjudicationAndDisposalsValue: undefined
        }
      ]
    }
  ])("should return $output when $when", ({ output, offences }) => {
    const aho = {
      PncQuery: {
        pncId: "2016/099999"
      },
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Case: {
            HearingDefendant: {
              Offence: offences.map((offence) => ({
                CourtCaseReferenceNumber: offence.ccr,
                CriminalProsecutionReference: { OffenceReasonSequence: offence.reasonSequence },
                Result: offence.results.map((result) => ({ PNCDisposalType: result.pncDisposalType }))
              }))
            }
          }
        }
      }
    } as unknown as AnnotatedHearingOutcome

    offences
      .filter((offence) => offence.isMatchToPncAdjudicationAndDisposalsValue !== undefined)
      .forEach(({ isMatchToPncAdjudicationAndDisposalsValue }) => {
        mockedisMatchToPncAdjudicationAndDisposals.mockReturnValueOnce(isMatchToPncAdjudicationAndDisposalsValue)
      })
    mockedisMatchToPncAdjudicationAndDisposals.mockImplementation(() => {
      throw Error("Too many invocations!")
    })

    const result = areAllResultsAlreadyPresentOnPnc(aho)

    expect(result).toBe(output)
  })
})
