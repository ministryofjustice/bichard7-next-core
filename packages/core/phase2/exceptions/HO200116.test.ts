import HO200116 from "./HO200116"
import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../lib/exceptions/errorPaths"
import generateAhoFromOffenceList from "../tests/fixtures/helpers/generateAhoFromOffenceList"
import type { Offence } from "../../types/AnnotatedHearingOutcome"

describe("HO200116", () => {
  it("returns HO200116 exception when offences exceed 100", () => {
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

  it("doesn't return any exceptions when offences are 100", () => {
    const offences = new Array(100).fill({}) as Offence[]
    const aho = generateAhoFromOffenceList(offences)

    const exceptions = HO200116(aho)

    expect(exceptions).toHaveLength(0)
  })

  it("doesn't return any exceptions when offences are less than 100", () => {
    const offences = new Array(99).fill({}) as Offence[]
    const aho = generateAhoFromOffenceList(offences)

    const exceptions = HO200116(aho)

    expect(exceptions).toHaveLength(0)
  })
})
