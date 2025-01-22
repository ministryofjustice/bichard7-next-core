#!/usr/bin/env node
import { Command } from "commander"
import { devSgs } from "./commands/dev-sgs"
import { status } from "./commands/status"
import { version } from "./package.json"

const program = new Command()

program.name("Bichard CLI tool").description("CLI tool for Bichard 7").version(version)
program.configureOutput({
  writeErr: (str) => {
    console.error(str)
  }
})

program.addCommand(devSgs())
program.addCommand(status())

program.parse(process.argv)
