import { Command } from "commander"
import { getEnvironment, setEnvironment } from "../env"

// adds a hook to every command to check and set the environment.
// once the hook has been invoked once, it doesn't need to run
// again.
let globalOptionsHookInvoked = false
export function configureGlobalOptionsHook(command: Command) {
  command.hook("preAction", (cmd) => {
    if (globalOptionsHookInvoked) return
    if (command.name() === "wiki") return

    setEnvironment(cmd, {
      ...cmd.opts(),
      ...cmd.parent?.opts()
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
