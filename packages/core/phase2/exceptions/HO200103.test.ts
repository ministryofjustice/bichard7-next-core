import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

import type { Offence } from "../../types/AnnotatedHearingOutcome"

import errorPaths from "../../lib/exceptions/errorPaths"
import ResultClass from "../../types/ResultClass"
import generateAhoFromOffenceList from "../tests/fixtures/helpers/generateAhoFromOffenceList"
import HO200103 from "./HO200103"

describe("HO200103", () => {
  it("returns a HO200103 exception when PNC adjudication does not exist, offence is not added by the court, and ResultClass is ADJOURNMENT_POST_JUDGEMENT", () => {
    const aho = generateAhoFromOffenceList([
      {
        AddedByTheCourt: false,
        Result: [
          {
            PNCAdjudicationExists: false,
            ResultClass: ResultClass.ADJOURNMENT_POST_JUDGEMENT,
            PNCDisposalType: 9999
          }
        ]
      }
    ] as Offence[])

    const exceptions = HO200103(aho)

    expect(exceptions).toStrictEqual([
      {
        code: ExceptionCode.HO200103,
        path: errorPaths.offence(0).result(0).resultClass
      }
    ])
  })

  it("returns no exceptions when PNC adjudication exists", () => {
    const aho = generateAhoFromOffenceList([
      {
        AddedByTheCourt: false,
        Result: [
          {
            PNCAdjudicationExists: true,
            ResultClass: ResultClass.ADJOURNMENT_POST_JUDGEMENT,
            PNCDisposalType: 9999
          }
        ]
      }
    ] as Offence[])

    const exceptions = HO200103(aho)

    expect(exceptions).toStrictEqual([])
  })

  it("returns no exceptions when result class is not adjournment post judgement", () => {
    const aho = generateAhoFromOffenceList([
      {
        AddedByTheCourt: false,
        Result: [
          {
            PNCAdjudicationExists: false,
            ResultClass: ResultClass.SENTENCE,
            PNCDisposalType: 9999
          }
        ]
      }
    ] as Offence[])

    const exceptions = HO200103(aho)

    expect(exceptions).toStrictEqual([])
  })

  it("returns no exceptions when the offence is added by the court", () => {
    const aho = generateAhoFromOffenceList([
      {
        AddedByTheCourt: true,
        Result: [
          {
            PNCAdjudicationExists: false,
            ResultClass: ResultClass.ADJOURNMENT_POST_JUDGEMENT,
            PNCDisposalType: 9999
          }
        ]
      }
    ] as Offence[])

    const exceptions = HO200103(aho)

    expect(exceptions).toStrictEqual([])
  })
})
