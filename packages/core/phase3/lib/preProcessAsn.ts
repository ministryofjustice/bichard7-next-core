import Asn from "../../lib/Asn"

const preProcessAsn = (asn: string) => {
  let twentyCharacterAsn
  if (asn.length === 20) {
    twentyCharacterAsn = asn
  } else if (asn.length === 21) {
    twentyCharacterAsn = asn.substring(0, 2) + asn.substring(3)
  } else {
    // We have checked this in Phase 1 (zod schema). If we get this error something is very wrong.
    return new Error(`Invalid ASN length. Length is ${asn.length}`)
  }

  return new Asn(twentyCharacterAsn).toPncFormat()
}

export default preProcessAsn
