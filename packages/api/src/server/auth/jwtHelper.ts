import type { User } from "@moj-bichard7/common/types/User"
import { randomUUID } from "crypto"
import jwt from "jsonwebtoken"

// Same config as UserService
const jwtConfig = {
  tokenExpiresIn: "10 minutes",
  tokenIssuer: "Bichard",
  tokenSecret: "OliverTwist"
}

// Test helper function
export function generateTestJwtToken(user: User, jwd_id?: string) {
  const options: jwt.SignOptions = {
    expiresIn: jwtConfig.tokenExpiresIn,
    issuer: jwtConfig.tokenIssuer
  }

  const payload = {
    username: user.username,
    exclusionList: [],
    inclusionList: [],
    emailAddress: [],
    groups: [],
    id: jwd_id ?? randomUUID()
  }

  return jwt.sign(payload, jwtConfig.tokenSecret, options)
}
