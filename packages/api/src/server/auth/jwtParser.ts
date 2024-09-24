import { type JWT } from "@moj-bichard7/common/types/JWT"

export default async (token?: string): Promise<JWT | undefined> => {
  if (token === undefined || token === "") {
    return
  }

  const base64Decode = Buffer.from(token, "base64")
  const jwt: JWT = JSON.parse(base64Decode.toString())

  return jwt
}
