import { Command } from "commander"
import { disable } from "./disable"
import { enable } from "./enable"
import { wiki } from "./wiki"

export function messageProcessing(): Command {
  const command = new Command("message-processing")
    .name("message-processing")
    .description("EventBridge rule that forwards incoming messages through to Conductor")
    .addCommand(enable())
    .addCommand(disable())
    .addCommand(wiki())

  return command
}
