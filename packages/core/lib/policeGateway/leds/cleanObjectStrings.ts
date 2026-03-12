//prettier-ignore
const ACCENTED_CHARACTERS_TO_PRESERVE = new Set([
            "Á", "á", "À", "à", "Â", "â", "Ä", "ä",
            "É", "é", "È", "è", "Ê", "ê", "Ë", "ë",
            "Í", "í", "Ì", "ì", "Î", "î", "Ï", "ï",
            "Ó", "ó", "Ò", "ò", "Ô", "ô", "Ö", "ö",
            "Ú", "ú", "Ù", "ù", "Û", "û", "Ü", "ü",
            "Ẃ", "ẃ", "Ẁ", "ẁ", "Ŵ", "ŵ", "Ẅ", "ẅ",
            "Ý", "ý", "Ỳ", "ỳ", "Ŷ", "ŷ", "Ÿ", "ÿ"])

const NON_ASCII_OR_CONTROLS_PATTERN = /[^\x20-\x7E]|[\r\n\t]/gu
const DIACRITIC_PATTERN = /[\u0300-\u036f]/g
const WHITESPACE_CONTROLS = "\r\n\t"

const cleanString = (text: string): string => {
  if (!text) {
    return ""
  }

  return text.replace(NON_ASCII_OR_CONTROLS_PATTERN, (char: string) => {
    if (WHITESPACE_CONTROLS.includes(char)) {
      return " "
    }

    if (ACCENTED_CHARACTERS_TO_PRESERVE.has(char)) {
      return char.normalize("NFD").replace(DIACRITIC_PATTERN, "")
    }

    if (char === "£") {
      return "#"
    }

    return "?"
  })
}

const cleanObjectStrings = <T>(data: T): T => {
  if (typeof data === "string") {
    return cleanString(data) as unknown as T
  }

  if (Array.isArray(data)) {
    return data.map((item) => cleanObjectStrings(item)) as unknown as T
  }

  if (typeof data === "object" && data !== null) {
    const sanitizedObj = {} as Record<string, unknown>
    for (const [key, value] of Object.entries(data)) {
      sanitizedObj[key] = cleanObjectStrings(value)
    }

    return sanitizedObj as T
  }

  return data
}

export default cleanObjectStrings
