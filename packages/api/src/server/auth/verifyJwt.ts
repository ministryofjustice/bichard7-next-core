import type { JWT } from "@moj-bichard7/common/types/JWT"
import type { PromiseResult, Result } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"
import type { JwtPayload } from "jsonwebtoken"

import { isError } from "@moj-bichard7/common/types/Result"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import jwt from "jsonwebtoken"

import type { DatabaseConnection } from "../../types/DatabaseGateway"

import fetchUserByUsername from "../../services/db/users/fetchUserByUsername"
import { jwtConfig, jwtVerifyOptions } from "./jwtConfig"

const verifyToken = (jwtToken: string) =>
  new Promise<Result<JWT>>((resolve) => {
    try {
      resolve(jwt.verify(jwtToken, jwtConfig.tokenSecret, jwtVerifyOptions) as JwtPayload as JWT)
    } catch (error) {
      resolve(error as Error)
    }
  })

const verifyJwt = async (database: DatabaseConnection, token: string): PromiseResult<User> => {
  const decodedJwt = await verifyToken(token)
  if (isError(decodedJwt)) {
    return decodedJwt
  }

  if (decodedJwt.groups.includes(UserGroup.Service)) {
    return { email: "none", username: "service.user" } as User
  }

  const user = await fetchUserByUsername(database, decodedJwt.username)

  if (isError(user)) {
    return Error(`JWT verification failed: ${user.message}`)
  }

  if (decodedJwt.id === user.jwtId) {
    return user
  }

  return Error("JWT verification failed: JWT ids do not match")
}

export default verifyJwt
