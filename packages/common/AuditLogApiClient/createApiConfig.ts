export type AuditLogApiConfig = {
  apiKey: string
  apiUrl: string
  basePath: string
}

const createApiConfig = (): AuditLogApiConfig => {
  const apiUrl = process.env.AUDIT_LOG_API_URL
  const basePath = process.env.AUDIT_LOG_API_BASE_PATH ?? "messages"
  const apiKey = process.env.AUDIT_LOG_API_KEY

  if (!apiUrl || !apiKey) {
    throw new Error("AUDIT_LOG_API_URL and AUDIT_LOG_API_KEY environment variables must be set")
  }

  return { apiKey, apiUrl, basePath }
}

export default createApiConfig
