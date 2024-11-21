import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import type { Exception } from "types/exceptions"

const getNumberOfIneditableOffenceExceptions = (exceptions: Exception[]): number => {
  const ineditableOffenceExceptions = [
    ExceptionCode.HO100103,
    ExceptionCode.HO100105,
    ExceptionCode.HO100108,
    ExceptionCode.HO100219,
    ExceptionCode.HO100224,
    ExceptionCode.HO100225,
    ExceptionCode.HO100226,
    ExceptionCode.HO100227,
    ExceptionCode.HO100228,
    ExceptionCode.HO100232,
    ExceptionCode.HO100233,
    ExceptionCode.HO100234,
    ExceptionCode.HO100235,
    ExceptionCode.HO100236,
    ExceptionCode.HO100237,
    ExceptionCode.HO100238,
    ExceptionCode.HO100240,
    ExceptionCode.HO100241,
    ExceptionCode.HO100242,
    ExceptionCode.HO100243,
    ExceptionCode.HO100244,
    ExceptionCode.HO100246,
    ExceptionCode.HO100248,
    ExceptionCode.HO100250,
    ExceptionCode.HO100251,
    ExceptionCode.HO100305,
    ExceptionCode.HO100306,
    ExceptionCode.HO100307,
    ExceptionCode.HO100324,
    ExceptionCode.HO100325,
    ExceptionCode.HO100326,
    ExceptionCode.HO100327,
    ExceptionCode.HO100330,
    ExceptionCode.HO100333,
    ExceptionCode.HO200100,
    ExceptionCode.HO200101,
    ExceptionCode.HO200103,
    ExceptionCode.HO200104,
    ExceptionCode.HO200106,
    ExceptionCode.HO200107,
    ExceptionCode.HO200108,
    ExceptionCode.HO200111,
    ExceptionCode.HO200117,
    ExceptionCode.HO200120,
    ExceptionCode.HO200122,
    ExceptionCode.HO200123,
    ExceptionCode.HO200124,
    ExceptionCode.HO200201,
    ExceptionCode.HO200205,
    ExceptionCode.HO200212
  ]

  return exceptions.filter(({ code }) => ineditableOffenceExceptions.includes(code)).length
}

const getNumberOfEditableOffenceExceptions = (exceptions: Exception[]): number => {
  const editableOffenceExceptions = [
    ExceptionCode.HO100102,
    ExceptionCode.HO100323,
    ExceptionCode.HO100200,
    ExceptionCode.HO100300,
    ExceptionCode.HO100322,
    ExceptionCode.HO100245,
    ExceptionCode.HO200200,
    ExceptionCode.HO100247,
    ExceptionCode.HO100309,
    ExceptionCode.HO200202,
    ExceptionCode.HO100239,
    ExceptionCode.HO100310,
    ExceptionCode.HO100311,
    ExceptionCode.HO100312,
    ExceptionCode.HO100320,
    ExceptionCode.HO100332
  ]

  return exceptions.filter(({ code }) => editableOffenceExceptions.includes(code)).length
}

export { getNumberOfEditableOffenceExceptions, getNumberOfIneditableOffenceExceptions }
