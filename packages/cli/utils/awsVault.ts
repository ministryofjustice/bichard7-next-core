import { spawn } from "child_process"
import { bold, green } from "cli-color"

export default {
  async exec(profile: string, command: string, log: boolean = false) {
    const vaultExec = `aws-vault exec ${profile}`

    if (log) {
      console.log(`\nExecuting command:\n${bold(vaultExec + " -- " + command)}\n`)
    }

    spawn(`${vaultExec} -- ${command}`, [], { stdio: "inherit", shell: true })
      .on("error", (err) => {
        console.error(`Failed to start command: ${err.message}`)
      })
      .on("exit", (code) => {
        if (code !== 0) {
          console.error(`Command exited with code: ${code}`)
        } else {
          console.log(green(`Command completed successfully.`))
        }
      })
  }
}
