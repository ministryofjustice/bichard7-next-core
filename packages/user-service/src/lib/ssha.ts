import crypto from "crypto"
import logger from "utils/logger"

const bufferConcat = (list: Buffer[]) => {
  let bufferLength = 0
  for (let i = 0; i < list.length; i++) {
    const buf = list[i]
    bufferLength += buf.length
  }

  const buffer = Buffer.alloc(bufferLength)
  let position = 0

  for (let i = 0; i < list.length; i++) {
    const buf = list[i]
    buf.copy(buffer, position)
    position += buf.length
  }

  return buffer
}

const createSsha = (secret: string, salt?: Buffer | string): string => {
  let hashSalt: Buffer
  if (!salt) {
    hashSalt = crypto.randomBytes(32)
  } else if (typeof salt === "string") {
    hashSalt = Buffer.from(salt)
  } else {
    hashSalt = salt
  }

  const secretBuffer = Buffer.from(secret)
  const hash = crypto.createHash("sha1")
  hash.update(secretBuffer)
  hash.update(hashSalt)
  const digest = Buffer.from(hash.digest("base64"), "base64")
  const buffer = bufferConcat([digest, hashSalt])

  return `{SSHA}${buffer.toString("base64")}`
}

const verifySsha = (secret: string, sshaHash: string): boolean => {
  if (!sshaHash.match(/^\{SSHA\}/i)) {
    logger.error("Hash scheme not supported. Only {SSHA} is supported.")
    return false
  }

  const trimmedSecret = sshaHash.slice(6)
  const secretBuffer = Buffer.from(trimmedSecret, "base64")
  const saltBuffer = secretBuffer.slice(20)

  return createSsha(secret, saltBuffer) === sshaHash
}

export { createSsha, verifySsha }
