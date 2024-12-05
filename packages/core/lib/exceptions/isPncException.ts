import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

const pncErrors = [
  ExceptionCode.HO100301,
  ExceptionCode.HO100302,
  ExceptionCode.HO100313,
  ExceptionCode.HO100314,
  ExceptionCode.HO100315,
  ExceptionCode.HO100401,
  ExceptionCode.HO100402,
  ExceptionCode.HO100403,
  ExceptionCode.HO100404
]

const isPncException = (code: ExceptionCode): boolean => pncErrors.includes(code)

export default isPncException
