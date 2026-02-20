export type CasesToAuditByUser = {
  cases: { audited: boolean; id: number }[]
  username: string
}
