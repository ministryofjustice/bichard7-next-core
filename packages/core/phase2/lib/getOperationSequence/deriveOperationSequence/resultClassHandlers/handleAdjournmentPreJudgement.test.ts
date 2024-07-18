jest.mock("../../../addRemandOperation")
import type { Operation } from "../../../../../types/PncUpdateDataset";
import addRemandOperation from "../../../addRemandOperation";
import type { ResultClassHandlerParams } from "../deriveOperationSequence";
import { handleAdjournmentPreJudgement } from "./handleAdjournmentPreJudgement";
(addRemandOperation as jest.Mock).mockImplementation(() => {})

const generateParams = (overrides: Partial<ResultClassHandlerParams> = {}) =>
  ({
    aho: { Exceptions: [] },
    result: {},
    offence: {},
    offenceIndex: 1,
    resultIndex: 1,
    adjudicationExists: false,
    operations: new Set<Operation>(),
    ccrId: "123",
    remandCcrs: new Set<string>(),
    adjPreJudgementRemandCcrs: new Set<string | undefined>(),
    ...overrides
  }) as unknown as ResultClassHandlerParams

describe("handleAdjournmentPreJudgement", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("should generate exception HO200100 when adjudication exists", () => {
    const params = generateParams({ adjudicationExists: true })

    const exception = handleAdjournmentPreJudgement(params)

    expect(exception).toStrictEqual({
      code: "HO200100",
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
    })
    expect(addRemandOperation).toHaveBeenCalledTimes(0)
    expect([...params.remandCcrs]).toHaveLength(0)
    expect([...params.adjPreJudgementRemandCcrs]).toHaveLength(0)
  })

  it("should call addRemandOperation, add ccrId to adjPreJudgementRemandCcrs and remandCcrs when adjudication does not exist and ccrId has value", () => {
    const params = generateParams({ adjudicationExists: false, ccrId: "123" })

    const exception = handleAdjournmentPreJudgement(params)

    expect(exception).toBeUndefined()
    expect(addRemandOperation).toHaveBeenCalledTimes(1)
    expect([...params.remandCcrs]).toStrictEqual(["123"])
    expect([...params.adjPreJudgementRemandCcrs]).toStrictEqual(["123"])
  })

  it("should call addRemandOperation, add ccrId to adjPreJudgementRemandCcrs when adjudication does not exist and ccrId does not value", () => {
    const params = generateParams({ adjudicationExists: false, ccrId: undefined })

    const exception = handleAdjournmentPreJudgement(params)

    expect(exception).toBeUndefined()
    expect(addRemandOperation).toHaveBeenCalledTimes(1)
    expect([...params.remandCcrs]).toHaveLength(0)
    expect([...params.adjPreJudgementRemandCcrs]).toStrictEqual([undefined])
  })
})
