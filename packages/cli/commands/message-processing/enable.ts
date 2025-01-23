import { spawn } from "child_process"
import { bold } from "cli-color"
import { Command } from "commander"
import { getEnvironment } from "../../env"

export function enable(): Command {
  const command = new Command("enable").description("Enables the EventBridge rule")

  command.action(async () => {
    const {
      aws: { profile, name }
    } = getEnvironment()
    const vaultExec = `aws-vault exec ${profile}`
    const enableRule = `aws events enable-rule --name ${name}-trigger-from-external-incoming-messages`

    console.log(`Executing command: ${bold(enableRule)}`)
    spawn(`${vaultExec} -- ${enableRule}`, [], { stdio: "inherit", shell: true })
      .on("error", (err) => {
        console.error(`Failed to start command: ${err.message}`)
      })
      .on("exit", (code) => {
        if (code !== 0) {
          console.error(`Command exited with code: ${code}`)
        } else {
          console.log(`Command completed successfully.`)
        }
      })
  })

  return command
}
