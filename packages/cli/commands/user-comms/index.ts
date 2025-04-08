import { Command } from "commander"
import { outageComms } from "./outageComms"
import { selectTemplate } from "./selectTemplate"
import { selectOutageType } from "./selectOutageType"
import type { Content, Templates } from "./templateTypes"
import { templateTypes } from "./templateTypes"
import { pncMaintenance } from "./pncMaintenance"
import { pncMaintenanceExtended } from "./pncMaintenanceExtended"
import nunjucks from "nunjucks"

nunjucks.configure({ autoescape: true })

export function userComms(): Command {
  const program = new Command("user-comms")

  program.description("A way to send group communications to all users").action(async () => {
    const selectedTemplate = await selectTemplate()
    console.log(selectedTemplate)
    let content: Content

    if (selectedTemplate === "Outage" || selectedTemplate === "Outage Resolved") {
      content = await selectOutageType(selectedTemplate)
    } else if (selectedTemplate === "PNC maintenance") {
      content = await pncMaintenance()
    } else if (selectedTemplate === "PNC maintenance extended") {
      content = await pncMaintenanceExtended()
    } else {
      console.error("Invalid template selection")
      return
    }

    const templateMap: Record<string, Templates> = {
      "PNC maintenance": templateTypes.PNCMAINTENACE,
      "PNC maintenance extended": templateTypes.EXTENDEDPNCMAINTENACE,
      Outage: templateTypes.OUTAGE,
      "Outage Resolved": templateTypes.OUTAGERESOLVED
    }

    const templateData = templateMap[selectedTemplate]

    if (!templateData) {
      console.error("Invalid template selection")
      return
    }

    const templateFile = templateData.template.templateFile
    const { parsedUsers, templateContent } = await outageComms(content, templateFile)
    console.log(templateContent)
    let NotifyClient = require("notifications-node-client").NotifyClient


    const updatedUsers = parsedUsers.map((user) => ({
      ...user,
      message: nunjucks.renderString(templateContent, { firstName: user.name, ...content })
    }))

    const sendEmails = async (updatedUsers, templateId, selectedTemplate) => {
      const emailPromises = updatedUsers.map((user) =>
        notifyClient
          .sendEmail(templateId, user.email, {
            personalisation: {
              email_subject: selectedTemplate,
              email_message: user.message
            },
            reference: `email-${user.email}`
          })
          .then((response) => {
            console.log(`✅ Email sent to ${user.email}:`)
          })
          .catch((error) => {
            console.error(`❌ Failed to send email to ${user.email}:`, error.response || error)
          })
      )

      await Promise.all(emailPromises)
    }
    sendEmails(updatedUsers, templateId, selectedTemplate)
  })

  return program
}
