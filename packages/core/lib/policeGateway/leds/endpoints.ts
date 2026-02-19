const endpoints = {
  asnQuery: "person-services/v1/find-disposals-by-asn",
  remand: (personId: string, reportId: string) =>
    `person-services/v1/people/${personId}/arrest-reports/${reportId}/basic-remands`,
  addDisposal: (personId: string, courtCaseId: string) =>
    `person-services/v1/people/${personId}/disposals/${courtCaseId}/court-case-disposal-result`,
  subsequentDisposalResults: (personId: string, courtCaseId: string) =>
    `person-services/v1/people/${personId}/disposals/${courtCaseId}/court-case-subsequent-disposal-results`
}

export default endpoints
