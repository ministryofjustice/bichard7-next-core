import { ExceptionCode } from "../types/ExceptionCode"
import incompatibleOperationExceptionCode from "./incompatibleOperationExceptionCode"

describe("check incompatibleOperationExceptionCode", () => {
  it("SENDEF and NEWREM exception code is HO200113", () => {
    const incompatibleOperations = ["NEWREM", "SENDEF"]
    const result = incompatibleOperationExceptionCode(incompatibleOperations)

    expect(result).toEqual(ExceptionCode.HO200113)
  })

  it("PENHRG and NEWREM do not generate an exception code", () => {
    const incompatibleOperations = ["NEWREM", "PENHRG"]
    const result = incompatibleOperationExceptionCode(incompatibleOperations)

    expect(result).toBeUndefined()
  })

  it("COMSEN and NEWREM exception code is HO200113", () => {
    const incompatibleOperations = ["NEWREM", "COMSEN"]
    const result = incompatibleOperationExceptionCode(incompatibleOperations)

    expect(result).toEqual(ExceptionCode.HO200113)
  })

  it("NEWREM and APPHRD exception code is HO200109", () => {
    const incompatibleOperations = ["NEWREM", "APPHRD"]
    const result = incompatibleOperationExceptionCode(incompatibleOperations)

    expect(result).toEqual(ExceptionCode.HO200109)
  })

  it("SENDEF and SENDEF exception code is HO200109", () => {
    const incompatibleOperations = ["SENDEF", "SENDEF"]
    const result = incompatibleOperationExceptionCode(incompatibleOperations)

    expect(result).toEqual(ExceptionCode.HO200109)
  })

  it("SENDEF and COMSEN exception code is HO200109", () => {
    const incompatibleOperations = ["SENDEF", "COMSEN"]
    const result = incompatibleOperationExceptionCode(incompatibleOperations)

    expect(result).toEqual(ExceptionCode.HO200109)
  })

  it("SENDEF and PENHRG exception code is HO200114", () => {
    const incompatibleOperations = ["SENDEF", "PENHRG"]
    const result = incompatibleOperationExceptionCode(incompatibleOperations)

    expect(result).toEqual(ExceptionCode.HO200114)
  })

  it("SENDEF and DISARR exception code is HO200112", () => {
    const incompatibleOperations = ["SENDEF", "DISARR"]
    const result = incompatibleOperationExceptionCode(incompatibleOperations)

    expect(result).toEqual(ExceptionCode.HO200112)
  })

  it("COMSEN and DISARR exception code is HO200112", () => {
    const incompatibleOperations = ["COMSEN", "DISARR"]
    const result = incompatibleOperationExceptionCode(incompatibleOperations)

    expect(result).toEqual(ExceptionCode.HO200112)
  })

  it("APPHRD exception code is HO200109", () => {
    const incompatibleOperations = ["APPHRD", "DISARR"]
    const result = incompatibleOperationExceptionCode(incompatibleOperations)

    expect(result).toEqual(ExceptionCode.HO200109)
  })

  it("DISARR and SUBVAR exception code is HO200115", () => {
    const incompatibleOperations = ["SUBVAR", "DISARR"]
    const result = incompatibleOperationExceptionCode(incompatibleOperations)

    expect(result).toEqual(ExceptionCode.HO200115)
  })

  it("SUBVAR and PENHRG exception code is HO200109", () => {
    const incompatibleOperations = ["SUBVAR", "PENHRG"]
    const result = incompatibleOperationExceptionCode(incompatibleOperations)

    expect(result).toEqual(ExceptionCode.HO200109)
  })

  it("does not raise an exception if operations are compatible", () => {
    expect(incompatibleOperationExceptionCode(["NEWREM", "DISARR"])).toBeFalsy()
  })
})
