import type jwt from "jsonwebtoken"
import type { StringValue } from "ms"

export type JWTConfigType = {
  tokenExpiresIn: number | StringValue
  tokenIssuer: string
  tokenSecret: string
}

export const jwtConfig: JWTConfigType = {
  tokenExpiresIn: process.env.TOKEN_EXPIRES_IN ? (process.env.TOKEN_EXPIRES_IN as StringValue) : "10 minutes",
  tokenIssuer: process.env.TOKEN_ISSUER ? process.env.TOKEN_ISSUER : "Bichard",
  tokenSecret: process.env.TOKEN_SECRET ? process.env.TOKEN_SECRET : "OliverTwist"
}

export const jwtSignOptions: jwt.SignOptions = {
  expiresIn: jwtConfig.tokenExpiresIn,
  issuer: jwtConfig.tokenIssuer
}
