import type { JWT } from "@moj-bichard7/common/types/JWT"
import type { User } from "@moj-bichard7/common/types/User"

import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import jwt from "jsonwebtoken"

import type DataStoreGateway from "../../services/gateways/interfaces/dataStoreGateway"

import { jwtConfig, jwtSignOptions } from "./jwtConfig"

export default async (db: DataStoreGateway, token: string): Promise<undefined | User> => {
  const decodedJwt = jwt.verify(token, jwtConfig.tokenSecret, jwtSignOptions) as JWT
  if (decodedJwt.groups.includes(UserGroup.Service)) {
    return { email: "none", username: "service.user" } as User
  }

  const user = await db.fetchUserByUsername(decodedJwt.username)

  if (decodedJwt.id === user.jwt_id) {
    return user
  }
}
