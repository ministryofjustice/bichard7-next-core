import type { Amendments } from "@moj-bichard7/common/types/Amendments"

import { formatDisplayedDate } from "./formattedDate"

const formatValueOfUpdatedElement = (value: boolean | Date | number | string): string =>
  value instanceof Date ? formatDisplayedDate(value) : `${value}`

const getSystemNotes = (amendments: Partial<Amendments>, username: string): string[] => {
  const notes: string[] = []
  const portalActionText = `${username}: Portal Action: Update Applied.`

  for (const [key, value] of Object.entries(amendments)) {
    const baseNoteText = `${portalActionText} Element: ${key}. New Value: `

    if (Array.isArray(value)) {
      value.forEach((field) => {
        if (key === "offenceReasonSequence" && field.value === 0) {
          notes.push(baseNoteText + "Added in court")
          return
        }

        if (!field.value) {
          return
        }

        notes.push(baseNoteText + formatValueOfUpdatedElement(field.value))
      })
    } else {
      notes.push(baseNoteText + formatValueOfUpdatedElement(value))
    }
  }

  return notes
}

export default getSystemNotes
