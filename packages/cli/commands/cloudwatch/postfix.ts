// // query postfix for user email login attemtp in hours
// aws-vault exec qsolution-production -- aws logs filter-log-events \
//     --log-group-name "cjse-production-bichard-7-postfix-ecs-logs" \
//     --filter-pattern "%anita%" \
//     --start-time $(($(date -v-4H +%s) * 1000)) \
//     --end-time $(($(date +%s) * 1000)) | jq -r '.events[] | .message | capture("to=<(?<to>[^>]+)>,.*delay=(?<delay>[^,]+),.*status=(?<status>[^ ]+)")'
//
// query userservive for username
import { Command } from "commander"

export function postfix(): Command {
  const command = new Command("postfix-user-events")
    .description("A way of querying our postfix ecs service for user login events")
    .arguments("<email>, The user email that you want to look up - this is partial search")
    .arguments("[hours], Specify the start time you want to query")
  return command
}
