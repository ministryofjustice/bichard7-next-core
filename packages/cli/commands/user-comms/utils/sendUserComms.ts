import { Template, User } from "./userCommsTypes"
import { env } from "../../../config"
import awsVault from "../../../utils/awsVault"

const { aws } = env.SHARED

const govNotifyTemplateId = "1f6f59c9-7eca-449c-9843-9d6b84e04437"
const getApiSecretArn =
  "aws secretsmanager list-secrets --query \"SecretList[*].{Name: Name, ARN: ARN}\" \
      | jq -r '.[] | select(.Name | contains(\"GovNotify\"))' \
      | jq -r '.ARN'"

const getApiKey = (arn: string) => `\
    aws secretsmanager get-secret-value --secret-id "${arn.trim()}" \
      | jq -r ".SecretString"`

const sendUserComms = async (updatedUsers: User, templateData: Template) => {
  const apiArn = await awsVault.exec({
    awsProfile: aws.profile,
    command: getApiSecretArn
  })
  const apiKey = await awsVault.exec({
    awsProfile: aws.profile,
    command: getApiKey(apiArn)
  })
  let NotifyClient = require("notifications-node-client").NotifyClient
  let notifyClient = new NotifyClient(apiKey)

  const emailPromises = updatedUsers.map((user) =>
    notifyClient
      .sendEmail(govNotifyTemplateId, user.email, {
        personalisation: {
          email_subject: templateData.templateTitle,
          email_message: user.message
        },
        reference: `email-${user.email}`
      })
      .then((_: any) => {
        console.log(`✅ Email sent to ${user.email}`)
      })
      .catch((error: any) => {
        console.error(`❌ Failed to send email to ${user.email}:`, error.response || error)
      })
  )

  await Promise.all(emailPromises)
}

export default sendUserComms
