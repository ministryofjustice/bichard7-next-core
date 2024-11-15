const lineLength = 50

const addPaddingToBailCondition = (bailCondition: string): string => {
  const patternToMatchLine = new RegExp(`\\s*(.{1,${lineLength}})\\s+`, "gm")
  const lines = Array.from(bailCondition.concat(" ").matchAll(patternToMatchLine), (match) => match[1].trim())

  return lines
    .map((line, index) => {
      const padding = index < lines.length - 1 ? " ".repeat(lineLength - line.length) : ""
      return line + padding
    })
    .join("")
}

export default addPaddingToBailCondition
