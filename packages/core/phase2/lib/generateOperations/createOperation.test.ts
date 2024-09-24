import { PncOperation } from "../../../types/PncOperation"
import createOperation from "./createOperation"

describe("createOperation", () => {
  it("should return an operation with status NotAttempted", () => {
    const operation = createOperation(PncOperation.APPEALS_UPDATE, { courtCaseReference: "123" })

    expect(operation).toStrictEqual({
      code: PncOperation.APPEALS_UPDATE,
      data: {
        courtCaseReference: "123"
      },
      status: "NotAttempted"
    })
  })
})
