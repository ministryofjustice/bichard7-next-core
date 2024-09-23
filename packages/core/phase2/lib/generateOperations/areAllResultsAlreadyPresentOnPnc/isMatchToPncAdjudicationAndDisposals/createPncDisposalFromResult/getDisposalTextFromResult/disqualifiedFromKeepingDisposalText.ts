const disqualifiedFromKeepingDisposalText = (resultVariableText: string): string => {
  const match = new RegExp(
    /DISQUALIFIED FROM KEEPING(?<life>.*?)FOR LIFE|DISQUALIFIED FROM KEEPING(?<period>.*?)FOR A PERIOD OF/gs
  ).exec(resultVariableText)?.groups

  return (match?.life || match?.period)?.trim() || ""
}

export default disqualifiedFromKeepingDisposalText
