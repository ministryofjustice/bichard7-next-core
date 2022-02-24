import type { ExceptionCode } from "./ExceptionCode"

type Exception = {
  code: ExceptionCode
  path: string[]
}

export default Exception
