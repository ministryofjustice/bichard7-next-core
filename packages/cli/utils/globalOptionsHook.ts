import { Command } from "commander"
import { getEnvironment, setEnvironment } from "../env"

const skipCommands = ["wiki"]
// adds a hook to every command to check and set the environment.
// once the hook has been invoked once, it doesn't need to run
// again.
let globalOptionsHookInvoked = false
export function configureGlobalOptionsHook(command: Command) {
  command.hook("preAction", (subcommand) => {
    if (globalOptionsHookInvoked) return
    if (skipCommands.includes(subcommand.name())) return

    setEnvironment(subcommand, {
      ...subcommand.opts(),
      ...subcommand.parent?.opts()
    })

    const {
      aws: { profile }
    } = getEnvironment()
    console.log(`Using ${profile} environment`)
    globalOptionsHookInvoked = true
  })

  // Recursively apply hooks to subcommands
  command.commands.forEach(configureGlobalOptionsHook)
}
