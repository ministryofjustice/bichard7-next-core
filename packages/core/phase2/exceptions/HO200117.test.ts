import HO200117 from "./HO200117"
import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import generateAhoFromOffenceList from "../tests/fixtures/helpers/generateAhoFromOffenceList"

describe("HO200117", () => {
  describe("when national offence with more than 10 recordable results", () => {
    it("returns HO200117 exception", () => {
      const recordableResults = new Array(11).fill({ PNCDisposalType: 1111 })
      const aho = generateAhoFromOffenceList([
        { Result: [] },
        {
          CriminalProsecutionReference: { OffenceReason: { __type: "NationalOffenceReason" } },
          Result: recordableResults
        }
      ])

      const exceptions = HO200117(aho)

      expect(exceptions).toStrictEqual([
        {
          code: ExceptionCode.HO200117,
          path: [
            "AnnotatedHearingOutcome",
            "HearingOutcome",
            "Case",
            "HearingDefendant",
            "Offence",
            1,
            "CriminalProsecutionReference",
            "OffenceReason",
            "OffenceCode",
            "Reason"
          ]
        }
      ])
    })
  })

  describe("when local offence with more than 10 recordable results", () => {
    it("returns HO200117 exception", () => {
      const recordableResults = new Array(11).fill({ PNCDisposalType: 1111 })
      const aho = generateAhoFromOffenceList([
        { Result: [] },
        {
          CriminalProsecutionReference: { OffenceReason: { __type: "LocalOffenceReason" } },
          Result: recordableResults
        }
      ])

      const exceptions = HO200117(aho)

      expect(exceptions).toStrictEqual([
        {
          code: ExceptionCode.HO200117,
          path: [
            "AnnotatedHearingOutcome",
            "HearingOutcome",
            "Case",
            "HearingDefendant",
            "Offence",
            1,
            "CriminalProsecutionReference",
            "OffenceReason",
            "LocalOffenceCode",
            "OffenceCode"
          ]
        }
      ])
    })
  })

  it("doesn't return any exceptions when there are 10 recordable results", () => {
    const recordableResults = new Array(10).fill({ PNCDisposalType: 1111 })
    const aho = generateAhoFromOffenceList([{ Result: [] }, { Result: recordableResults }])

    const exceptions = HO200117(aho)

    expect(exceptions).toHaveLength(0)
  })

  it("doesn't return any exceptions when there are less than 10 recordable results", () => {
    const recordableResults = new Array(9).fill({ PNCDisposalType: 1111 })
    const aho = generateAhoFromOffenceList([{ Result: [] }, { Result: recordableResults }])

    const exceptions = HO200117(aho)

    expect(exceptions).toHaveLength(0)
  })
})
