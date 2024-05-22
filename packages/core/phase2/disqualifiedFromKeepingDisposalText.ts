import type { Result } from "../types/AnnotatedHearingOutcome"

const disqualifiedFromKeepingDisposalText = (result: Result, resultVariableText: string): string => {
  addMissingDurationsFromResultVariableText(result, resultVariableText)
  return disqualificationPeriodDisposalTextBuilder(resultVariableText)
}

const disqualificationPeriodDisposalTextBuilder = (resultVariableText: string): string => {
  const containsDisqualificationClause = resultVariableText.includes("DISQUALIFIED FROM KEEPING")

  if (containsDisqualificationClause) {
    const regex1 = /DISQUALIFIED FROM KEEPING(.*?)FOR LIFE/gs
    const regex2 = /DISQUALIFIED FROM KEEPING(.*?)FOR A PERIOD OF/gs

    const regexes = [regex1, regex2]

    for (const regex of regexes) {
      const match = regex.exec(resultVariableText)
      if (match) {
        return match[1].trim()
      }
    }
  }
  return ""
}

const addMissingDurationsFromResultVariableText = (_result: Result, _resultVariableText: string) => {
  // DisqualifiedFromKeepingDisposalTextBuilderImpl.java:59-159 - Probably redundant code.
  // TODO: decide whether we can remove this.
  // Old bichard comments: Note that it is considered that all of the code below for the
  // "3025" result code case is almost certainly having no actual
  // functional effect in Bichard7 at the current time
}

export default disqualifiedFromKeepingDisposalText
