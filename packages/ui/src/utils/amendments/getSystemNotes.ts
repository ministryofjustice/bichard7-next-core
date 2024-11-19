import type Note from "services/entities/Note"
import type User from "services/entities/User"
import type { Amendments } from "types/Amendments"

import { formatDisplayedDate } from "utils/date/formattedDate"

const formatValueOfUpdatedElement = (value: boolean | Date | number | string): string =>
  value instanceof Date ? formatDisplayedDate(value) : `${value}`

const getSystemNotes = (amendments: Partial<Amendments>, userDetails: User, courtCaseId: number): Partial<Note>[] => {
  const notes: Partial<Note>[] = []
  const portalActionText = `${userDetails.username}: Portal Action: Update Applied.`

  for (const [key, value] of Object.entries(amendments)) {
    if (key === "noUpdatesResubmit") {
      continue
    }

    const noteText = `${portalActionText} Element: ${key}. New Value: `

    if (Array.isArray(value)) {
      value.forEach((field) => {
        if (key === "offenceReasonSequence" && field.value === 0) {
          notes.push({
            errorId: courtCaseId,
            noteText: noteText + "Added in court",
            userId: "System"
          })

          return
        }

        if (!field.value) {
          return
        }

        notes.push({
          errorId: courtCaseId,
          noteText: noteText + formatValueOfUpdatedElement(field.value),
          userId: "System"
        })
      })
    } else {
      notes.push({
        errorId: courtCaseId,
        noteText: noteText + formatValueOfUpdatedElement(value),
        userId: "System"
      })
    }
  }

  return notes
}

export default getSystemNotes
