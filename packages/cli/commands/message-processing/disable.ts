import { Command } from "commander"
import { getEnvironment } from "../../env"
import awsVault from "../../utils/awsVault"

export function disable(): Command {
  return new Command("disable")
    .description("Disables the EventBridge rule")

    .action(async () => {
      const {
        aws: { profile, account }
      } = getEnvironment()

      awsVault.exec(profile, `aws events disable-rule --name ${account}-trigger-from-external-incoming-messages`)
    })
}
