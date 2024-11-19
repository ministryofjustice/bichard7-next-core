import type { DataSource, EntityManager } from "typeorm"

import { faker } from "@faker-js/faker"
import { subSeconds } from "date-fns"
import { countBy, sample } from "lodash"

import type Trigger from "../../src/services/entities/Trigger"

import Note from "../../src/services/entities/Note"

export default (
  dataSource: DataSource | EntityManager,
  caseId: number,
  triggers: Trigger[],
  isResolved: boolean
): Note[] => {
  const triggerCounts = countBy(triggers, (trigger) => trigger.triggerCode)
  const triggerCountsNote =
    "Trigger codes: " +
    Object.entries(triggerCounts)
      .map(([triggerCode, count]) => `${count} x ${triggerCode}`)
      .join(", ")

  const resolvedTriggerNotes = triggers
    .filter((trigger) => trigger.resolvedAt !== null)
    .map(
      (trigger) =>
        `${faker.person.firstName()}.${faker.person.lastName()}: Portal Action: Trigger Resolved. Code: ${
          trigger.triggerCode
        }`
    )

  const noteTexts = [triggerCountsNote, ...resolvedTriggerNotes]

  if (isResolved) {
    const reason = sample([
      "Updated remand(s) manually on the PNC",
      "Updated disposal(s) manually on the PNC",
      "PNC record already has accurate results"
    ])
    const reasonText = Math.random() > 0.5 ? faker.lorem.sentence() : ""
    noteTexts.push(
      `${faker.person.firstName()}.${faker.person.lastName()}: Portal Action: Record Manually Resolved. Reason: ${reason}. Reason Text:${reasonText}`
    )
  }

  return noteTexts.map((noteText) =>
    dataSource.getRepository(Note).create({
      createdAt: subSeconds(new Date(), Math.random() * 60 * 60 * 24 * 30),
      errorId: caseId,
      noteText,
      userId: `${faker.person.firstName().toLowerCase()}.${faker.person.lastName().toLowerCase()}`.slice(0, 31)
    })
  )
}
