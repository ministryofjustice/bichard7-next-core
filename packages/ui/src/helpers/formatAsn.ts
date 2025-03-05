// Usage: formatAsnWithDivider('123456789A') => '12/3456/78/9A'

const formatAsnWithDivider = (asn: string | undefined): string | undefined => {
  if (!asn) {
    return undefined
  }

  const year = asn.slice(0, 2)
  const divisionalId = asn.slice(2, 6)
  const owningForce = asn.slice(6, 8)
  const checkLetter = asn.slice(-1)
  const digits = asn.slice(8, -1)

  return `${year}/${divisionalId}/${owningForce}/${digits}${checkLetter}`
}

export default formatAsnWithDivider
