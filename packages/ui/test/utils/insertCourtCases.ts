import type ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import { randomUUID } from "crypto"
import fs from "fs"
import type Note from "services/entities/Note"
import type Trigger from "services/entities/Trigger"
import type { ResolutionStatus } from "types/ResolutionStatus"
import CourtCase from "../../src/services/entities/CourtCase"
import getDataSource from "../../src/services/getDataSource"
import createAuditLogRecord from "../helpers/createAuditLogRecord"
import CustomExceptions from "../test-data/CustomExceptions.json"
import DummyMultipleOffencesAho from "../test-data/HO100102_1.json"
import DummyCustomOffences from "../test-data/HO100102_1_multiple_offences.json"
import DummyCourtCase from "./DummyCourtCase"
import { insertLockUsers } from "./insertLockUsers"
import insertManyIntoDynamoTable from "./insertManyIntoDynamoTable"
import { insertNoteUser } from "./insertNoteUser"

const getAnnotatedPncUpdateDatasetXml = () =>
  fs
    .readFileSync("../core/phase2/tests/fixtures/AnnotatedPncUpdateDataset-with-exception-and-post-update-trigger.xml")
    .toString()

const getAhoWithMultipleOffences = (offenceCount: number) => {
  const offenceXml = fs.readFileSync("test/test-data/offence.xml").toString()
  const offences = offenceXml.repeat(offenceCount)
  return DummyCustomOffences.hearingOutcomeXml.replace("{OFFENCES}", offences)
}

const getAhoWithCustomExceptions = (exceptions: Record<string, ExceptionCode>) => {
  const errorCount = Object.values(exceptions).filter((exception) => exception).length
  const hearingOutcome = CustomExceptions.hearingOutcomeXml
    .replace("{ARREST_SUMMONS_NUMBER_ERROR}", exceptions.asn ? `Error="${exceptions.asn}"` : "")
    .replace(
      "{OFFENCE_REASON_SEQUENCE_ERROR}",
      exceptions.offenceReasonSequence ? `Error="${exceptions.offenceReasonSequence}"` : ""
    )

  return {
    hearingOutcome: hearingOutcome,
    updatedHearingOutcome: hearingOutcome,
    errorCount
  }
}

const getDummyCourtCase = async (overrides?: Partial<CourtCase>): Promise<CourtCase> => {
  const hearingOutcome =
    overrides?.hearingOutcome ??
    (overrides?.phase === 2 ? getAnnotatedPncUpdateDatasetXml() : DummyMultipleOffencesAho.hearingOutcomeXml)

  return (await getDataSource()).getRepository(CourtCase).create({
    ...DummyCourtCase,
    hearingOutcome,
    errorCount: 1,
    errorReason: "HO100102",
    errorReport: "HO100102||ds:NextHearingDate",
    ...overrides
  } as CourtCase)
}

const insertCourtCases = async (courtCases: CourtCase | CourtCase[]): Promise<CourtCase[]> => {
  const dataSource = await getDataSource()

  const cases = await dataSource.getRepository(CourtCase).save(Array.isArray(courtCases) ? courtCases : [courtCases])

  const lockedCases = cases.filter((courtCase) => courtCase.errorLockedByUsername || courtCase.triggerLockedByUsername)
  const courtCaseNotes = cases
    .filter((courtcase) => courtcase.notes.length > 0)
    .map((courtCase) => courtCase.notes)
    .flat()

  lockedCases.map(async (courtCase) => await insertLockUsers(courtCase))
  courtCaseNotes.map(async (courtCaseNote) => await insertNoteUser(courtCaseNote))

  return cases
}

const insertCourtCasesWithFields = async (cases: Partial<CourtCase>[]) => {
  const existingCourtCases: CourtCase[] = []

  for (let index = 0; index < cases.length; index++) {
    existingCourtCases.push(
      await getDummyCourtCase({
        errorId: index,
        messageId: randomUUID(),
        ptiurn: "Case" + String(index).padStart(5, "0"),
        ...cases[index]
      })
    )
  }

  await insertManyIntoDynamoTable(existingCourtCases.map((courtCase) => createAuditLogRecord(courtCase)))

  return insertCourtCases(existingCourtCases)
}

const insertMultipleDummyCourtCases = async (numToInsert: number, orgCode: string, otherFields: Partial<CourtCase>) => {
  return insertCourtCasesWithFields(
    Array.from(Array(numToInsert)).map((_, index) => ({
      orgForPoliceFilter: orgCode,
      defendantName: `Defendant Name ${index}`,
      ...(otherFields || {})
    }))
  )
}

const insertDummyCourtCasesWithNotes = async (
  caseNotes: { user: string; text: string; createdAt?: Date }[][],
  orgCode: string
) => {
  return insertCourtCasesWithFields(
    caseNotes.map((notes, index) => ({
      orgForPoliceFilter: orgCode,
      notes: notes.map(
        (note, _) =>
          ({
            createdAt: note.createdAt ?? new Date(),
            noteText: note.text,
            userId: note.user,
            errorId: index
          }) as unknown as Note
      )
    }))
  )
}

const insertDummyCourtCasesWithNotesAndLock = async (
  caseNotes: { user: string; text: string; createdAt?: Date }[][],
  orgCode: string
) => {
  return insertCourtCasesWithFields(
    caseNotes.map((notes, index) => ({
      orgForPoliceFilter: orgCode,
      errorLockedByUsername: "BichardForce03",
      triggerLockedByUsername: "BichardForce03",
      notes: notes.map(
        (note, _) =>
          ({
            createdAt: note.createdAt ?? new Date(),
            noteText: note.text,
            userId: note.user,
            errorId: index
          }) as unknown as Note
      )
    }))
  )
}

const insertDummyCourtCasesWithTriggers = async (
  caseTriggers: { code: string; status: ResolutionStatus }[][],
  orgCode: string,
  triggerLockedByUsername?: string
) => {
  return insertCourtCasesWithFields(
    caseTriggers.map((triggers, index) => ({
      orgForPoliceFilter: orgCode,
      triggerLockedByUsername,
      triggerCount: triggers.length,
      triggerReason: triggers[0].code,
      triggerStatus: triggers.some((trigger) => trigger.status === "Unresolved") ? "Unresolved" : "Resolved",
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
  getAhoWithCustomExceptions,
  getAhoWithMultipleOffences,
  getDummyCourtCase,
  insertCourtCases,
  insertCourtCasesWithFields,
  insertDummyCourtCasesWithNotes,
  insertDummyCourtCasesWithNotesAndLock,
  insertDummyCourtCasesWithTriggers,
  insertMultipleDummyCourtCases
}
