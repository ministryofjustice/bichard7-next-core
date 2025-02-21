import { Command } from "commander"
import { postfix } from "./postfix"
import { userService } from "./userService"

export function cloudwatch(): Command {
  const command = new Command("cloudwatch")
    .description("A method for querying cloudwatch for user events")
    .usage("postfix --start-time 3 steve@example.com")
    .addCommand(postfix())
    .addCommand(userService())

  return command
}
