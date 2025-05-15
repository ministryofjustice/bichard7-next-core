import type { JWT } from "@moj-bichard7/common/types/JWT"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"

import { isError } from "@moj-bichard7/common/types/Result"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import jwt from "jsonwebtoken"

import type { DatabaseConnection } from "../../types/DatabaseGateway"

import fetchUserByUsername from "../../services/db/users/fetchUserByUsername"
import { jwtConfig, jwtSignOptions } from "./jwtConfig"

const verifyJwt = async (database: DatabaseConnection, token: string): PromiseResult<User> => {
  const decodedJwt = jwt.verify(token, jwtConfig.tokenSecret, jwtSignOptions) as JWT
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
