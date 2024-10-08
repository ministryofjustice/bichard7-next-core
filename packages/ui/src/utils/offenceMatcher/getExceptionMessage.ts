import type ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import type { DisplayFullCourtCase } from "types/display/CourtCases"
import { findExceptions } from "types/ErrorMessages"
import getExceptionDefinition from "utils/getExceptionDefinition"
import offenceMatchingExceptions from "./offenceMatchingExceptions"

type ExceptionCodeAndPath = {
  code: ExceptionCode
  path: (string | number)[]
}

const findExceptionByOffenceNumber = (courtCase: DisplayFullCourtCase, offenceIndex: number): ExceptionCodeAndPath[] =>
  courtCase.aho.Exceptions?.filter((exception) => exception.path.includes(offenceIndex))

const getExceptionMessage = (courtCase: DisplayFullCourtCase, offenceIndex: number): string | undefined => {
  const exceptionByOffenceNumber: ExceptionCodeAndPath[] = findExceptionByOffenceNumber(courtCase, offenceIndex)

  if (exceptionByOffenceNumber === undefined) {
    return undefined
  }

  if (courtCase.errorStatus === "Resolved") {
    return undefined
  }

  return (
    findExceptions(
      courtCase,
      exceptionByOffenceNumber.length > 0 ? exceptionByOffenceNumber : courtCase.aho.Exceptions,
      ...offenceMatchingExceptions.noOffencesMatched
    ) || getExceptionDefinition(exceptionByOffenceNumber[0]?.code)?.shortDescription
  )
}

export default getExceptionMessage
