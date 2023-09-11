interface Attachment {
  filename: string
  content: string
}

export default interface EmailContent {
  subject: string
  text: string
  attachments?: Attachment[]
  html?: string
}
