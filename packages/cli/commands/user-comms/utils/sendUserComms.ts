import { env } from "../../../config"
import awsVault from "../../../utils/awsVault"
import { logToFile } from "../../../utils/logger"
import type { Template, User } from "./userCommsTypes"

const { aws } = env.SHARED

interface NotifyError {
  response: {
    data: {
      errors: unknown
    }
  }
}

const govNotifyTemplateId = "1f6f59c9-7eca-449c-9843-9d6b84e04437"
const getApiSecretArn =
  "aws secretsmanager list-secrets --query \"SecretList[*].{Name: Name, ARN: ARN}\" \
      | jq -r '.[] | select(.Name | contains(\"GovNotify\"))' \
      | jq -r '.ARN'"

const getApiKey = (arn: string) => `\
    aws secretsmanager get-secret-value --secret-id "${arn.trim()}" \
      | jq -r ".SecretString"`

let errorCount: number = 0
const sendUserComms = async (updatedUsers: User, templateData: Template) => {
  const apiArn = await awsVault.exec({
    awsProfile: aws.profile,
    command: getApiSecretArn
  })
  const apiKey = await awsVault.exec({
    awsProfile: aws.profile,
    command: getApiKey(apiArn)
  })
  const NotifyClient = require("notifications-node-client").NotifyClient
  const notifyClient = new NotifyClient(apiKey)
  const totalUsers = updatedUsers.length

  const sendEmailWorker = async () => {
    while (updatedUsers.length > 0) {
      const user = updatedUsers.shift()
      if (!user) {
        break
      }

      const result = await notifyClient
        .sendEmail(govNotifyTemplateId, user.email, {
          personalisation: {
            email_subject: templateData.templateTitle,
            email_message: user.message
          },
          reference: `email-${user.email}`
        })
        .then(() => {
          console.log(`✅ Email sent to ${user.email}`)
        })
        .catch((error: NotifyError) => {
          errorCount = errorCount + 1
          const errorText = JSON.stringify(error.response.data.errors)
          logToFile(`❌ Failed to send email to ${user.email}`)
          logToFile(`${errorText}`)

          if (errorText.includes("RateLimitError")) {
            return "RateLimitError"
          }
        })

      if (result === "RateLimitError") {
        updatedUsers.push(user)
        logToFile("⏱️ Rate limit exceeded - Wait 1 minute...")
        await new Promise((resolve) => setTimeout(resolve, 60_000))
      }
    }
  }

  await Promise.all(new Array(10).fill(0).map(() => sendEmailWorker()))

  console.log(`\nSuccessfully sent ${totalUsers - errorCount} emails`)

  if (errorCount > 0) {
    console.log(`\nFailed to send email to ${errorCount} user(s)`)
    console.log("Check error logs located at /tmp/email-logs/\n")
  }
}

export default sendUserComms
