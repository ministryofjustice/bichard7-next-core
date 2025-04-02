import { input, confirm } from "@inquirer/prompts"
import { parse, format, isValid, isMatch } from "date-fns"

const validateTime = (time: string): boolean => {
  return isMatch(time, "HH:mm")
}

export const pncMaintenance = async () => {
  const maintenanceWindows: { date: string; startTime: string; endTime: string }[] = []
  let addAnotherDate = true

  while (addAnotherDate) {
    const dateInput = await input({ message: "Enter the date (dd/MM/yyyy)" })
    const parsedDate = parse(dateInput, "dd/MM/yyyy", new Date())
    if (!isValid(parsedDate)) {
      console.error("Invalid date format. Please use 'dd/MM/yyyy' (e.g., '17/03/2025').")
      continue
    }

    const startTime = await input({ message: "Enter start time (HH:mm)" })
    if (!validateTime(startTime)) {
      console.error("Invalid time format. Please use 'HH:mm' (e.g., '09:30')")
      continue
    }

    const endTime = await input({ message: "Enter end time (HH:mm)" })
    if (!validateTime(endTime)) {
      console.error("Invalid time format. Please use 'HH:mm' (e.g., '15:30')")
      continue
    }

    maintenanceWindows.push({
      date: format(parsedDate, "EEEE d MMMM yyyy"),
      startTime,
      endTime
    })

    addAnotherDate = await confirm({
      message: "Are there any other planned maintenance windows you would like to notify users about?"
    })
  }

  return { maintenanceWindows }
}
