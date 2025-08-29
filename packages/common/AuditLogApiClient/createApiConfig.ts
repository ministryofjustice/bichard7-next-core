import jwtServiceGenerator from "../jwtServiceGenerator"
import { isError } from "../types/Result"
import { UserGroup } from "../types/UserGroup"

export type AuditLogApiConfig = {
  apiKey: string
  apiUrl: string
  basePath: string
}

const environmentVariableMustBeSet = "environment variable must be set"

const generateJwt = (): string => {
  if (!process.env.AUTH_JWT_SECRET) {
    throw new Error(`AUTH_JWT_SECRET ${environmentVariableMustBeSet}`)
  }

  const jwt = jwtServiceGenerator(process.env.AUTH_JWT_SECRET, {
    emailAddress: "moj-bichard7@madetech.com",
    groups: [UserGroup.Service],
    username: "audit-log"
  })

  if (isError(jwt)) {
    throw jwt
  }

  return jwt
}

const createApiConfig = (): AuditLogApiConfig => {
  const apiUrl = process.env.AUDIT_LOG_API_URL
  let basePath = "messages"
  let apiKey = process.env.AUDIT_LOG_API_KEY

  if (!apiUrl) {
    throw new Error(`AUDIT_LOG_API_URL ${environmentVariableMustBeSet}`)
  }

  if (process.env.AUDIT_LOG_USE_JWT === "true") {
    if (!process.env.AUDIT_LOG_API_BASE_PATH) {
      throw new Error(`AUDIT_LOG_API_BASE_PATH ${environmentVariableMustBeSet}`)
    }

    basePath = process.env.AUDIT_LOG_API_BASE_PATH
    apiKey = `Bearer ${generateJwt()}`
  }

  if (!apiKey) {
    throw new Error(`AUDIT_LOG_API_KEY ${environmentVariableMustBeSet}`)
  }

  return { apiKey, apiUrl, basePath }
}

export default createApiConfig
