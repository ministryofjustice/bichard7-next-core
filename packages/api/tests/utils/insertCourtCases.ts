/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import fs from "fs"
import CourtCase from "src/services/entities/CourtCase"
import type Note from "src/services/entities/Note"
import type Trigger from "src/services/entities/Trigger"
import getDataSource from "src/services/getDataSource"
import type { ResolutionStatus } from "src/types/ResolutionStatus"
import DummyCourtCase from "tests/utils/DummyCourtCase"

const getDummyCourtCase = async (overrides?: Partial<CourtCase>): Promise<CourtCase> =>
  (await getDataSource()).getRepository(CourtCase).create({
    ...DummyCourtCase,
    hearingOutcome: fs.readFileSync("tests/test-data/HO100102_1.xml"),
    ...overrides
  } as CourtCase)

const insertCourtCases = async (courtCases: CourtCase | CourtCase[]): Promise<CourtCase[]> =>
  (await getDataSource()).getRepository(CourtCase).save(Array.isArray(courtCases) ? courtCases : [courtCases])

const insertCourtCasesWithFields = async (cases: Partial<CourtCase>[]) => {
  const existingCourtCases: CourtCase[] = []
  for (let index = 0; index < cases.length; index++) {
    existingCourtCases.push(
      await getDummyCourtCase({
        errorId: index,
        messageId: String(index).padStart(5, "x"),
        ptiurn: "Case" + String(index).padStart(5, "0"),
        ...cases[index]
      })
    )
  }

  return insertCourtCases(existingCourtCases)
}

const insertMultipleDummyCourtCases = (numToInsert: number, orgCode: string) => {
  return insertCourtCasesWithFields(
    Array.from(Array(numToInsert)).map((_, index) => ({
      orgForPoliceFilter: orgCode,
      defendantName: `Defendant Name ${index}`
    }))
  )
}

const insertDummyCourtCasesWithNotes = (caseNotes: { user: string; text: string }[][], orgCode: string) => {
  return insertCourtCasesWithFields(
    caseNotes.map((notes, index) => ({
      orgForPoliceFilter: orgCode,
      notes: notes.map(
        (note, _) =>
          ({
            createdAt: new Date(),
            noteText: note.text,
            userId: note.user,
            errorId: index
          }) as unknown as Note
      )
    }))
  )
}

const insertDummyCourtCasesWithTriggers = (
  caseTriggers: { code: string; status: ResolutionStatus }[][],
  orgCode: string
) => {
  return insertCourtCasesWithFields(
    caseTriggers.map((triggers, index) => ({
      orgForPoliceFilter: orgCode,
      triggers: triggers.map(
        (trigger, _) =>
          ({
            createdAt: new Date(),
            triggerCode: trigger.code,
            errorId: index,
            status: trigger.status
          }) as unknown as Trigger
      )
    }))
  )
}

export {
  getDummyCourtCase,
  insertCourtCases,
  insertCourtCasesWithFields,
  insertDummyCourtCasesWithNotes,
  insertDummyCourtCasesWithTriggers,
  insertMultipleDummyCourtCases
}
