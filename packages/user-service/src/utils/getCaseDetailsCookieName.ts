import crypto from "crypto"

const hashString = (stringToHash: string, outputBytesLength = 8) =>
  crypto.createHash("shake256", { outputLength: outputBytesLength }).update(stringToHash).digest("hex")

export const getCaseDetailsCookieName = (username?: string): string | undefined => {
  if (username) {
    return `qs_case_details_${hashString(username)}`
  }
}
