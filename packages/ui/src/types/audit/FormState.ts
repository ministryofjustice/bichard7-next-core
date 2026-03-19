export interface FormState {
  resolvedBy: string[]
  triggers: string[]
  includeTriggers: boolean
  includeExceptions: boolean
  volume: string
  fromDate: Date
  toDate: Date
  auditId?: number
}
