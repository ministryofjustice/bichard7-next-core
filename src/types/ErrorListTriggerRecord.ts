type ErrorListTriggerRecord = {
  trigger_id?: number
  error_id: number
  trigger_code: string
  trigger_item_identity?: string
  status: number
  create_ts: Date
  resolved_by?: string
  resolved_ts?: Date
}

export default ErrorListTriggerRecord
