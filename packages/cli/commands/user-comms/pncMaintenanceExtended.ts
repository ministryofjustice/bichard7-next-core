import fs from "fs"
import path from "path"
import { confirm, select } from "@inquirer/prompts"
import nunjucks from "nunjucks"

export const pncMaintenanceExtended = async () => {
  const templateFile = "pnc-maintenance-extended.txt"
  const templatePath = path.join(__dirname, "templates", templateFile)
  const templateContent = fs.readFileSync(templatePath, "utf-8")

  const extendedTimeFrameInput = await select({
    message: "Select a time frame",
    choices: [
      {
        name: "1 hour",
        value: "1 hour",
        description: "The extended time frame is estimated at 1 hour"
      },
      {
        name: "2 hour",
        value: "2 hour",
        description: "The extended time frame is estimated at 2 hour"
      }
    ]
  })

  const renderedEmail = nunjucks.renderString(templateContent, {
    extendedTimeFrame: extendedTimeFrameInput
  })

  console.log("\n=== Preview Email ===\n")
  console.log(renderedEmail)

  const answer = await confirm({ message: "Do you want to use this template?" })

  if (!answer) {
    process.exit(1)
  }
}
