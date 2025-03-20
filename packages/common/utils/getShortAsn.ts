const getShortAsn = (asn?: null | string) => {
  if (!asn) {
    return ""
  }

  const asnString = asn.replace(/\//g, "")

  const initialAsnSegment = asnString.slice(0, 8)

  const asnSequence = asnString.slice(8).replace(/^0+/, "")

  const shortenedAsn = `${initialAsnSegment.slice(0, 2)}/${initialAsnSegment.slice(2, 6)}/${initialAsnSegment.slice(6, 8)}/${asnSequence}`

  return shortenedAsn
}

export default getShortAsn
