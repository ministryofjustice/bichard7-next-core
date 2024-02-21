import type { ParsedMail } from "mailparser"
import { testSmtpServer } from "test-smtp-server"

export type Attachment = {
  content: Buffer
  contentType: string
  filename: string
}

export type Email = {
  sender: string
  receivers: Record<string, string>
  data: string
  body: string
  headers: Record<string, string>
  attachments: Attachment[]
}

export default class MockMailServer {
  server: testSmtpServer // eslint-disable-line @typescript-eslint/no-explicit-any

  constructor(smtpPort: number) {
    this.server = new testSmtpServer({ smtpPort })
  }

  start(): void {
    this.server.startServer()
  }

  stop(): void {
    this.server.stopServer()
  }

  clear() {
    this.server.clearEmails()
  }

  getEmail(): Promise<ParsedMail> {
    const [email] = this.server.getEmails()
    return email.getParsed()
  }
}
