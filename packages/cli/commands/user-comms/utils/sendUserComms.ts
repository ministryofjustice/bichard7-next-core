import type { Template, User } from "./userCommsTypes"
import { env } from "../../../config"
import awsVault from "../../../utils/awsVault"
import { logToFile } from "../../../utils/logger"

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

  const emailPromises: Promise<void>[] = updatedUsers.map((user) =>
    notifyClient
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
        logToFile(`❌ Failed to send email to ${user.email}`)
        logToFile(`${JSON.stringify(error.response.data.errors)}`)
      })
  )
  await Promise.all(emailPromises)

  console.log(`\nSuccessfully sent ${updatedUsers.length - errorCount} emails`)

  if (errorCount > 0) {
    console.log(`\nFailed to send email to ${errorCount} user(s)`)
    console.log("Check error logs located at /tmp/email-logs/\n")
  }
}

export default sendUserComms
