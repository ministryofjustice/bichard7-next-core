import config from "lib/config"

const passwordSecurityCheck = (password: string) => {
  if (password.length < config.passwordMinLength) {
    return new Error("Password must be 8 characters or more.")
  }

  return undefined
}

export default passwordSecurityCheck
