import fs from "fs"
import path from "path"
import { confirm, input } from "@inquirer/prompts"
import getUsersFromDb from "./utils/getUsersFromDb"
import renderTemplate from "./utils/renderTemplate"
import type { Content, User } from "./userCommsTypes"

const parseDbUserResponse = (users: string): User => {
  const formattedUsers = users.replace(/'/g, '"')
  const parseUsers = JSON.parse(formattedUsers)
  const mapUsers = parseUsers.map(([name, email, message]: [string, string, string]) => ({ name, email, message }))
  return mapUsers
}

export const prepareComms = async (content: Content, templateFile: string) => {
  const template = templateFile
  const templatePath = path.join(__dirname, "templates", template)
  const templateContent = fs.readFileSync(templatePath, "utf-8")

  renderTemplate(templateContent, { ...content })

  const confirmTemplateChoice = await confirm({ message: "Do you want to use this template?", default: false })

  if (!confirmTemplateChoice) {
    process.exit(1)
  }

  const users = await getUsersFromDb()
  const parsedUsers = parseDbUserResponse(users)

  const randomEntry = parsedUsers[Math.floor(Math.random() * parsedUsers.length)]
  console.log(`To: ${randomEntry.email}`)
  renderTemplate(templateContent, { firstName: randomEntry.name, ...content })

  const confirmUpdatedTemplate = await confirm({ message: "Are you happy with the updated template?", default: false })

  if (!confirmUpdatedTemplate) {
    process.exit(1)
  }

  const answer = await input({
    message: `Are you sure you want to send this email to ${parsedUsers.length} users?\n Type 'confirm send' to send, anything else to abort:`,
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
