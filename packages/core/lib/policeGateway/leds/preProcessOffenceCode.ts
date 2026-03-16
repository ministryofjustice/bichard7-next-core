type OffenceCodeAndRoleQualifier = {
  offenceCode: string
  roleQualifier: string | undefined
}

export const roleQualifiersMap: Record<string, string> = {
  A: "AT",
  B: "AA",
  C: "C",
  I: "I"
}

const preProcessOffenceCode = (cjsOffenceCode: string): OffenceCodeAndRoleQualifier => {
  const offenceCode = cjsOffenceCode.substring(0, 7)
  const roleQualifier = roleQualifiersMap[cjsOffenceCode.slice(7)]

  return {
    offenceCode,
    roleQualifier
  }
}

export default preProcessOffenceCode
