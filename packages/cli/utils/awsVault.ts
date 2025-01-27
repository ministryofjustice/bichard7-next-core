import { spawn, type StdioPipe, type StdioPipeNamed } from "child_process"
import { bold, green } from "cli-color"

interface ExecOptions {
  awsProfile: string
  command: string
  logExecution?: boolean
  stdio?: StdioPipeNamed | StdioPipe[]
}

export default {
  async exec({ awsProfile, command, logExecution = false, stdio = undefined }: ExecOptions) {
    const components = ["aws-vault", "exec", awsProfile, "--", ...command.split(" ")]
    const vaultExec = `aws-vault exec ${awsProfile}`

    if (logExecution) {
      console.log(`\nExecuting command:\n${bold(components.join(" "))}\n`)
    }

    return new Promise<string>((resolve, reject) => {
      const process = spawn(`${vaultExec} -- ${command}`, [], { stdio, shell: true })

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
          if (logExecution) {
            console.log(green(`Command completed successfully.`))
          }

          resolve(output.trim())
        }
      })
    })
  }
}
