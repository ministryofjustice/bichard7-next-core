import type { AuditLogApiConfig } from "./createApiConfig"

import jwtServiceGenerator from "../jwtServiceGenerator"
import { isError } from "../types/Result"
import { UserGroup } from "../types/UserGroup"

type JwtDetails = Pick<AuditLogApiConfig, "apiKey" | "basePath">

export const createJwt = (errorMessage: string = "env is missing"): JwtDetails => {
  if (!process.env.AUDIT_LOG_API_BASE_PATH) {
    throw new Error(`AUDIT_LOG_API_BASE_PATH ${errorMessage}`)
  }

  if (!process.env.AUTH_JWT_SECRET) {
    throw new Error(`AUTH_JWT_SECRET ${errorMessage}`)
  }

  const jwt = jwtServiceGenerator(process.env.AUTH_JWT_SECRET, {
    emailAddress: "moj-bichard7@madetech.com",
    groups: [UserGroup.Service],
    username: "audit-log"
  })

  if (isError(jwt)) {
    throw jwt
  }

  return {
    apiKey: `Bearer ${jwt}`,
    basePath: process.env.AUDIT_LOG_API_BASE_PATH
  }
}
