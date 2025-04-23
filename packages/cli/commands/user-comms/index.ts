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
    console.log(selectTemplate)
    switch (selectedTemplate) {
      case "Outage":
        inputedContent = await selectOutageType(selectedTemplate)
        templateData.templateTitle = `Unexpected ${inputedContent.outageType} Outage`
        break
      case "Outage Resolved":
        inputedContent = await selectOutageType(selectedTemplate)
        templateData.templateTitle = `Unexpected ${inputedContent.outageType} Outage Resolved`
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

    const { parsedUsers, templateContent } = await prepareComms(inputedContent, templateData)

    const updatedUsers = parsedUsers.map((user) => ({
      ...user,
      message: nunjucks.renderString(templateContent, { firstName: user.name, ...inputedContent })
    }))

    sendUserComms(updatedUsers, templateData)
  })

  return program
}
