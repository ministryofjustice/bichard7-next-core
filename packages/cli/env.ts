import { Command } from "commander"
import { env, type Environment } from "./config"

let environment: Environment = env.PROD // default to production

// uses the options passed to the CLI to set the current environment
export function setEnvironment(
  cli: Command,
  options: { e2e?: boolean; uat?: boolean; preprod?: boolean; prod?: boolean }
) {
  const environments = Object.entries(options).filter(([_, specified]) => specified)
  if (!environments.length) return

  if (environments.length > 1) {
    cli.error("Specify a single environment.")
  }

  const [[chosenEnvironment]] = environments
  environment = env[chosenEnvironment.toUpperCase() as keyof typeof env]
}

export function getEnvironment() {
  return environment
}
