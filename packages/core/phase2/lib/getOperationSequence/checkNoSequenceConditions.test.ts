import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import fs from "fs"
import { parseAhoXml } from "../../../lib/parse/parseAhoXml"
import type { AnnotatedHearingOutcome, Result } from "../../../types/AnnotatedHearingOutcome"
import checkNoSequenceConditions from "./checkNoSequenceConditions"

describe("checkNoSequenceConditions", () => {
  const inputMessage = fs.readFileSync("phase2/tests/fixtures/AnnotatedHO1.xml").toString()

  it("should add HO200117 exception to offenceReason if too many recordable results on the offence", () => {
    const aho = parseAhoXml(inputMessage) as AnnotatedHearingOutcome
    const MAX_ALLOWABLE_RESULTS = 10
    const dummyResult = { PNCDisposalType: 1111 } as Result
    for (let i = 0; i < MAX_ALLOWABLE_RESULTS + 1; i++) {
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].Result.push(dummyResult)
    }

    const exceptions = checkNoSequenceConditions(aho)

    expect(aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].Result.length).toBeGreaterThan(
      MAX_ALLOWABLE_RESULTS
    )
    expect(exceptions).toHaveLength(1)
    expect(exceptions[0].code).toBe(ExceptionCode.HO200117)
    expect(exceptions[0].path).toEqual([
      "AnnotatedHearingOutcome",
      "HearingOutcome",
      "Case",
      "HearingDefendant",
      "Offence",
      0,
      "CriminalProsecutionReference",
      "OffenceReason",
      "OffenceCode",
      "Reason"
    ])
  })

  it("should use local offence code in HO200117 exception if no national offence code", () => {
    const aho = parseAhoXml(inputMessage) as AnnotatedHearingOutcome
    const MAX_ALLOWABLE_RESULTS = 10
    const dummyResult = { PNCDisposalType: 1111 } as Result

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].CriminalProsecutionReference.OffenceReason =
      {
        __type: "LocalOffenceReason",
        LocalOffenceCode: {
          AreaCode: "area-code",
          OffenceCode: "offence-code"
        }
      }

    for (let i = 0; i < MAX_ALLOWABLE_RESULTS + 1; i++) {
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].Result.push(dummyResult)
    }

    const exceptions = checkNoSequenceConditions(aho)

    expect(aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].Result.length).toBeGreaterThan(
      MAX_ALLOWABLE_RESULTS
    )
    expect(exceptions).toHaveLength(1)
    expect(exceptions[0].code).toBe(ExceptionCode.HO200117)
    expect(exceptions[0].path).toEqual([
      "AnnotatedHearingOutcome",
      "HearingOutcome",
      "Case",
      "HearingDefendant",
      "Offence",
      0,
      "CriminalProsecutionReference",
      "OffenceReason",
      "LocalOffenceCode",
      "OffenceCode"
    ])
  })
})
