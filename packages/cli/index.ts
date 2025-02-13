#!/usr/bin/env node
import { bold } from "cli-color"
import { Command } from "commander"
import { conductor } from "./commands/conductor"
import { devSgs } from "./commands/devSgs"
import { fetchImage } from "./commands/fetchImage"
import { messageProcessing } from "./commands/message-processing"
import { status } from "./commands/status"
import { version } from "./package.json"
import { applyEnvironmentOptionHooks } from "./utils/globalOptionsHook"
import { cloudwatch } from "./commands/cloudwatch"
import { importVpn } from "./commands/importVpn"
import { userComms } from "./commands/user-comms"

process.on("unhandledRejection", (reason) => {
  console.error(reason)
  process.exit(1)
})

const cli = new Command()
  .name("b7")
  .description("CLI tool for Bichard 7")
  .version(version)
  .option("--e2e", "Use the e2e environment")
  .option("--uat", "Use the uat environment")
  .option("--preprod", "Use the preprod environment")
  .option("--prod", "Use the production environment")
  .option("--shared", "Use the shared environment")
  .configureOutput({
    outputError: (str) => {
      console.error(bold(str))
    }
  })
  // individual commands
  .addCommand(status())
  .addCommand(devSgs())
  .addCommand(fetchImage())
  .addCommand(importVpn())
  // command groups
  .addCommand(messageProcessing())
  .addCommand(conductor())
  .addCommand(cloudwatch())
  .addCommand(userComms())

const skipCommands = ["wiki", "fetch-image", "dev-sgs", "cloudwatch", "import-vpn-profiles", "user-comms"]
if (!skipCommands.some((c) => process.argv.includes(c))) {
  applyEnvironmentOptionHooks(cli)
}

cli.parse(process.argv)

export default cli
