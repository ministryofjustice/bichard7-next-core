import fs from "fs"
import path from "path"
import { confirm } from "@inquirer/prompts"
import nunjucks from "nunjucks"

export const outageComms = async (outageType: string, outageResolved: boolean) => {
  const templateFile = outageResolved ? "outage-resolved.txt" : "outage.txt"
  const templatePath = path.join(__dirname, "templates", templateFile)
  const templateContent = fs.readFileSync(templatePath, "utf-8")

  const renderedEmail = nunjucks.renderString(templateContent, { outageType })

  console.log("\n=== Preview Email ===\n")
  console.log(renderedEmail)

  const answer = await confirm({ message: "Do you want to use this template?" })

  if (!answer) {
    process.exit(1)
  }
}
