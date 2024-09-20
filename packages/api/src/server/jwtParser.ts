import type { FastifyReply, FastifyRequest } from "fastify"
import { UNAUTHORIZED } from "http-status"

export type JWT = {
  username: string
  exclusionList: string[]
  inclusionList: string[]
  emailAddress: string
  groups: string[]
  id: string
  iat: number // Epoch
  exp: number // Epoch
  iss: string
}

export default async (req: FastifyRequest, res: FastifyReply): Promise<JWT> => {
  const headers = req.headers

  const encodedJwt = (headers["x-jwt"] || headers["X-JWT"]) as string

  if (encodedJwt === undefined || encodedJwt === "") {
    return res.code(UNAUTHORIZED).send()
  }

  const base64Decode = Buffer.from(encodedJwt, "base64")
  const jwt: JWT = JSON.parse(base64Decode.toString())

  return jwt
}
