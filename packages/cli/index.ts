#!/usr/bin/env node
import { Command } from "commander";
import { helloCommand } from "./commands/hello";
import { devSgs } from "./commands/dev-sgs";

const program = new Command();

program
  .name("Bichard CLI tool")
  .description("CLI tool for Bichard 7")
  .version("1.0.0");

program.addCommand(helloCommand());
program.addCommand(devSgs())

program.parse(process.argv);

