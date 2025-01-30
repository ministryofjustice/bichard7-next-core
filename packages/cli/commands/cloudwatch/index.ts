import { Command } from "commander"
import { postfix } from "./postfix"
import { userService } from "./userService"

export function cloudwatch(): Command {
  const command = new Command("cloudwatch")
    .name("cloudwatch")
    .description("A method for querying cloudwatch for user events")
    .usage("b7 cloudwatch-user-event postfix -h 3 steve@example.com")
    .addCommand(postfix())
    .addCommand(userService())

  return command
}
