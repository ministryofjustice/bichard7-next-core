import { exec } from "child_process"
import { bold } from "cli-color"
import { Command } from "commander"

import { getEnvironment } from "../env"
import { checkConnection } from "../utils/checkConnection"
import { watch } from "../utils/watch"

function notify(endpoint: string) {
  const until = `
          until curl -s ${endpoint} | jq '.pncConnectionHealth' | grep -q '"healthy": true'; do
            echo -n '.';
            sleep 5;
          done
        `

  exec(until, (error) => {
    if (error) {
      console.error(`Error during watch: ${error.message}`)
      return
    }

    const notification = `
            osascript -e 'display notification "${new Date().toLocaleTimeString()}" with title "PNC Connection Restored"'
          `

    exec(notification, (err) => {
      if (err) {
        console.error(`osascript failed: ${err.message}`)
      }
    })
  })
}

export function status(): Command {
  const command = new Command("status")
  const { domain } = getEnvironment()

  command
    .description("Get healthcheck endpoint output from production")
    .option("-n, --notify", "Notify the user when the PNC connection has restored")
    .option("-w, --watch", "Watch the healthcheck endpoint")
    .action(async (cmd) => {
      const endpoint = `https://proxy.${domain}/bichard-backend/Connectivity`
      const curlCommand = `curl -s ${endpoint} | jq '.pncConnectionHealth'`

      // bail out if not connected to vpn
      let ok = false
      try {
        ok = await checkConnection(endpoint)
      } catch (err) {
        console.error(`Failed to connect to ${bold(endpoint)}\nAre you connected to the VPN?`)
      }

      if (!ok) {
        return
      }

      // check options
      if (cmd.notify && cmd.watch) {
        cmd.error("Cannot --notify and --watch, pick one")
      } else if (cmd.notify) {
        notify(endpoint)
      } else if (cmd.watch) {
        watch(curlCommand)
      } else {
        exec(curlCommand, (error, stdout) => {
          if (error) {
            console.error(`Error fetching endpoint status: ${error.message}`)
            return
          }

          console.info(stdout)
        })
      }
    })

  return command
}
