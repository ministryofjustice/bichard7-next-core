import jwt from "jsonwebtoken"

import type { JWTServiceDetails } from "../types/JWTServiceDetails"

import { UserGroup } from "../types/UserGroup"

const jwtSignOptions: jwt.SignOptions = {
  expiresIn: 600_000, // 10 minutes
  issuer: process.env.TOKEN_ISSUER ?? "Bichard"
}

export const newJwt = (tokenSecret: string, serviceDetails: JWTServiceDetails): Error | string => {
  if (!serviceDetails.groups.includes(UserGroup.Service)) {
    return new Error("Could not create Service JWT")
  }

  return jwt.sign(serviceDetails, tokenSecret, jwtSignOptions)
}
