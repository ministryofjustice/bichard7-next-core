const exclusionOrderDisposalText = (resultVariableText: string): string => {
  const regex1 = /THE DEFENDANT IS NOT TO ENTER(.*?)THE DEFENDANT IS TO BE/gs
  const regex2 = /THE DEFENDANT IS NOT TO ENTER(.*)/

  const regexes = [regex1, regex2]

  for (const regex of regexes) {
    const match = regex.exec(resultVariableText)
    if (match) {
      return "EXCLUDED FROM " + match[1].trim()
    }
  }

  return ""
}

export default exclusionOrderDisposalText
