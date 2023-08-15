const isCcrValid = (ccr: string): boolean => /^[0-9]{2}\/[0-9]{4}\/[0-9]{1,6}[A-HJ-NP-RT-Z]{1}$/i.test(ccr)

export default isCcrValid
