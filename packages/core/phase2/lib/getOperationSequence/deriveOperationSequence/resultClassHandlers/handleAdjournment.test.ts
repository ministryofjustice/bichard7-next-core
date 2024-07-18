jest.mock("../../../addRemandOperation")
import type { Operation } from "../../../../../types/PncUpdateDataset";
import addRemandOperation from "../../../addRemandOperation";
import type { ResultClassHandlerParams } from "../deriveOperationSequence";
import { handleAdjournment } from "./handleAdjournment";
(addRemandOperation as jest.Mock).mockImplementation(() => {})

describe("handleAdjournment", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("should call addRemandOperation and add the ccrId to remandCcrs", () => {
    const params = {
      result: {},
      operations: new Set<Operation>(),
      ccrId: "123",
      remandCcrs: new Set<string>()
    } as unknown as ResultClassHandlerParams

    handleAdjournment(params)

    expect(addRemandOperation).toHaveBeenCalledTimes(1)
    expect([...params.remandCcrs]).toEqual(["123"])
  })

  it("should call addRemandOperation and should not add the ccrId to remandCcrs", () => {
    const params = {
      result: {},
      operations: new Set<Operation>(),
      ccrId: undefined,
      remandCcrs: new Set<string>()
    } as unknown as ResultClassHandlerParams

    handleAdjournment(params)

    expect(addRemandOperation).toHaveBeenCalledTimes(1)
    expect([...params.remandCcrs]).toHaveLength(0)
  })
})
