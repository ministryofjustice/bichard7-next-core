import { exec } from "child_process"
import { Command } from "commander"
import { getEnvironment } from "../../env"
import awsVault from "../../utils/awsVault"
import { getDefaultBrowserForOSAScript } from "../../utils/getDefaultBrowserForOSAScript"

const FETCH_CONDUCTOR_PASSWORD_SECRET_ARN = `\
    aws secretsmanager list-secrets --query "SecretList[*].{Name: Name, ARN: ARN}" \
      | jq -r '.[] | select(.Name | contains("conductor-password"))' \
      | jq -r '.ARN'`

const FETCH_CONDUCTOR_PASSWORD = (arn: string) => `\
    aws secretsmanager get-secret-value --secret-id "${arn.trim()}" \
      | jq -r ".SecretString"`

export function open(): Command {
  return new Command("open")
    .description("Opens conductor UI and logs in")

    .action(async () => {
      const {
        domain,
        aws: { profile }
      } = getEnvironment()

      console.log("Querying for Conductor password ...")
      // get conductor password
      const arn = await awsVault.exec(profile, FETCH_CONDUCTOR_PASSWORD_SECRET_ARN)
      const password = await awsVault.exec(profile, FETCH_CONDUCTOR_PASSWORD(arn))
      exec(`osascript -e 'open location "https://bichard:${encodeURIComponent(password)}@conductor.${domain}"'`)

      // this tomfoolery is required because it won't log in otherwise.
      console.log("Logging in ...")
      const browser = await getDefaultBrowserForOSAScript()
      setTimeout(async () => {
        exec(`osascript -e 'tell application "${browser}" to reload active tab of window 1'`)
        setTimeout(
          () =>
            exec(
              `osascript -e 'tell application "${browser}" to set URL of active tab of window 1 to "https://conductor.${domain}"'`
            ),
          1000
        )
      }, 1000)

      // TODO: conductor doesn't load properly when you use a basic auth link to log in
      // we could use osascript to detect the default browser and then navigate the newly
      // opened tab to the regular conductor URL
    })
}
