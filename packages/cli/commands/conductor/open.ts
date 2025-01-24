import { Command } from "commander"

export function enable(): Command {
  return new Command("open")
    .description("Opens conductor and logs in")

    .action(async () => {
      // awsVault.exec(profile, `aws events enable-rule --name ${account}-trigger-from-external-incoming-messages`)
    })
}
