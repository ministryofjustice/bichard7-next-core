/* eslint-disable @typescript-eslint/no-var-requires */
import { ExceptionCode } from "src/types/ExceptionCode"
import type { ExceptionGenerator } from "src/types/ExceptionGenerator"
import type { KeyValue } from "../types/KeyValue"

const exceptionCodes = [ExceptionCode.HO100322]

const modules = exceptionCodes.reduce((acc: KeyValue<ExceptionGenerator>, code) => {
  acc[code] = require(`./${code}`).default
  return acc
}, {})

export default modules
