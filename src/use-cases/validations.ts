import nextData from "@moj-bichard7-developers/bichard7-next-data"
import ASN from "src/lib/asn"

const validateRemandStatus = (data: string): boolean => nextData.remandStatus.some((el) => el.cjsCode === data)

const validateASN = (data: string): boolean => {
  const asn = new ASN(data)
  return !!data.match(/[0-9]{2}[A-Z0-9]{6,7}[0-9]{11}[A-HJ-NP-RT-Z]{1}/) && asn.checkCharacter() === data.slice(-1)
}

export { validateRemandStatus, validateASN }
