import { PNCMessageType } from "../../../../types/operationCodes"
import createOperation from "./createOperation"

describe("createOperation", () => {
  it("should return an operation with status NotAttempted", () => {
    const operation = createOperation(PNCMessageType.APPEALS_UPDATE, { courtCaseReference: "123" })

    expect(operation).toStrictEqual({
      code: PNCMessageType.APPEALS_UPDATE,
      data: {
        courtCaseReference: "123"
      },
      status: "NotAttempted"
    })
  })
})
