import { select } from "@inquirer/prompts"

export const selectOutageType = async (templateChoice: string) => {
  let outageType = ""
  if (templateChoice === "Outage") {
    outageType = await select({
      message: "What type of outage are we reporting?",
      choices: [
        {
          name: "PNC Outage",
          value: "PNC Outage",
          description: "Notify users of a PNC Outage"
        },
        {
          name: "PSN Outage",
          value: "PSN Outage",
          description: "Notify users of a PSN Outage"
        },
        { name: "Bichard Outage", value: "Bichard Outage", description: "Notify users of a Bichard Outage" }
      ]
    })
  } else if (templateChoice === "Outage Resolved") {
    outageType = await select({
      message: "What type of outage are your sending resolution communications about?",
      choices: [
        {
          name: "PNC Outage Resolved",
          value: "PNC Outage Resolved",
          description: "Notify users that the PNC outage has been resolved"
        },
        {
          name: "PSN Outage Resolved",
          value: "PSN Outage Resolved",
          description: "Notify users that the PSN outage has been resolved"
        },
        {
          name: "Bichard Outage Resolved",
          value: "Bichard Outage Resolved",
          description: "Notify users that the Bichard outage has been resolved"
        }
      ]
    })
  }

  return { outageType }
}
