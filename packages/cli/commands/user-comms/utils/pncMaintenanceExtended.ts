import { select } from "@inquirer/prompts"

export const pncMaintenanceExtended = async () => {
  const extendedTimeFrameInput = await select({
    message: "Select a time frame",
    choices: [
      {
        name: "1 hour",
        value: "1 hour",
        description: "The extended time frame is estimated at 1 hour"
      },
      {
        name: "2 hour",
        value: "2 hour",
        description: "The extended time frame is estimated at 2 hour"
      }
    ]
  })
  return { extendedTimeFrame: extendedTimeFrameInput }
}
