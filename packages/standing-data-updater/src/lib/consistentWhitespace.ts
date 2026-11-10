const multipleSpacesRegex = /\s\s+/g

export const consistentWhitespace = (originalString: string | undefined) =>
  originalString ? originalString.replace(multipleSpacesRegex, " ").trim() : ""
