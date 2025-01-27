import type { Command } from "commander"
import { setEnvironment } from "../env"

// adds a hook to every command to check and set the environment.
// once the hook has been invoked once, it doesn't need to run
// again.
let globalOptionsHookInvoked = false
export function applyEnvironmentOptionHooks(command: Command) {
  command.hook("preAction", (subcommand) => {
    if (globalOptionsHookInvoked) {
      return
    }

    const {
      aws: { profile }
    } = setEnvironment(subcommand, {
      ...subcommand.opts(),
      ...subcommand.parent?.opts()
    })

    console.log(`Using ${profile} environment`)
    globalOptionsHookInvoked = true
  })

  // Recursively apply hooks to subcommands
  command.commands.forEach(applyEnvironmentOptionHooks)
}
