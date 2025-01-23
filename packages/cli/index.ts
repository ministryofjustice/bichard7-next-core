#!/usr/bin/env node
import { Command } from "commander"
import { devSgs } from "./commands/dev-sgs"
import { status } from "./commands/status"
import { setEnvironment } from "./env"
import { version } from "./package.json"

const cli = new Command()
  .name("Bichard CLI tool")
  .description("CLI tool for Bichard 7")
  .version(version)
  .option("--e2e", "Use the e2e environment")
  .option("--uat", "Use the uat environment")
  .option("--preprod", "Use the preprod environment")
  .option("--prod", "Use the production environment")
  // Hook to propagate global flags to subcommands
  .hook("preAction", (cmd) => {
    setEnvironment(cmd, cmd.opts())
  })
  .configureOutput({
    writeErr: (str) => {
      console.error(str)
    }
  })
  .addCommand(status())
  .addCommand(devSgs())
  .parse(process.argv)

export default cli