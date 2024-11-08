import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import errorPaths from "../../lib/exceptions/errorPaths"
import type { Offence } from "../../types/AnnotatedHearingOutcome"
import generateAhoFromOffenceList from "../tests/fixtures/helpers/generateAhoFromOffenceList"
import HO200121 from "./HO200121"

describe("HO200121", () => {
  it("returns a HO200121 exception when there are no recordable offences", () => {
    const aho = generateAhoFromOffenceList([
      {
        OffenceCategory: "B7"
      }
    ] as Offence[])

    const exceptions = HO200121(aho)

    expect(exceptions).toStrictEqual([
      {
        code: ExceptionCode.HO200121,
        path: errorPaths.case.asn
      }
    ])
  })

  it("returns no exceptions when there are recordable offences", () => {
    const aho = generateAhoFromOffenceList([
      {
        CriminalProsecutionReference: {
          OffenceReasonSequence: "001"
        },
        OffenceCategory: "XX"
      }
    ] as Offence[])

    const exceptions = HO200121(aho)

    expect(exceptions).toStrictEqual([])
  })
})
