import { spawn } from "child_process"
import { Command } from "commander"
import path from "path"

export function devSgs(): Command {
  const command = new Command("dev-sgs")

  command.description("Apply dev security groups to out environments").action(() => {
    const scriptPath = path.resolve(__dirname, "../../../../scripts/dev-sgs.sh")

    const child = spawn("bash", [scriptPath], {
      stdio: "inherit", // Allow input/output to flow through the terminal
      shell: true // Use the shell for better compatibility
    })

    child.on("close", (code) => {
      if (code !== 0) {
        console.error(`Script exited with code ${code}`)
      }
    })
  })

  return command
}
