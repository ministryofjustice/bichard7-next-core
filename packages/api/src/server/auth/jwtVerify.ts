import type { JWT } from "@moj-bichard7/common/types/JWT"
import { type User } from "@moj-bichard7/common/types/User"
import type Gateway from "services/gateways/interfaces/gateway"

export default async (gateway: Gateway, jwt: JWT): Promise<User | undefined> => {
  // Nginx auth proxy verifies and validates the JWT
  return await gateway.fetchUserByUsername(jwt["username"])
}
