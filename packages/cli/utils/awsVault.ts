import { spawn } from "child_process"
import { bold, green } from "cli-color"

interface ExecOptions {
  awsProfile: string
  command: string
  logExecution?: boolean
  streamOutput?: boolean
}

export default {
  exec({ awsProfile, command, logExecution = false, streamOutput = false }: ExecOptions) {
    const components = ["aws-vault", "exec", awsProfile, "--", ...command.split(" ")]
    const vaultExec = `aws-vault exec ${awsProfile}`

    if (logExecution) {
      console.log(`\nExecuting command:\n${bold(components.join(" "))}\n`)
    }

    return new Promise<string>((resolve, reject) => {
      const process = spawn(`${vaultExec} -- ${command}`, [], { shell: true })
      let output = ""
      let error = ""

      process.stdout?.on("data", (data) => {
        if (streamOutput) {
          console.log(data.toString())
        }

        output += data.toString()
      })
      process.stderr?.on("data", (data) => {
        error += data.toString()
      })
      process.on("error", (err) => {
        reject(err)
      })
      process.on("close", (code) => {
        if (code !== 0) {
          console.error(`Command exited with code: ${code}`)
          reject(new Error(error))
        } else {
          if (logExecution) {
            console.log(green("Command completed successfully."))
          }

          resolve(output.trim())
        }
      })
    })
  }
}
