import crypto from "crypto"

export const hashFile = (fileContent: Buffer): string => {
  const hashSum = crypto.createHash("sha256")
  hashSum.update(fileContent)
  return hashSum.digest("hex").substring(0, 16)
}
