type ErrorListTriggerRecord = {
  create_ts: Date
  error_id: number
  resolved_by?: null | string
  resolved_ts?: Date | null
  status: number
  trigger_code: string
  trigger_id?: number
  trigger_item_identity?: null | string
}

export default ErrorListTriggerRecord
