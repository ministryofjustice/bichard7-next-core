import { bold } from "cli-color"
import { Command } from "commander"
import { checkConnection } from "../utils/checkConnection"
import { watch } from "../utils/watch"

export function status(): Command {
  const command = new Command("status")

  command.description("Get healthcheck endpoint output from production").action(async () => {
    const endpoint = "https://proxy.bichard7.service.justice.gov.uk/bichard-backend/Connectivity"

    let ok = false
    try {
      ok = await checkConnection(endpoint)
    } catch (err) {
      console.error(`Failed to connect to ${bold(endpoint)}\nAre you connected to the VPN?`)
    }
    if (!ok) return

    const command = `curl -s ${endpoint} | jq '.pncConnectionHealth'`
    watch(command)
  })

  return command
}
