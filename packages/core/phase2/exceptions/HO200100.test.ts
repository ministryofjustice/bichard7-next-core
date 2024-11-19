import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

import type { Offence } from "../../types/AnnotatedHearingOutcome"

import errorPaths from "../../lib/exceptions/errorPaths"
import ResultClass from "../../types/ResultClass"
import generateAhoFromOffenceList from "../tests/fixtures/helpers/generateAhoFromOffenceList"
import HO200100 from "./HO200100"

describe("HO200100", () => {
  it("returns a HO200100 exception when PNC adjudication exists, offence and result are recordable, and ResultClass is ADJOURNMENT_PRE_JUDGEMENT", () => {
    const aho = generateAhoFromOffenceList([
      {
        Result: [
          {
            PNCAdjudicationExists: true,
            PNCDisposalType: 9999,
            ResultClass: ResultClass.ADJOURNMENT_PRE_JUDGEMENT
          }
        ]
      }
    ] as unknown as Offence[])

    const exceptions = HO200100(aho)

    expect(exceptions).toStrictEqual([
      {
        code: ExceptionCode.HO200100,
        path: errorPaths.offence(0).result(0).resultClass
      }
    ])
  })

  it("returns no exceptions when result class is not adjournment pre judgement", () => {
    const aho = generateAhoFromOffenceList([
      {
        Result: [
          {
            PNCAdjudicationExists: true,
            PNCDisposalType: 9999,
            ResultClass: ResultClass.SENTENCE
          }
        ]
      }
    ] as Offence[])

    const exceptions = HO200100(aho)

    expect(exceptions).toStrictEqual([])
  })

  it("returns no exceptions when PNC adjudication does not exist", () => {
    const aho = generateAhoFromOffenceList([
      {
        Result: [
          {
            PNCAdjudicationExists: false,
            PNCDisposalType: 9999,
            ResultClass: ResultClass.SENTENCE
          }
        ]
      }
    ] as Offence[])

    const exceptions = HO200100(aho)

    expect(exceptions).toStrictEqual([])
  })
})
