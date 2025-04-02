import { Command } from "commander"
import nunjucks from "nunjucks"
import { outageComms } from "./outageComms"
import { selectTemplate } from "./selectTemplate"
import { selectOutageType } from "./selectOutageType"
import type { Templates } from "./commsTypes"
import { t } from "./commsTypes"
import { pncMaintenance } from "./pncMaintenance"
import { pncMaintenanceExtended } from "./pncMaintenanceExtended"

nunjucks.configure("templates", { autoescape: true })

export function userComms(): Command {
  const program = new Command("user-comms")

  program.description("A way to send group communications to all users").action(async () => {
    const selectedTemplate = await selectTemplate()
    console.log(selectedTemplate)
    let content

    if (selectedTemplate === "Outage" || selectedTemplate === "Outage Resolved") {
      content = await selectOutageType(selectedTemplate)
    }

    if (selectedTemplate === "PNC maintenance") {
      content = await pncMaintenance()
    }

    if (selectedTemplate === "PNC maintenance extended") {
      content = await pncMaintenanceExtended()
    }
    console.log(content)

    const templateMap: Record<string, Templates> = {
      "PNC maintenance": t.PNCMAINTENACE,
      "PNC maintenance extended": t.EXTENDEDPNCMAINTENACE,
      Outage: t.OUTAGE,
      "Outage Resolved": t.OUTAGERESOLVED
    }

    const templateData = templateMap[selectedTemplate]

    if (!templateData) {
      console.error("Invalid template selection")
      return
    }

    const templateFile = templateData.template.templateFile
    outageComms(content, templateFile)
  })
  return program
}
