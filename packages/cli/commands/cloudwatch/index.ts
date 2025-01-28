import { Command } from "commander"
import { postfix } from "./postfix"

export function cloudwatch(): Command {
  const command = new Command("cloudwatch-user-event")
    .name("cloudwatch-user-event")
    .description("A method for querying cloudwatch for user events")
    .usage("b7 cloudwatch-user-event postfix -h 3 steve@example.com")
    .addCommand(postfix())

  return command
}
