import type { User } from "@moj-bichard7/common/types/User"
import { randomUUID } from "crypto"
import jwt from "jsonwebtoken"

// Same config as UserService
const jwtConfig = {
  tokenExpiresIn: "10 minutes",
  tokenIssuer: "Bichard",
  tokenSecret: "OliverTwist"
}

export const generateTestJwtToken = (user: User, jwd_id?: string): string => {
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

export const generateTestJwtTokenAndSplit = (user: User, jwd_id?: string): string => {
  return generateTestJwtToken(user, jwd_id).split(".")[1]
}
