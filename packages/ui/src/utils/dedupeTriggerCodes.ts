import getLongTriggerCode from "services/entities/transformers/getLongTriggerCode"

const isLongCode = (code: string): boolean => code === getLongTriggerCode(code)

const isDupe = (code: string, codes: string[]): boolean => {
  const duplicates = codes.filter((c, i) => codes.indexOf(c) !== i)
  return duplicates.includes(code)
}

const dedupeTriggerCodes = (reasonCodes: string[]): string[] => {
  const codes = Array.from(new Set(reasonCodes.map((reasonCode) => reasonCode.toUpperCase())))
  const longCodes = codes.map((code) => getLongTriggerCode(code) || code)

  const dedupedCodes = codes.reduce<string[]>((filteredCodes, code) => {
    if (isLongCode(code)) {
      if (!isDupe(code, longCodes)) {
        filteredCodes.push(code)
      }
    } else {
      filteredCodes.push(code)
    }

    return filteredCodes
  }, [])

  const sortedCodes = dedupedCodes.sort((current, previous) => {
    const a = current.slice(0, 1) === "P" ? parseInt(current.slice(-2)) : parseInt(current.slice(-4))
    const b = previous.slice(0, 1) === "P" ? parseInt(previous.slice(-2)) : parseInt(previous.slice(-4))

    return a - b
  })

  return sortedCodes
}

export default dedupeTriggerCodes
