import { exec } from "child_process"
import { bold } from "cli-color"
import { Command } from "commander"
import { getEnvironment } from "../../env"
import awsVault from "../../utils/awsVault"
import { checkConnection } from "../../utils/checkConnection"
import { getDefaultBrowserForOSAScript } from "../../utils/getDefaultBrowserForOSAScript"

const connect = async (url: string) => {
  let ok = false

  try {
    await checkConnection(`https://${url}`)
    ok = true
  } catch (err) {
    console.error(
      `Failed to connect to ${bold(url)}\nMake sure you're connected to the correct VPN and that dev SGs have been applied.`
    )
  }

  return ok
}

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
      const conductor = `conductor.${domain}`

      const connectionEstablished = await connect(conductor)
      if (!connectionEstablished) return

      // get conductor password
      console.log("Querying for Conductor password ...")
      const arn = await awsVault.exec({ awsProfile: profile, command: FETCH_CONDUCTOR_PASSWORD_SECRET_ARN })
      const password = await awsVault.exec({
        awsProfile: profile,
        command: FETCH_CONDUCTOR_PASSWORD(arn),
        stdio: "pipe" // hide the output
      })

      // this tomfoolery is required because it won't log in otherwise.
      console.log("Logging in ...")
      exec(`osascript -e 'open location "https://bichard:${encodeURIComponent(password)}@${conductor}"'`)

      const browser = await getDefaultBrowserForOSAScript()
      setTimeout(async () => {
        exec(`osascript -e 'tell application "${browser}" to reload active tab of window 1'`)
        setTimeout(
          () =>
            exec(
              `osascript -e 'tell application "${browser}" to set URL of active tab of window 1 to "https://${conductor}"'`
            ),
          1000
        )
      }, 1000)
    })
}
