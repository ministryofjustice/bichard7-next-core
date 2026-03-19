import isPncNotFoundError from "./isPncNotFoundError"

describe("isPncNotFoundError", () => {
  it.each([
    { message: "I1008 - ARREST/SUMMONS REF 11/0000/00/00000000000B NOT FOUND", expected: true },
    { message: "I1008 ARREST/SUMMONS REF  NOT FOUND", expected: true },
    { message: "I1008 %%%% ARREST/SUMMONS REF  NOT FOUND", expected: true },
    { message: "I1008ARREST/SUMMONS REF  NOT FOUND", expected: true },
    { message: "I1008 - ARREST/SUMMONS REF NOT FOUND", expected: false },
    { message: "i1008 - ArReSt/SuMmOnS rEf 11/0000/00/00000000000B nOt FoUnD", expected: false },
    { message: "", expected: false }
  ])('should return $expected when message is "$message"', ({ expected, message }) => {
    const result = isPncNotFoundError(message)

    expect(result).toBe(expected)
  })
})
