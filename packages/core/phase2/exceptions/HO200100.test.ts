import HO200100 from "./HO200100"
import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../lib/exceptions/errorPaths"
import generateAhoFromOffenceList from "../tests/fixtures/helpers/generateAhoFromOffenceList"
import type { Offence } from "../../types/AnnotatedHearingOutcome"
import ResultClass from "../../types/ResultClass"

describe("HO200106", () => {
  it("returns a HO200100 exception when PNC adjudication exists, offence and result are recordable, and ResultClass is ADJOURNMENT_PRE_JUDGEMENT", () => {
    const aho = generateAhoFromOffenceList([
      {
        Result: [
          {
            PNCAdjudicationExists: true,
            ResultClass: ResultClass.ADJOURNMENT_PRE_JUDGEMENT,
            PNCDisposalType: 9999
          },
          {
            PNCAdjudicationExists: false,
            ResultClass: ResultClass.ADJOURNMENT_PRE_JUDGEMENT,
            PNCDisposalType: 1000
          }
        ]
      },
      {
        Result: [
          {
            PNCAdjudicationExists: false,
            ResultClass: "Adjournment pre Judgement",
            PNCDisposalType: 1001
          },
          {
            PNCAdjudicationExists: true,
            ResultClass: "Adjournment pre Judgement",
            PNCDisposalType: 1001
          }
        ]
      }
    ] as unknown as Offence[])

    const exceptions = HO200100(aho)

    expect(exceptions).toStrictEqual([
      {
        code: ExceptionCode.HO200100,
        path: errorPaths.offence(0).result(0).resultClass
      },
      {
        code: ExceptionCode.HO200100,
        path: errorPaths.offence(1).result(1).resultClass
      }
    ])
  })
})
