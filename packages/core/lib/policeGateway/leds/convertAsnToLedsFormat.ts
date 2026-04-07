import Asn from "../../Asn"

const convertAsnToLedsFormat = (asn: string): string => {
  const rawAsn = asn.replace(/\//g, "")
  return new Asn(rawAsn).toPncFormat()
}

export default convertAsnToLedsFormat
