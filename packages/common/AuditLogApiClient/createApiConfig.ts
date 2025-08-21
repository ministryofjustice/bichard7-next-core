import jwtServiceGenerator from "../jwtServiceGenerator"
import { isError } from "../types/Result"
import { UserGroup } from "../types/UserGroup"

export type AuditLogApiConfig = {
  apiKey: string
  apiUrl: string
  basePath: string
}

const createApiConfig = (): AuditLogApiConfig => {
  const apiUrl = process.env.AUDIT_LOG_API_URL
  const basePath = process.env.AUDIT_LOG_API_BASE_PATH ?? "messages"
  let apiKey = process.env.AUDIT_LOG_API_KEY

  if (process.env.AUDIT_LOG_API_KEY === "jwt" && process.env.AUTH_JWT_SECRET) {
    const jwt = jwtServiceGenerator(process.env.AUTH_JWT_SECRET, {
      emailAddress: "moj-bichard7@madetech.com",
      groups: [UserGroup.Service],
      username: "audit-log"
    })

    if (isError(jwt)) {
      throw jwt
    }

    apiKey = `Bearer ${jwt}`
  }

  if (!apiUrl || !apiKey) {
    throw new Error("AUDIT_LOG_API_URL and AUDIT_LOG_API_KEY environment variables must be set")
  }

  return { apiKey, apiUrl, basePath }
}

export default createApiConfig
