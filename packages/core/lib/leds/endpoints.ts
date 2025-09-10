const endpoints = {
  asnQuery: "/find-disposals-by-asn",
  remand: (personId: string, reportId: string) => `/people/${personId}/arrest-reports/${reportId}/basic-remands`,
  addDisposal: (personId: string, disposalId: string) =>
    `/people/${personId}/disposals/${disposalId}/court-case-disposal-result`,
  subsequentDisposalResults: (personId: string, disposalId: string) =>
    `/people/${personId}/disposals/${disposalId}/court-case-subsequent-disposal-results`
}

export default endpoints
