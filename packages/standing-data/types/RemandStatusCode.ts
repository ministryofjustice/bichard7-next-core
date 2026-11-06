export enum RemandStatusCode {
  CONDITIONAL_BAIL = "CB",
  CARE = "LA",
  NOT_APPLICABLE = "NA",
  CUSTODY_PB = "PB",
  CUSTODY_PR = "PR",
  SECURE_CARE = "SA",
  UNCONDITIONAL_BAIL = "UB"
}

export const RemandStatuses: Record<RemandStatusCode, string> = {
  [RemandStatusCode.CONDITIONAL_BAIL]: "conditional bail",
  [RemandStatusCode.CARE]: "care",
  [RemandStatusCode.NOT_APPLICABLE]: "not appliciable",
  [RemandStatusCode.CUSTODY_PB]: "custody",
  [RemandStatusCode.CUSTODY_PR]: "custody",
  [RemandStatusCode.SECURE_CARE]: "secure care",
  [RemandStatusCode.UNCONDITIONAL_BAIL]: "unconditional bail"
}
