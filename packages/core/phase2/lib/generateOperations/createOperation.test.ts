import { PncOperation } from "../../../types/PncOperation"
import createOperation from "./createOperation"

describe("createOperation", () => {
  it("returns a not attempted operation", () => {
    const operation = createOperation(PncOperation.PENALTY_HEARING, { courtCaseReference: "123" })

    expect(operation).toStrictEqual({
      code: PncOperation.PENALTY_HEARING,
      data: {
        courtCaseReference: "123"
      },
      status: "NotAttempted"
    })
  })
})
