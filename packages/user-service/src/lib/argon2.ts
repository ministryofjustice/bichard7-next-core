import type { HashOptions } from "argon2"
import { argon2id, hash, verify } from "argon2"
import logger from "utils/logger"
import config from "./config"

const hashPassword = (plainPassword: string, options: HashOptions = {}): Promise<string | null> => {
  const {
    argon2: { parallelism, timeCost, memoryCost, hashLength }
  } = config

  const defaultOptions: HashOptions = {
    parallelism,
    timeCost,
    memoryCost,
    hashLength,
    type: argon2id
  }

  const hashOptions = { ...defaultOptions, ...options } as HashOptions & { raw?: false }

  return hash(plainPassword, hashOptions).catch((error) => {
    logger.error(error)
    return null
  })
}

const verifyPassword = (plainPassword: string, passwordHash: string): Promise<boolean> => {
  return verify(passwordHash, plainPassword).catch((error) => {
    logger.error(error)
    return false
  })
}

export { hashPassword, verifyPassword }
