export const javaMapToJson = (str: string) => {
  const cleanStr = str.replace("{", "").replace("}", "")

  const pairs = cleanStr.split(", ")

  const result: Record<string, string> = {}

  pairs.forEach((pair: string) => {
    const separatorIndex = pair.indexOf("=")
    if (separatorIndex !== -1) {
      const key = pair.substring(0, separatorIndex)
      result[key] = pair.substring(separatorIndex + 1)
    }
  })

  return result
}
