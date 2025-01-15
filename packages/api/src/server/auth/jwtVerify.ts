import type { JWT } from "@moj-bichard7/common/types/JWT"
import type { FullUserRow } from "@moj-bichard7/common/types/User"

import jwt from "jsonwebtoken"

import type DataStoreGateway from "../../services/gateways/interfaces/dataStoreGateway"

import { jwtConfig, jwtSignOptions } from "./jwtConfig"

export default async (db: DataStoreGateway, token: string): Promise<FullUserRow | undefined> => {
  const decodedJwt = jwt.verify(token, jwtConfig.tokenSecret, jwtSignOptions) as JWT
  const user = await db.fetchUserByUsername(decodedJwt.username)

  if (decodedJwt.id === user.jwt_id) {
    return user
  }
}
