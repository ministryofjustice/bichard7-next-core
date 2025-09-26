import config from "lib/config"

const passwordSecurityCheck = (password: string) => {
  if (password.length < config.passwordMinLength) {
    return Error("Password is too short.")
  }

  return undefined
}

export default passwordSecurityCheck
