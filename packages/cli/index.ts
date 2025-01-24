#!/usr/bin/env node
import { bold } from "cli-color"
import { Command } from "commander"
import { devSgs } from "./commands/dev-sgs"
import { messageProcessing } from "./commands/message-processing"
import { status } from "./commands/status"
import { version } from "./package.json"
import { configureGlobalOptionsHook } from "./utils/globalOptionsHook"
import { fetchImage } from "./commands/fetch-images"
import { setEnvironment } from "./env"

const cli = new Command()
  .name("b7")
  .description("CLI tool for Bichard 7")
  .version(version)
  .option("--e2e", "Use the e2e environment")
  .option("--uat", "Use the uat environment")
  .option("--preprod", "Use the preprod environment")
  .option("--prod", "Use the production environment")
  .option("--shared", "Use the shared environment")
  // Hook to propagate global flags to subcommands
  .hook("preAction", (cmd) => {
    setEnvironment(cmd, cmd.opts())
  })
  .configureOutput({
    outputError: (str) => {
      console.error(bold(str))
    }
  })
  .addCommand(status())
  .addCommand(devSgs())
  .addCommand(messageProcessing())
  .addCommand(fetchImage())

configureGlobalOptionsHook(cli)
cli.parse(process.argv)

export default cli
