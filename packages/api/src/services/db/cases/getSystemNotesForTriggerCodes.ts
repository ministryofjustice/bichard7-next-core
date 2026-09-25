import getShortTriggerCode from "@moj-bichard7/common/utils/getShortTriggerCode"

const getSystemNotesForTriggerCodes = (triggerCodes: string[], resolver: string): string[] => {
  const notes: string[] = []
  const portalActionText = `${resolver}: Portal Action: Resolved Trigger. Code:`

  triggerCodes.forEach((triggerCode) => {
    const shortCode = getShortTriggerCode(triggerCode)
    const noteText = `${portalActionText} ${shortCode}`

    notes.push(noteText)
  })

  return notes
}

export default getSystemNotesForTriggerCodes
