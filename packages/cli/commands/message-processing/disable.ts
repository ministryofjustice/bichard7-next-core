import { Command } from "commander"
import { getEnvironment } from "../../env"
import awsVault from "../../utils/awsVault"

export function disable(): Command {
  return new Command("disable")
    .description("Disables the EventBridge rule")

    .action(async () => {
      const { aws } = getEnvironment()

      awsVault.exec({
        awsProfile: aws.profile,
        command: `aws events disable-rule --name ${aws.account}-trigger-from-external-incoming-messages`,
        logExecution: true
      })
    })
}
