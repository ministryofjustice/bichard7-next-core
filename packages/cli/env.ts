import type { Command } from "commander"
import { env, type Environment } from "./config"

let environment: Environment

// uses the options passed to the CLI to set the current environment
export function setEnvironment(
  cli: Command,
  options: { e2e?: boolean; uat?: boolean; preprod?: boolean; prod?: boolean; shared?: boolean }
): Environment {
  const environments = Object.entries(options).filter(([_, specified]) => specified)
  if (!environments.length) {
    console.error("Specify an environment [--e2e, --uat, --preprod, --prod]")
    process.exit(1)
  }

  if (environments.length > 1) {
    cli.error("Specify a single environment.")
  }

  const [[chosenEnvironment]] = environments
  environment = env[chosenEnvironment.toUpperCase() as keyof typeof env]
  return environment
}

export function getEnvironment() {
  return environment
}
