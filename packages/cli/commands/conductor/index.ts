import { Command } from "commander"
import { open } from "./open"

export function conductor(): Command {
  return new Command("conductor").name("conductor").description("Bichard workflow engine").addCommand(open())
}
