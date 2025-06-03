import type { User } from "@moj-bichard7/common/types/User"

import { randomUUID } from "crypto"
import jwt from "jsonwebtoken"

import { jwtConfig, jwtSignOptions } from "../../server/auth/jwtConfig"

export const generateTestJwtToken = (user: Partial<User>, jwtId?: string): string => {
  const payload = {
    emailAddress: user.email ? user.email : undefined,
    exclusionList: [],
    groups: user.groups ? user.groups : [],
    id: jwtId ?? randomUUID(),
    inclusionList: [],
    username: user.username
  }

  return jwt.sign(payload, jwtConfig.tokenSecret, jwtSignOptions)
}
