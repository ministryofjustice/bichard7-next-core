import type { ExceptionCode } from "./ExceptionCode"

type Exception = {
  code: ExceptionCode
  path: (number | string)[]
}

export default Exception
