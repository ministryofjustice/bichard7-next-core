import fs from "fs"
import path from "path"
import { input, confirm } from "@inquirer/prompts"
import nunjucks from "nunjucks"
import { parse, format, isValid } from "date-fns"

export const pncMaintenance = async () => {
  const templateFile = "pnc-maintenance.txt"
  const templatePath = path.join("./commands/user-comms/templates", templateFile)
  const templateContent = fs.readFileSync(templatePath, "utf-8")

  const dateInput = await input({ message: "Enter the date (dd/MM/yyyy)" })
  const startTime = await input({ message: "Enter start time (HH:mm)" })
  const endTime = await input({ message: "Enter end time (HH:mm)" })

  const parsedDate = parse(dateInput, "dd/MM/yyyy", new Date())

  if (!isValid(parsedDate)) {
    console.error("Invalid date format. Please use 'dd/MM/yyyy' (e.g., '17/03/2025').")
    return
  }

  const formattedDate = format(parsedDate, "EEEE d MMMM yyyy")

  const renderedEmail = nunjucks.renderString(templateContent, {
    date: formattedDate,
    startTime: startTime,
    endTime: endTime
  })

  console.log("\n=== Preview Email ===\n")
  console.log(renderedEmail)

  const answer = await confirm({ message: "Do you want to use this template?" })

  if (!answer) {
    process.exit(1)
  }
}
