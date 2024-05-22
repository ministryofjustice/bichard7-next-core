const untilFurtherOrderDisposalText = (resultVariableText: string): string => {
  const pattern = "UNTIL FURTHER ORDER"
  return resultVariableText.includes(pattern) ? pattern : ""
}

export default untilFurtherOrderDisposalText
