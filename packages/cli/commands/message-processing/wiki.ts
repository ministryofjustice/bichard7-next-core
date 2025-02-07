import { exec } from "child_process"
import { Command } from "commander"

export function wiki(): Command {
  return new Command("wiki").description("Opens the confluence documentation for message processing").action(() => {
    exec("open https://dsdmoj.atlassian.net/wiki/spaces/KB/pages/5417042038/Disable+Message+Processing")
  })
}
