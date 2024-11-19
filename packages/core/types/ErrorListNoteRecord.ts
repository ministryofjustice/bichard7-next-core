type ErrorListNoteRecord = {
  create_ts: Date
  error_id: number
  note_id?: number
  note_text: string
  user_id: string
}

export default ErrorListNoteRecord
