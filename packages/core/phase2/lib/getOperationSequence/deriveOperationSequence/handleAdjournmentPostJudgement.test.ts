jest.mock("../../addRemandOperation")
import type { Offence } from "../../../../types/AnnotatedHearingOutcome"
import type { Operation } from "../../../../types/PncUpdateDataset"
import addRemandOperation from "../../addRemandOperation"
import type { ResultClassHandlerParams } from "./deriveOperationSequence"
import { handleAdjournmentPostJudgement } from "./handleAdjournmentPostJudgement"
;(addRemandOperation as jest.Mock).mockImplementation(() => {})

const generateParams = (overrides: Partial<ResultClassHandlerParams> = {}) =>
  ({
    aho: { Exceptions: [] },
    result: {},
    resultIndex: 1,
    offenceIndex: 1,
    offence: { AddedByTheCourt: false },
    adjudicationExists: false,
    operations: new Set<Operation>(),
    ccrId: "123",
    remandCcrs: new Set<string>(),
    ...overrides
  }) as unknown as ResultClassHandlerParams

describe("handleAdjournmentPostJudgement", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("should call addRemandOperation and add the ccrId to remandCcrs when adjudication exists and ccrId has value", () => {
    const params = generateParams({ adjudicationExists: true, ccrId: "123" })

    handleAdjournmentPostJudgement(params)

    expect(params.aho.Exceptions).toHaveLength(0)
    expect(addRemandOperation).toHaveBeenCalledTimes(1)
    expect([...params.remandCcrs]).toEqual(["123"])
  })

  it("should call addRemandOperation and should not add the ccrId to remandCcrs when adjudication exists and ccrId does not have value", () => {
    const params = generateParams({ adjudicationExists: true, ccrId: undefined })

    handleAdjournmentPostJudgement(params)

    expect(params.aho.Exceptions).toHaveLength(0)
    expect(addRemandOperation).toHaveBeenCalledTimes(1)
    expect([...params.remandCcrs]).toHaveLength(0)
  })

  it("should generate exception HO200103 when adjudication does not exists and result is not added by court", () => {
    const params = generateParams({
      adjudicationExists: false,
      offence: { AddedByTheCourt: false } as Offence,
      offenceIndex: 1
    })

    handleAdjournmentPostJudgement(params)

    expect(params.aho.Exceptions).toStrictEqual([
      {
        code: "HO200103",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          1,
          "Result",
          1,
          "ResultClass"
        ]
      }
    ])
    expect(addRemandOperation).toHaveBeenCalledTimes(0)
    expect([...params.remandCcrs]).toHaveLength(0)
  })

  it("should not generate exception HO200103 when adjudication does not exists and result is added by court", () => {
    const params = generateParams({
      adjudicationExists: false,
      offence: { AddedByTheCourt: true } as Offence,
      offenceIndex: 1
    })

    handleAdjournmentPostJudgement(params)

    expect(params.aho.Exceptions).toHaveLength(0)
    expect(addRemandOperation).toHaveBeenCalledTimes(0)
    expect([...params.remandCcrs]).toHaveLength(0)
  })
})
