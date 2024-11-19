type ErrorListTriggerRecord = {
  trigger_id?: number
  error_id: number
  trigger_code: string
  trigger_item_identity?: string | null
  status: number
  create_ts: Date
  resolved_by?: string | null
  resolved_ts?: Date | null
}

export default ErrorListTriggerRecord
