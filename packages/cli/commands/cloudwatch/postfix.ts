import { Command } from "commander"
import type { Environment } from "../../config"
import { env } from "../../config"
import awsVault from "../../utils/awsVault"

export function postfix(): Command {
  return new Command("postfix")
    .description("A way of querying our postfix ECS service for user login events")
    .usage("<email>")
    .argument("<email>", "The user email that you want to look up - this is a partial search")
    .option("-s, --start-time <start-time>", "Specify the start time in hours to query from (defaults to 1 hour)", "1")
    .action(async (email: string, options: { startTime: string }) => {
      const hours = parseInt(options.startTime, 10)
      if (isNaN(hours)) {
        console.log(hours)
        console.error("The --start-time option must be a valid number.")
        process.exit(1)
      }

      const { aws }: Environment = env.PROD

      const postfixQuery = `aws logs filter-log-events \
       --log-group-name "cjse-production-bichard-7-postfix-ecs-logs" \
       --filter-pattern "%${email}%" \
       --start-time $(($(date -v-${hours}H +%s) * 1000)) \
       --end-time $(($(date +%s) * 1000)) | jq -r '.events[] | .message | capture("^(?<timestamp>[^ ]+) .*to=<(?<to>[^>]+)>,.*delay=(?<delay>[^,]+),.*status=(?<status>[^ ]+)")'
      `

      await awsVault.exec({
        awsProfile: aws.profile,
        command: `${postfixQuery}`,
        logExecution: true,
        streamOutput: true
      })
    })
}
