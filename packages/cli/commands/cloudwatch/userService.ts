import { Command } from "commander"
import type { Environment } from "../../config"
import { env } from "../../config"
import awsVault from "../../utils/awsVault"

export function userService(): Command {
  return new Command("user-service")
    .description("A way of querying our User Service ECS cluster for user login events")
    .usage("<email>")
    .argument("<email>", "The user email that you want to look up - this is a partial search")
    .option("-s, --start-time", "Specify the start time in hours to query from (defaults to 1 hour)", "1")
    .action(async (email: string, options: { startTime: string }) => {
      const hours = parseInt(options.startTime, 10)
      if (isNaN(hours)) {
        console.log(hours)
        console.error("The --start-time option must be a valid number.")
        process.exit(1)
      }

      const { aws }: Environment = env.PROD

      const userServiceQuery = `\
        aws logs filter-log-events \
        --log-group-name "cjse-bichard7-production-base-infra-user-service" \
        --filter-pattern "%${email}%" \
        --start-time $(($(date -v-${hours}H +%s) * 1000)) \
        --end-time $(($(date +%s) * 1000)) | jq \'.events[] | {message, formattedTimestamp: (.timestamp / 1000 | todate)}\'
      `

      await awsVault.exec({
        awsProfile: aws.profile,
        command: `${userServiceQuery}`,
        logExecution: true,
        streamOutput: true
      })
    })
}
