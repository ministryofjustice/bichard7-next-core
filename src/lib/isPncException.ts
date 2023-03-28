import { ExceptionCode } from "../types/ExceptionCode"

const pncErrors = [
  ExceptionCode.HO100301,
  ExceptionCode.HO100302,
  ExceptionCode.HO100313,
  ExceptionCode.HO100314,
  ExceptionCode.HO100315
]

const isPncException = (code: ExceptionCode): boolean => pncErrors.includes(code)

export default isPncException
