import axios from "axios"
import { randomUUID } from "crypto"

type ConstructorOptions = {
  apiUrl: string
  apiKey: string
}

export type AuditLogEvent = {
  eventType: string
  timestamp: string
}

export type AuditLog = {
  events: AuditLogEvent[]
}

class AuditLogApiHelper {
  apiUrl: string
  apiKey: string

  constructor(options: ConstructorOptions) {
    this.apiUrl = options.apiUrl
    this.apiKey = options.apiKey
  }

  async getMessageByExternalCorrelationId(externalCorrelationId: string): Promise<AuditLog | undefined> {
    const response = await axios.get(`${this.apiUrl}/messages?externalCorrelationId=${externalCorrelationId}`, {
      headers: { "X-API-Key": this.apiKey },
      validateStatus: undefined
    })

    return response.data && response.data.length > 0 ? response.data[0] : undefined
  }

  createAuditLogMessage(correlationId: string) {
    return axios.post(
      `${this.apiUrl}/messages`,
      {
        caseId: "Case ID",
        createdBy: "Create audit log test",
        externalCorrelationId: correlationId,
        externalId: randomUUID(),
        isSanitised: 0,
        messageHash: randomUUID(),
        messageId: correlationId,
        nextSanitiseCheck: new Date().toISOString(),
        receivedDate: new Date().toISOString(),
        s3Path: "2022/01/18/09/01/message.xml",
        stepExecutionId: randomUUID(),
        systemId: "System"
      },
      {
        headers: {
          "X-Api-Key": this.apiKey
        }
      }
    )
  }
}

export default AuditLogApiHelper
