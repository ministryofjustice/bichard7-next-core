import { spawn } from "child_process"
import { Command } from "commander"
import path from "path"

export function importVpn(): Command {
  const command = new Command("import-vpn-profiles")

  command.description("Import VPN profiles into OpenVPN").action(() => {
    const scriptPath = path.resolve(__dirname, "../../../../scripts/import-openvpn-profiles.sh")
    const scriptDir = path.dirname(scriptPath)

    const child = spawn("bash", [scriptPath], {
      stdio: "inherit", // Allow input/output to flow through the terminal
      shell: true, // Use the shell for better compatibility
      cwd: scriptDir
    })

    child.on("close", (code) => {
      if (code !== 0) {
        console.error(`Script exited with code ${code}`)
      }
    })
  })

  return command
}
