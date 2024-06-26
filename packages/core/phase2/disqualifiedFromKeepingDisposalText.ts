const disqualifiedFromKeepingDisposalText = (resultVariableText: string): string => {
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

export default disqualifiedFromKeepingDisposalText
