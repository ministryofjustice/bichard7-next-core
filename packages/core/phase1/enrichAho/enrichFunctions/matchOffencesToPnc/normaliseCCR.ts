export const normaliseCCR = (ccr: string): string => {
  const splitCCR = ccr.split("/")
  if (splitCCR.length !== 3) {
    return ccr
  }
  splitCCR[2] = splitCCR[2].replace(/^0+/, "")
  return splitCCR.map((el) => el.toUpperCase()).join("/")
}
