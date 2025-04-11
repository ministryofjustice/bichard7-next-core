import { Command } from "commander"
import { prepareComms } from "./utils/prepareComms"
import { selectTemplate } from "./utils/selectTemplate"
import { selectOutageType } from "./utils/selectOutageType"
import type { Content, Template } from "./utils/userCommsTypes"
import { templateTypes } from "./utils/userCommsTypes"
import { pncMaintenance } from "./utils/pncMaintenance"
import { pncMaintenanceExtended } from "./utils/pncMaintenanceExtended"
import nunjucks from "nunjucks"
import sendUserComms from "./utils/sendUserComms"

nunjucks.configure({ autoescape: true })

export function userComms(): Command {
  const program = new Command("user-comms")

  program.description("A way to send group communications to all users").action(async () => {
    const selectedTemplate = await selectTemplate()

    const templateMap: Record<string, Template> = {
      "PNC maintenance": templateTypes.PNCMAINTENANCE,
      "PNC maintenance extended": templateTypes.EXTENDEDPNCMAINTENANCE,
      Outage: templateTypes.OUTAGE,
      "Outage Resolved": templateTypes.OUTAGERESOLVED
    }

    const templateData = templateMap[selectedTemplate]

    if (!templateData) {
      console.error("Invalid template selection")
      return
    }

    let inputedContent: Content

    switch (selectedTemplate) {
      case "Outage":
      case "Outage Resolved":
        inputedContent = await selectOutageType(selectedTemplate)
        templateData.templateTitle = `Unexpected ${inputedContent.outageType}`
        break
      case "PNC maintenance":
        inputedContent = await pncMaintenance()
        break
      case "PNC maintenance extended":
        inputedContent = await pncMaintenanceExtended()
        break
      default:
        console.error("Invalid template selection")
        return
    }

    const templateFile = templateData.templateFile
    const { parsedUsers, templateContent } = await prepareComms(inputedContent, templateFile)

    const updatedUsers = parsedUsers.map((user) => ({
      ...user,
      message: nunjucks.renderString(templateContent, { firstName: user.name, ...inputedContent })
    }))

    sendUserComms(updatedUsers, templateData)
  })

  return program
}
