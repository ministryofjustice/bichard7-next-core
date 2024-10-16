import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

const offenceMatchingExceptions = {
  noOffencesMatched: [
    ExceptionCode.HO100203,
    ExceptionCode.HO100228,
    ExceptionCode.HO100304,
    ExceptionCode.HO100311,
    ExceptionCode.HO100312,
    ExceptionCode.HO100320,
    ExceptionCode.HO100329,
    ExceptionCode.HO100328,
    ExceptionCode.HO100333,
    ExceptionCode.HO100507
  ],
  offenceNotMatched: [ExceptionCode.HO100310, ExceptionCode.HO100332]
}

export default offenceMatchingExceptions
