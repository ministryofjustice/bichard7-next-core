export const ApiEndpoints = {
  CaseDetails: "CaseDetails",
  CaseList: "CaseList",
  CaseResubmit: "CaseResubmit"
} as const

export type ApiEndpointValue = (typeof ApiEndpoints)[keyof typeof ApiEndpoints]
