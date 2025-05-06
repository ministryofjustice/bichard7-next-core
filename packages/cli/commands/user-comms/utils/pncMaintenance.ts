import { input, confirm } from "@inquirer/prompts"
import { isMatch, parse, isValid, isAfter, format } from "date-fns"

const validateTime = (time: string): boolean => {
  return isMatch(time, "HH:mm")
}

const isFutureDate = (date: Date): boolean => {
  const today = new Date()
  return date.setHours(0, 0, 0, 0) > today.setHours(0, 0, 0, 0)
}

export const pncMaintenance = async () => {
  const maintenanceWindows: { date: string; startTime: string; endTime: string }[] = []
  let addAnotherDate = true

  while (addAnotherDate) {
    const dateInput = await input({ message: "Enter the date (dd/MM/yyyy)" })
    const parsedDate = parse(dateInput, "dd/MM/yyyy", new Date())

    if (!isValid(parsedDate)) {
      console.error("❌ Invalid date format. Please use 'dd/MM/yyyy' (e.g., '17/03/2025').")
      continue
    }

    if (!isFutureDate(parsedDate)) {
      console.error("❌ The date must be in the future. Please pick a later date.")
      continue
    }

    const startTime = await input({ message: "Enter start time (HH:mm)" })
    if (!validateTime(startTime)) {
      console.error("❌ Invalid start time format. Please use 'HH:mm' (e.g., '09:30').")
      continue
    }

    const endTime = await input({ message: "Enter end time (HH:mm)" })
    if (!validateTime(endTime)) {
      console.error("❌ Invalid end time format. Please use 'HH:mm' (e.g., '15:30').")
      continue
    }

    // Validate endTime > startTime
    const [startHour, startMinute] = startTime.split(":").map(Number)
    const [endHour, endMinute] = endTime.split(":").map(Number)

    const startDateTime = new Date(parsedDate)
    startDateTime.setHours(startHour, startMinute, 0)

    const endDateTime = new Date(parsedDate)
    endDateTime.setHours(endHour, endMinute, 0)

    if (!isAfter(endDateTime, startDateTime)) {
      console.error("❌ End time must be after start time.")
      continue
    }

    maintenanceWindows.push({
      date: format(parsedDate, "EEEE d MMMM yyyy"),
      startTime,
      endTime
    })

    addAnotherDate = await confirm({
      message: "Would you like to add another planned maintenance window?",
      default: false
    })
  }

  return { maintenanceWindows }
}
