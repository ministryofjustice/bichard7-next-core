const exclusionOrderDisposalText = (resultVariableText: string): string => {
  const match = new RegExp(
    /THE DEFENDANT IS NOT TO ENTER(?<firstMatch>.*?)THE DEFENDANT IS TO BE|THE DEFENDANT IS NOT TO ENTER(?<secondMatch>.*)/gs
  ).exec(resultVariableText)?.groups

  const matchValue = match?.firstMatch?.trim() || match?.secondMatch?.trim()
  return matchValue ? `EXCLUDED FROM ${matchValue}` : ""
}

export default exclusionOrderDisposalText
