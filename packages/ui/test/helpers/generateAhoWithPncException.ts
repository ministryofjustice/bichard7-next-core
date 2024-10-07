import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import fs from "fs"

export type GenerateAhoWithPncExceptionParams = {
  pncExceptionCode: ExceptionCode.HO100302 | ExceptionCode.HO100314 | ExceptionCode.HO100402 | ExceptionCode.HO100404
  pncExceptionMessage?: string
  ho100108?: boolean
  ho100332?: boolean
}

const ho100332Content = '<ds:OffenceReasonSequence Error="HO100332"/>'
const ho100108Content = 'Error="HO100108"'

const generateAhoWithPncException = ({
  pncExceptionCode,
  pncExceptionMessage = "",
  ho100108,
  ho100332
}: GenerateAhoWithPncExceptionParams) => {
  const ahoXml = fs.readFileSync("test/test-data/PncException.xml").toString()
  return ahoXml
    .replace(/\{PNC_EXCEPTION_CODE\}/g, pncExceptionCode.toString())
    .replace(/\{PNC_EXCEPTION_MESSAGE\}/g, pncExceptionMessage)
    .replace(/\{EXCEPTION_HO100332\}/g, ho100332 ? ho100332Content : "")
    .replace(/\{EXCEPTION_HO100108\}/g, ho100108 ? ho100108Content : "")
}

export default generateAhoWithPncException
