import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import type { Exception } from "types/exceptions"

const getNumberOfIneditableOffenceExceptions = (exceptions: Exception[]): number => {
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

  return exceptions.filter(({ code }) => !editableOffenceExceptions.includes(code)).length
}

export default getNumberOfIneditableOffenceExceptions
