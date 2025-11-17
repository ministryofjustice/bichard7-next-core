const endpoints = {
  asnQuery: "/find-disposals-by-asn",
  remand: (personId: string, reportId: string) => `/people/${personId}/arrest-reports/${reportId}/basic-remands`,
  addDisposal: (personId: string, courtCaseId: string) =>
    `/people/${personId}/disposals/${courtCaseId}/court-case-disposal-result`,
  subsequentDisposalResults: (personId: string, courtCaseId: string) =>
    `/people/${personId}/disposals/${courtCaseId}/court-case-subsequent-disposal-results`
}

export default endpoints
