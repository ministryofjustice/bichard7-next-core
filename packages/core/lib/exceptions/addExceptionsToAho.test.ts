import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import addExceptionsToAho from "./addExceptionsToAho"

describe("addExceptionsToAho", () => {
  it("can add exceptions to a hearing outcome", () => {
    const exception = {
      code: ExceptionCode.HO100100,
      path: ["path", "to", "exception"]
    }
    const aho = { Exceptions: [] } as unknown as AnnotatedHearingOutcome
    addExceptionsToAho(aho, exception.code, exception.path)
    expect(aho.Exceptions).toHaveLength(1)
    expect(aho.Exceptions[0]).toStrictEqual(exception)
  })

  it("will overwrite an existing exception if one already exists in that path", () => {
    const exceptionOne = {
      code: ExceptionCode.HO100100,
      path: ["path", "to", "exception"]
    }
    const aho = { Exceptions: [] } as unknown as AnnotatedHearingOutcome
    aho.Exceptions.push(exceptionOne)

    const exceptionTwo = {
      code: ExceptionCode.HO100200,
      path: ["path", "to", "exception"]
    }

    addExceptionsToAho(aho, exceptionTwo.code, exceptionTwo.path)
    expect(aho.Exceptions).toHaveLength(1)
    expect(aho.Exceptions[0]).toStrictEqual(exceptionTwo)
  })
})
