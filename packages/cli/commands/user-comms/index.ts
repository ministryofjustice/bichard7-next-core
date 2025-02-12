import { select } from "@inquirer/prompts"
import { Command } from "commander"
import nunjucks from "nunjucks"
import { pncMaintenance } from "./pncMaintenance"
import { pncMaintenanceExtended } from "./pncMaintenanceExtended"

nunjucks.configure("templates", { autoescape: true })

export function userComms(): Command {
  const program = new Command("user-comms")

  program.description("A way to send group communications to all users").action(async () => {
    const templateChoice = await select({
      message: "Select a template to use",
      choices: [
        {
          name: "PNC Scheduled Maintenance",
          value: "PNC maintenance",
          description: "Notify users of upcoming scheduled maintenance"
        },
        {
          name: "PNC Maintenance Window Extended",
          value: "PNC maintenance extended",
          description: "Notify users that the maintenance window has been extended"
        },

        {
          name: "Outage Notification",
          value: "Outage",
          description: "Notify users about an ongoing outage"
        },
        {
          name: "Outage Resolved",
          value: "Outage Resolved",
          description: "Notify users that the outage has been resolved"
        }
      ]
    })

    console.log(`You selected: ${templateChoice}`)
    switch (templateChoice) {
      case "PNC maintenance":
        pncMaintenance()
        break
      case "PNC maintenance extended":
        pncMaintenanceExtended()
        break
      case "Outage":
        console.log("Outage")
        break
      case "Outage Resolved":
        console.log("Outage resolved")
        break
    }
  })

  return program
}
