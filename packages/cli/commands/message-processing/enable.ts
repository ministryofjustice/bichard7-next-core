import { Command } from "commander"
import { getEnvironment } from "../../env"
import awsVault from "../../utils/awsVault"

export function enable(): Command {
  return new Command("enable")
    .description("Enables the EventBridge rule")

    .action(() => {
      const { aws } = getEnvironment()

      awsVault.exec({
        awsProfile: aws.profile,
        command: `aws events enable-rule --name ${aws.account}-trigger--from-external-incoming-messages`,
        logExecution: true
      })
    })
}
