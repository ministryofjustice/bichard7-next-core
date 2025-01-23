import { Command } from "commander"
import { getEnvironment } from "../../env"
import awsVault from "../../utils/awsVault"

export function enable(): Command {
  return new Command("enable")
    .description("Enables the EventBridge rule")

    .action(async () => {
      const {
        aws: { profile, account }
      } = getEnvironment()

      awsVault.exec(profile, `aws events enable-rule --name ${account}-trigger-from-external-incoming-messages`)
    })
}
