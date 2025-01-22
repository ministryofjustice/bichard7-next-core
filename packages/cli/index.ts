#!/usr/bin/env node
import { Command } from "commander"
import { devSgs } from "./commands/dev-sgs"
import { version } from "./package.json"

const program = new Command()

program.name("Bichard CLI tool").description("CLI tool for Bichard 7").version(version)

program.addCommand(devSgs())

program.parse(process.argv)
