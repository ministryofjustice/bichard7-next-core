import { select } from "@inquirer/prompts"
import { Command } from "commander"
import nunjucks from "nunjucks"
import { pncMaintenance } from "./pncMaintenance"
import { pncMaintenanceExtended } from "./pncMaintenanceExtended"
import { outage } from "./outage"
import { outageResolved } from "./outage-resolved"

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

    let outageType = ""

    if (templateChoice === "Outage") {
      outageType = await select({
        message: "What type of outage are we reporting?",
        choices: [
          {
            name: "PNC Outage",
            value: "PNC",
            description: "Notify users of a PNC Outage"
          },
          {
            name: "PSN Outage",
            value: "PSN",
            description: "Notify users of a PSN Outage"
          },
          { name: "Bichard Outage", value: "Bichard", description: "Notify users of a Bichard Outage" }
        ]
      })
    } else if (templateChoice === "Outage Resolved") {
      outageType = await select({
        message: "What type of outage are your sending resolution communications about?",
        choices: [
          {
            name: "PNC Outage Resolved",
            value: "PNC",
            description: "Notify users that the PNC outage has been resolved"
          },
          {
            name: "PSN Outage Resolved",
            value: "PSN",
            description: "Notify users that the PSN outage has been resolved"
          },
          {
            name: "Bichard Outage Resolved",
            value: "Bichard",
            description: "Notify users that the Bichard outage has been resolved"
          }
        ]
      })
    }

    switch (templateChoice) {
      case "PNC maintenance":
        pncMaintenance()
        break
      case "PNC maintenance extended":
        pncMaintenanceExtended()
        break
      case "Outage":
        outage(outageType)
        break
      case "Outage Resolved":
        outageResolved(outageType)
        break
    }
  })

  return program
}
