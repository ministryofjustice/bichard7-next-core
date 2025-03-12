import { select } from "@inquirer/prompts"

export const selectTemplate = async () => {
  return await select({
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
}
