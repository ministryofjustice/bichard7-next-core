const multipleSpacesRegex = /\s\s+/g

export default (originalString: string | undefined) =>
  originalString ? originalString.replace(multipleSpacesRegex, " ").trim() : ""
