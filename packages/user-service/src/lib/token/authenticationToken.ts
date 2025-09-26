import jwt from "jsonwebtoken"
import { Result } from "types/Result"
import Database from "types/Database"
import PromiseResult from "types/PromiseResult"
import config from "../config"
import UserGroup from "../../types/UserGroup"
import UserAuthBichard from "types/UserAuthBichard"

const signOptions: jwt.SignOptions = { issuer: config.tokenIssuer }
const verifyOptions: jwt.VerifyOptions = { issuer: config.tokenIssuer }

export type AuthenticationToken = string

export interface AuthenticationTokenPayload {
  username: string
  exclusionList: string[]
  inclusionList: string[]
  emailAddress: string
  groups: UserGroup[]
  id: string
}

export function generateAuthenticationToken(user: Partial<UserAuthBichard>, uniqueId: string): AuthenticationToken {
  const options: jwt.SignOptions = {
    expiresIn: config.tokenExpiresIn,
    ...signOptions
  }

  const payload: AuthenticationTokenPayload = {
    username: user.username as string,
    exclusionList: user.exclusionList as string[],
    inclusionList: user.inclusionList as string[],
    emailAddress: user.emailAddress as string,
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    groups: user.groups as UserGroup[],
    id: uniqueId
  }

  return jwt.sign(payload, config.tokenSecret, options)
}

export function decodeAuthenticationToken(token: string): Result<AuthenticationTokenPayload> {
  try {
    return jwt.verify(token, config.tokenSecret, verifyOptions) as AuthenticationTokenPayload
  } catch (error) {
    return error as Error
  }
}

export async function isTokenIdValid(connection: Database, uniqueId: string): PromiseResult<boolean> {
  const query = `
    SELECT COUNT(1)
    FROM br7own.users
    WHERE jwt_id = $\{uniqueId\};
  `

  try {
    const { count } = await connection.one(query, { uniqueId })
    return count && count > 0
  } catch (error) {
    return error as Error
  }
}

export async function removeTokenId(connection: Database, uniqueId: string): PromiseResult<void> {
  const removeTokenIdQuery = `
    UPDATE br7own.users
    SET
      jwt_id = NULL,
      jwt_generated_at = NULL
    WHERE jwt_id = $\{uniqueId\};
  `

  try {
    await connection.none(removeTokenIdQuery, { uniqueId })
    return undefined
  } catch (error) {
    return error as Error
  }
}

export async function storeTokenId(connection: Database, userId: number, uniqueId: string): PromiseResult<void> {
  const storeTokenIdQuery = `
    UPDATE br7own.users
    SET
      jwt_id = $\{id\},
      jwt_generated_at = NOW()
    WHERE
      id = $\{user_id\}
  `

  try {
    await connection.none(storeTokenIdQuery, { id: uniqueId, user_id: userId })
    return undefined
  } catch (error) {
    return error as Error
  }
}
