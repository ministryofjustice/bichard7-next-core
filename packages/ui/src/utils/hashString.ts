import crypto from "crypto"

const hashString = (stringToHash: string, outputBytesLength = 8) =>
  crypto.createHash("shake256", { outputLength: outputBytesLength }).update(stringToHash).digest("hex")

export default hashString
