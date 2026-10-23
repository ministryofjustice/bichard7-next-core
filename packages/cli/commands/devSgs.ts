import { spawn } from "child_process"
import { Command, Option } from "commander"
import path from "path"

export function devSgs(): Command {
  const command = new Command("dev-sgs")

  command.addOption(new Option("--with-leds-access", "Allow access to the LEDS API"))
  command.description("Apply dev security groups to our environments").action(({ withLedsAccess }) => {
    const scriptPath = path.resolve(__dirname, "../../../../scripts/dev-sgs.sh")
    const bashArgs = [scriptPath]
    if (withLedsAccess) {
      bashArgs.push("--with-leds-access")
    }

    const child = spawn("/bin/bash", bashArgs, {
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
