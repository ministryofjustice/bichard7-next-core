import { spawn } from "child_process"
import { bold, green } from "cli-color"

export default {
  async exec(profile: string, command: string, log: boolean = false) {
    const vaultExec = `aws-vault exec ${profile}`

    if (log) {
      console.log(`\nExecuting command:\n${bold(vaultExec + " -- " + command)}\n`)
    }

    return new Promise((resolve, reject) => {
      const process = spawn(`${vaultExec} -- ${command}`, [], { stdio: "inherit", shell: true })

      let output = ""
      let error = ""

      process.stdout?.on("data", (data: any) => {
        output += data.toString()
      })
      process.stderr?.on("data", (data: any) => {
        error += data.toString()
      })
      process.on("error", (err) => {
        reject(err)
      })
      process.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(`Command exited with code: ${code}`))
        } else {
          if (log) {
            console.log(green(`Command completed successfully.`))
          }

          resolve(output.trim())
        }
      })
    })
  }
}
