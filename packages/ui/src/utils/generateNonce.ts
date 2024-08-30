import crypto from "crypto"

const generateNonce = (): string => {
  return crypto.randomBytes(16).toString("base64")
}

export default generateNonce
