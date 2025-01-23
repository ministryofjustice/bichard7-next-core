import { spawn } from "child_process"
import { bold } from "cli-color"
import { Command } from "commander"
import { getEnvironment } from "../../env"

export function disable(): Command {
  const command = new Command("disable").description("Disables the EventBridge rule")

  command.action(async () => {
    const {
      aws: { profile, name }
    } = getEnvironment()
    const vaultExec = `aws-vault exec ${profile}`
    const disableRule = `aws events disable-rule --name ${name}-trigger-from-external-incoming-messages`

    console.log(`Executing command: ${bold(disableRule)}`)
    spawn(`${vaultExec} -- ${disableRule}`, [], { stdio: "inherit", shell: true })
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
