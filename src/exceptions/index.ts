/* eslint-disable @typescript-eslint/no-var-requires */
import { ExceptionCode } from "src/types/ExceptionCode"
import type { ExceptionGenerator } from "src/types/ExceptionGenerator"
import type { KeyValue } from "src/types/KeyValue"

const exceptionCodes = [
  ExceptionCode.HO100206,
  ExceptionCode.HO100300,
  ExceptionCode.HO100305,
  ExceptionCode.HO100321,
  ExceptionCode.HO100322,
  ExceptionCode.HO100324,
  ExceptionCode.HO100325,
  ExceptionCode.HO100326,
  ExceptionCode.HO100507
]

const modules = exceptionCodes.reduce((acc: KeyValue<ExceptionGenerator>, code) => {
  acc[code] = require(`./${code}`).default
  return acc
}, {})

export default modules
