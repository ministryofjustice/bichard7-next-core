import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import errorPaths from "../../lib/exceptions/errorPaths"
import type { Offence } from "../../types/AnnotatedHearingOutcome"
import generateAhoFromOffenceList from "../tests/fixtures/helpers/generateAhoFromOffenceList"
import HO200116 from "./HO200116"

describe("HO200116", () => {
  it("returns HO200116 exception when there are more than 100 offences", () => {
    const offences = new Array(101).fill({}) as Offence[]
    const aho = generateAhoFromOffenceList(offences)

    const exceptions = HO200116(aho)

    expect(exceptions).toStrictEqual([
      {
        code: ExceptionCode.HO200116,
        path: errorPaths.case.asn
      }
    ])
  })

  it("doesn't return any exceptions when there are 100 offences", () => {
    const offences = new Array(100).fill({}) as Offence[]
    const aho = generateAhoFromOffenceList(offences)

    const exceptions = HO200116(aho)

    expect(exceptions).toHaveLength(0)
  })

  it("doesn't return any exceptions when there are less than 100 offences", () => {
    const offences = new Array(99).fill({}) as Offence[]
    const aho = generateAhoFromOffenceList(offences)

    const exceptions = HO200116(aho)

    expect(exceptions).toHaveLength(0)
  })
})
