import type { User } from "@moj-bichard7/common/types/User"
import { randomUUID } from "crypto"
import jwt from "jsonwebtoken"
import { jwtConfig, jwtSignOptions } from "../../server/auth/jwtConfig"

export const generateTestJwtToken = (user: User, jwt_id?: string): string => {
  const payload = {
    username: user.username,
    exclusionList: [],
    inclusionList: [],
    emailAddress: user.email ? user.email : undefined,
    groups: user.groups ? user.groups : [],
    id: jwt_id ?? randomUUID()
  }

  return jwt.sign(payload, jwtConfig.tokenSecret, jwtSignOptions)
}
