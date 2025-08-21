import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

import addExceptionsToAho from "./addExceptionsToAho"

describe("addExceptionsToAho", () => {
  it("adds exceptions to a hearing outcome", () => {
    const exceptions = [
      {
        code: ExceptionCode.HO100100,
        path: ["path", "to", "exception"]
      },
      {
        code: ExceptionCode.HO100102,
        path: ["another", "path", "to", "exception"]
      }
    ]
    const aho = { Exceptions: [] } as unknown as AnnotatedHearingOutcome

    addExceptionsToAho(aho, exceptions)

    expect(aho.Exceptions).toHaveLength(2)
    expect(aho.Exceptions).toEqual(exceptions)
  })

  it("overwrites an existing exception if one already exists in that path", () => {
    const exceptionOne = {
      code: ExceptionCode.HO100100,
      path: ["path", "to", "exception"]
    }
    const aho = { Exceptions: [exceptionOne] } as unknown as AnnotatedHearingOutcome
    const exceptionTwo = {
      code: ExceptionCode.HO100200,
      path: ["path", "to", "exception"]
    }
    const exceptions = [exceptionTwo]

    addExceptionsToAho(aho, exceptions)

    expect(aho.Exceptions).toHaveLength(1)
    expect(aho.Exceptions[0]).toStrictEqual(exceptionTwo)
  })

  it("doesn't remove an existing PNC exception when the new exception is not a PNC exception", () => {
    const pncException = {
      code: ExceptionCode.HO100301,
      path: ["path", "to", "exception"]
    }
    const aho = { Exceptions: [pncException] } as unknown as AnnotatedHearingOutcome
    const nonPncException = {
      code: ExceptionCode.HO100100,
      path: ["path", "to", "exception"]
    }
    const exceptions = [nonPncException]

    addExceptionsToAho(aho, exceptions)

    expect(aho.Exceptions).toHaveLength(2)
    expect(aho.Exceptions).toStrictEqual([pncException, nonPncException])
  })

  it("doesn't remove an existing non-PNC exception when the new exception is a PNC exception", () => {
    const nonPncException = {
      code: ExceptionCode.HO100100,
      path: ["path", "to", "exception"]
    }
    const aho = { Exceptions: [nonPncException] } as unknown as AnnotatedHearingOutcome
    const pncException = {
      code: ExceptionCode.HO100301,
      path: ["path", "to", "exception"]
    }
    const exceptions = [pncException]

    addExceptionsToAho(aho, exceptions)

    expect(aho.Exceptions).toHaveLength(2)
    expect(aho.Exceptions).toStrictEqual([nonPncException, pncException])
  })
})
