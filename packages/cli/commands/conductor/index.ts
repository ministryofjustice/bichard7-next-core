import { Command } from "commander"
import { open } from "./open"

export function conductor(): Command {
  const command = new Command("conductor").name("conductor").description("Bichard workflow engine").addCommand(open())

  return command
}
