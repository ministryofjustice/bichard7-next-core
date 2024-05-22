import { parseAhoXml } from "../phase1/parse/parseAhoXml"
import type { AnnotatedHearingOutcome, Result } from "../types/AnnotatedHearingOutcome"
import { ExceptionCode } from "../types/ExceptionCode"
import checkNoSequenceConditions from "./checkNoSequenceConditions"
import fs from "fs"

describe("check", () => {
  const inputMessage = fs.readFileSync("phase2/tests/fixtures/AnnotatedHO1.xml").toString()

  it("should add HO200110 exception to asn if asn is dummy", () => {
    const aho = parseAhoXml(inputMessage) as AnnotatedHearingOutcome
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber = "0800NP0100000000001H"
    checkNoSequenceConditions(aho)
    expect(aho.Exceptions).toHaveLength(1)
    expect(aho.Exceptions[0].code).toBe(ExceptionCode.HO200110)
    expect(aho.Exceptions[0].path).toEqual([
      "AnnotatedHearingOutcome",
      "HearingOutcome",
      "Case",
      "HearingDefendant",
      "ArrestSummonsNumber"
    ])
  })

  it("should add HO200116 exception to asn if too many offences", () => {
    const aho = parseAhoXml(inputMessage) as AnnotatedHearingOutcome
    const MAX_ALLOWABLE_OFFENCES = 100
    const arbitraryOffence = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]
    for (let i = 0; i < MAX_ALLOWABLE_OFFENCES + 1; i++) {
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.push(arbitraryOffence)
    }

    checkNoSequenceConditions(aho)

    expect(aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.length).toBeGreaterThan(
      MAX_ALLOWABLE_OFFENCES
    )
    expect(aho.Exceptions).toHaveLength(1)
    expect(aho.Exceptions[0].code).toBe(ExceptionCode.HO200116)
    expect(aho.Exceptions[0].path).toEqual([
      "AnnotatedHearingOutcome",
      "HearingOutcome",
      "Case",
      "HearingDefendant",
      "ArrestSummonsNumber"
    ])
  })

  it("should add HO200117 exception to offenceReason if too many recordable results on the offence", () => {
    const aho = parseAhoXml(inputMessage) as AnnotatedHearingOutcome
    const MAX_ALLOWABLE_RESULTS = 10
    const dummyResult = { PNCDisposalType: 1111 } as Result
    for (let i = 0; i < MAX_ALLOWABLE_RESULTS + 1; i++) {
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].Result.push(dummyResult)
    }

    checkNoSequenceConditions(aho)

    expect(aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].Result.length).toBeGreaterThan(
      MAX_ALLOWABLE_RESULTS
    )
    expect(aho.Exceptions).toHaveLength(1)
    expect(aho.Exceptions[0].code).toBe(ExceptionCode.HO200117)
    expect(aho.Exceptions[0].path).toEqual([
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

    checkNoSequenceConditions(aho)

    expect(aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].Result.length).toBeGreaterThan(
      MAX_ALLOWABLE_RESULTS
    )
    expect(aho.Exceptions).toHaveLength(1)
    expect(aho.Exceptions[0].code).toBe(ExceptionCode.HO200117)
    expect(aho.Exceptions[0].path).toEqual([
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
