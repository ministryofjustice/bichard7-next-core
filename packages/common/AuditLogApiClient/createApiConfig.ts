import type { AuditLogApiConfig } from "../types/AuditLogApiConfig"

import { createJwt } from "./createJwt"

const environmentVariableMustBeSet = "environment variable must be set"

const createApiConfig = (): AuditLogApiConfig => {
  const apiUrl = process.env.AUDIT_LOG_API_URL
  let basePath: string | undefined
  let apiKey: string | undefined

  if (!apiUrl) {
    throw new Error(`AUDIT_LOG_API_URL ${environmentVariableMustBeSet}`)
  }

  if (process.env.AUDIT_LOG_USE_JWT === "true") {
    const jwtDetails = createJwt(environmentVariableMustBeSet)

    basePath = jwtDetails.basePath
    apiKey = jwtDetails.apiKey
  } else {
    basePath = "messages"
    apiKey = process.env.AUDIT_LOG_API_KEY
  }

  if (!apiKey) {
    throw new Error(`AUDIT_LOG_API_KEY ${environmentVariableMustBeSet}`)
  }

  return { apiKey, apiUrl, basePath }
}

export default createApiConfig
