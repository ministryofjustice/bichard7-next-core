const ASN_MIN_VALID_LENGTH = 10
/** The index into the ASN field that contains the unique number fields */
const ASN_NN_INDEX = 8

const convertASNToLongFormat = (shortASN: string) => {
  // Remove all slashes and capitalise
  const shortASNNoSlashes = shortASN.replace(/\//g, "").toUpperCase()

  const shortFormatLength = shortASNNoSlashes.length
  if (shortFormatLength >= ASN_MIN_VALID_LENGTH) {
    const id = parseInt(
      shortASNNoSlashes.substring(ASN_NN_INDEX, shortFormatLength - 1).replace(/[^\d]/g, ""),
      10
    ).toString()
    if (id !== "NaN") {
      const header = shortASNNoSlashes.substring(0, ASN_NN_INDEX)
      const footer = shortASNNoSlashes.substring(shortFormatLength - 1)
      return `${header}${id.padStart(11, "0")}${footer}`
    }
  }
  return shortASNNoSlashes
}

export default convertASNToLongFormat
