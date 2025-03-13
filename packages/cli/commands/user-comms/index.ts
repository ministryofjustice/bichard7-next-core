import { Command } from "commander"
import nunjucks from "nunjucks"
import { pncMaintenance } from "./pncMaintenance"
import { pncMaintenanceExtended } from "./pncMaintenanceExtended"
import { outageComms } from "./outageComms"
import { selectTemplate } from "./selectTemplate"
import { selectOutageType } from "./selectOutageType"

nunjucks.configure("templates", { autoescape: true })

export function userComms(): Command {
  const program = new Command("user-comms")

  program.description("A way to send group communications to all users").action(async () => {
    const selectedTemplate = await selectTemplate()

    let outageType = ""
    let hasOutageResolved = false

    if (selectedTemplate === "Outage" || selectedTemplate === "Outage Resolved") {
      const outageValues = await selectOutageType(selectedTemplate)
      outageType = outageValues.outageType
      hasOutageResolved = outageValues.hasOutageResolved
    }

    switch (selectedTemplate) {
      case "PNC maintenance":
        pncMaintenance()
        break
      case "PNC maintenance extended":
        pncMaintenanceExtended()
        break
      case "Outage":
      case "Outage Resolved":
        outageComms(outageType, hasOutageResolved)
        break
    }
  })
  return program
}
