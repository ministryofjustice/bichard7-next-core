import type { JWT } from "@moj-bichard7/common/types/JWT"
import type { User } from "@moj-bichard7/common/types/User"
import jwt from "jsonwebtoken"
import type DataStoreGateway from "../../services/gateways/interfaces/dataStoreGateway"
import { jwtConfig, jwtSignOptions } from "./jwtConfig"

export default async (dataStoreGateway: DataStoreGateway, token: string): Promise<User | undefined> => {
  const decodedJwt = jwt.verify(token, jwtConfig.tokenSecret, jwtSignOptions) as JWT
  const user = await dataStoreGateway.fetchUserByUsername(decodedJwt.username)

  if (decodedJwt.id === user.jwt_id) {
    return user
  }
}
