const ASN_MIN_VALID_LENGTH = 10
/** The index into the ASN field that contains the unique number fields */
const ASN_NN_INDEX = 8

const convertAsnToLongFormat = (shortAsn: string) => {
  // Remove all slashes and capitalise
  const shortAsnNoSlashes = shortAsn.replace(/\//g, "").toUpperCase()

  const shortFormatLength = shortAsnNoSlashes.length
  if (shortFormatLength >= ASN_MIN_VALID_LENGTH) {
    const idString = shortAsnNoSlashes.substring(ASN_NN_INDEX, shortFormatLength - 1)
    if (!idString.match(/^\d+$/)) {
      return shortAsnNoSlashes
    }

    const id = Number(idString).toString()
    if (id !== "NaN") {
      const header = shortAsnNoSlashes.substring(0, ASN_NN_INDEX)
      const footer = shortAsnNoSlashes.substring(shortFormatLength - 1)
      return `${header}${id.padStart(11, "0")}${footer}`
    }
  }

  return shortAsnNoSlashes
}

export default convertAsnToLongFormat
