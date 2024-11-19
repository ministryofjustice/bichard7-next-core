interface Attachment {
  content: string
  filename: string
}

export default interface EmailContent {
  attachments?: Attachment[]
  html?: string
  subject: string
  text: string
}
