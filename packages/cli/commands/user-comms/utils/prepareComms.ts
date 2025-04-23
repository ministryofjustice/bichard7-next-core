import fs from "fs"
import path from "path"
import { confirm, input } from "@inquirer/prompts"
import renderTemplate from "./renderTemplate"
import type { Content, User } from "./userCommsTypes"
import { env } from "../../../config"
import awsVault from "../../../utils/awsVault"

const parseDbUserResponse = (users: string): User => {
  const parseUsers = JSON.parse(users)
  const mapUsers = parseUsers.map(([name, email, message]: [string, string, string]) => ({ name, email, message }))
  return mapUsers
}

const getDbPassword =
  "aws ssm get-parameter --name \"/cjse-production-bichard-7/rds/db/password\" --with-decryption --output json | jq -r '.Parameter.Value'"

const getDbUser =
  "aws ssm get-parameter --name \"/cjse-production-bichard-7/rds/db/user\" --with-decryption --output json | jq -r '.Parameter.Value'"

export const prepareComms = async (content: Content, templateFile: string) => {
  const template = templateFile
  const templatePath = path.join(__dirname, "../templates", template)
  const templateContent = fs.readFileSync(templatePath, "utf-8")

  renderTemplate(templateContent, { ...content })

  const confirmTemplateChoice = await confirm({ message: "Do you want to use this template?", default: false })

  if (!confirmTemplateChoice) {
    process.exit(1)
  }

  const { aws } = env.PROD

  const dbPassword = await awsVault.exec({
    awsProfile: aws.profile,
    command: getDbPassword
  })

  const dbUser = await awsVault.exec({
    awsProfile: aws.profile,
    command: getDbUser
  })

  await awsVault.exec({
    awsProfile: aws.profile,
    command: `sh -c 'DB_USER="${dbUser}" DB_PASSWORD="${dbPassword}" npx ts-node -T ./commands/user-comms/utils/getUsers.ts'`
  })

  const users = fs.readFileSync("/tmp/users.json", "utf-8")
  const parsedUsers = parseDbUserResponse(users)

  const randomEntry = parsedUsers[Math.floor(Math.random() * parsedUsers.length)]
  console.log(`To: ${randomEntry.email}`)
  renderTemplate(templateContent, { firstName: randomEntry.name, ...content })

  const confirmUpdatedTemplate = await confirm({ message: "Are you happy with the updated template?", default: false })

  if (!confirmUpdatedTemplate) {
    process.exit(1)
  }

  const answer = await input({
    message: `Are you sure you want to send this email to ${parsedUsers.length} users?\n Type 'confirm send' to send, or press <ctrl-c> to abort:`,
    validate: (value) => {
      if (value.toLowerCase() !== "confirm send") {
        return "Please type 'confirm send' to send or anything to abort."
      }
      return true
    }
  })

  if (answer.toLowerCase() !== "confirm send") {
    console.log("Operation cancelled.")
    process.exit(1)
  }
  return { parsedUsers, templateContent }
}
