import { Command } from "commander"
import { postfix } from "./postfix"

export function cloudwatch(): Command {
  const command = new Command("cloudwatch-user-event")
    .name("cloudwatch-user-event")
    .description("EventBridge rule that forwards incoming messages through to Conductor")
    .addCommand(postfix())

  return command
}
