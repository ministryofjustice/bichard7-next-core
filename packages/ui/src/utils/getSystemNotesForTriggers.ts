import type Note from "services/entities/Note"
import type Trigger from "services/entities/Trigger"

const getSystemNotesForTriggers = (triggers: Trigger[], resolver: string, errorId: number): Partial<Note>[] => {
  const notes: Partial<Note>[] = []
  const portalActionText = `${resolver}: Portal Action: Resolved Trigger. Code:`

  triggers.forEach((trigger) => {
    const noteText = `${portalActionText} ${trigger.shortTriggerCode}`

    notes.push({
      errorId,
      noteText,
      userId: "System"
    })
  })

  return notes
}

export default getSystemNotesForTriggers
