import type { Result } from "@moj-bichard7/common/types/Result"

import crypto from "crypto"

const generateX5t = (certificate: string): Result<string> => {
  const derString = certificate
    .replace(/-----BEGIN [A-Z ]+-----/gi, "")
    .replace(/-----END [A-Z ]+-----/gi, "")
    .replace(/\s+/g, "")

  const derBuffer = Buffer.from(derString, "base64")
  if (derBuffer.length === 0) {
    return Error("Failed to generate X5T: The resulting DER buffer is empty.")
  }

  const sha1Hash = crypto.createHash("sha1").update(derBuffer).digest()
  const x5t = sha1Hash.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")

  return x5t
}

export default generateX5t
