import { pncErrorsAnalysisFilePath } from "./common"
import type { PncErrorsResult } from "./index"

type PncErrorDetails = { total: number; errorMessages: Record<string, number> }

const fs = require("fs")

const asnRegex = /[0-9]{2}\/[A-Z0-9]+\/[A-Z0-9]+\/[A-Z0-9]+/g
const courtCaseReferenceRegex = /[0-9]{2}\/[0-9]+[A-Z0-9]+(\/[0-9]{4,6}[A-Z])*/g
const messageRegex = /[0-9]{3}[A-Z]{4}[0-9]{6}[A-Z]/g

const removeSensitiveData = (message?: string) =>
  message
    ?.replace(asnRegex, "X")
    .replace(courtCaseReferenceRegex, "X")
    .replace(messageRegex, "X")
    .replace(/FOR CHARGE \d+/g, "FOR CHARGE X")
    .replace(/PNCID\/\s*CHECKNAME(:)* X [A-Z]+(\s|-*[A-Z]+)*$/g, "PNCID/CHECKNAME: X X")
    .replace(/OFFENCE NUMBER [0-9]{1,3}/g, "X")
    .replace(/&apos;/g, "'")
    .replace(/CHARGE ISN: [0-9]{8}/g, "CHARGE ISN: X")
    .replace(/PNCID: [A-Z0-9]{3}/g, "PNCID: X")
    .replace(/TOO MANY DISPOSALS \( [0-9]{2} \)/g, "TOO MANY DISPOSALS ( X )")
    .replace(/TAC= [0-9]{3,7}/g, "TAC= X")
    .replace(/MN= [0-9]{6}/g, "MN= X")
    .replace(/NID = [0-9]{5,7}/g, "NID = X")
    .replace(/KEY= [A-Z][0-9]{19}/g, "KEY= X")
    .replace(/PM= [0-9]{1,2}/g, "PM= X")
    .replace(/NO= [0-9]{1,2}/g, "NO= X")
    .replace(/LEFT [0-9] OFFENCES UNRESULTED/g, "LEFT X OFFENCES UNRESULTED")
    .replace(/Date\/Time= [0-9]{6}X/g, "Date/Time= X")
    .replace(/Job= [0-9]{6}/g, "Job= X")
    .replace(/Program= [A-Z0-9]{6}/g, "Program= X")
    .replace(/User= [A-Z0-9]{8}/g, "User= X")
    .replace(/Terminal= [A-Z0-9]{8}/g, "Terminal= X")
    .trim() ?? ""

const analysePncErrors = (errorsResult: PncErrorsResult) => {
  const onlyPncErrorCode = process.argv.slice(-1)[0] === "--only-code"
  const { dateRange, total, pncErrors } = errorsResult

  const pncErrorsAnalysis: Record<string, PncErrorDetails> = {}
  const pncRequestTypes = Array.from(new Set(pncErrors.map((pncError) => pncError.pncRequestType)))

  for (const pncRequestType of pncRequestTypes) {
    const pncErrorsForRequestType = pncErrors.filter((pncError) => pncError.pncRequestType === pncRequestType)

    const pncErrorMessagesForRequestType = pncErrorsForRequestType
      .map((pncError) =>
        onlyPncErrorCode ? pncError.pncErrorMessage?.substring(0, 5) : removeSensitiveData(pncError.pncErrorMessage)
      )
      .sort()

    const countedPncErrorMessagesForRequestType = pncErrorMessagesForRequestType.reduce(
      (countedPncErrorMessagesForRequestType, pncErrorMessageForRequestType) => {
        if (countedPncErrorMessagesForRequestType[pncErrorMessageForRequestType]) {
          countedPncErrorMessagesForRequestType[pncErrorMessageForRequestType]++
        } else {
          countedPncErrorMessagesForRequestType[pncErrorMessageForRequestType] = 1
        }
        return countedPncErrorMessagesForRequestType
      },
      {} as Record<string, number>
    )

    const sortedPncErrorMessagesForRequestType = Object.fromEntries(
      Object.entries(countedPncErrorMessagesForRequestType).sort(([, a], [, b]) => b - a)
    )

    pncErrorsAnalysis[pncRequestType] = {
      total: pncErrorsForRequestType.length,
      errorMessages: sortedPncErrorMessagesForRequestType
    }
  }

  const sortedPncErrorsAnalysis = Object.fromEntries(
    Object.entries(pncErrorsAnalysis).sort(([, a], [, b]) => b.total - a.total)
  )

  fs.writeFileSync(
    pncErrorsAnalysisFilePath,
    JSON.stringify(
      {
        dateRange,
        total,
        pncErrors: sortedPncErrorsAnalysis
      },
      null,
      2
    )
  )
}

export default analysePncErrors
