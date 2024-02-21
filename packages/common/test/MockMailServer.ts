import mailServer from "smtp-tester"
import waitPort from "wait-port"
import type { PromiseResult } from "../types/Result"

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
  messages: Email[]

  server: any // eslint-disable-line @typescript-eslint/no-explicit-any

  constructor(private port: number) {
    this.server = mailServer.init(port)
  }

  async wait() {
    await waitPort({ host: "localhost", port: this.port, timeout: 5000 })
  }

  stop() {
    this.server.stop()
  }

  async getEmail(emailAddress: string): PromiseResult<Email> {
    try {
      const { email } = await this.server.captureOne(emailAddress, { wait: 1000 })
      return email
    } catch (error) {
      return error as Error
    }
  }
}
