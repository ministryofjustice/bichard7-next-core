import { subDays } from "date-fns"
import fs from "fs"
import CourtCase from "../src/services/entities/CourtCase"
import { default as Note, default as Trigger } from "../src/services/entities/Trigger"
import getDataSource from "../src/services/getDataSource"
import createAuditLogRecord from "../test/helpers/createAuditLogRecord"
import createDummyCase from "../test/helpers/createDummyCase"
import deleteFromEntity from "../test/utils/deleteFromEntity"
import { insertLockUsers } from "../test/utils/insertLockUsers"
import insertManyIntoDynamoTable from "../test/utils/insertManyIntoDynamoTable"
import { insertNoteUser } from "../test/utils/insertNoteUser"

if (process.env.DEPLOY_NAME !== "e2e-test") {
  console.error("Not running in e2e environment, bailing out. Set DEPLOY_NAME='e2e-test' if you're sure.")
  process.exit(1)
}

const minCases = 500
const maxCases = 1_000
const forceId = process.env.FORCE_ID || "01"
const maxCaseAge = -12 * 30

const numCasesRange = maxCases - minCases
const numCases = Math.round(Math.random() * numCasesRange) + minCases

const ahoXml = fs.readFileSync("test/test-data/AnnotatedHOTemplate.xml").toString()

console.log(`Seeding ${numCases} cases for force ID ${forceId}`)

getDataSource().then(async (dataSource) => {
  const entitiesToClear = [CourtCase, Trigger, Note]
  const auditLogs: Record<string, unknown>[] = []
  await Promise.all(entitiesToClear.map((entity) => deleteFromEntity(entity)))

  const courtCases = await Promise.all(
    new Array(numCases).fill(0).map(async (_, idx) => {
      const courtCase = await createDummyCase(dataSource, idx, forceId, ahoXml, subDays(new Date(), maxCaseAge))
      auditLogs.push(createAuditLogRecord(courtCase))
      return courtCase
    })
  )

  const courtCaseNotes = courtCases
    .filter((courtcase) => courtcase.notes.length > 0)
    .map((courtCase) => courtCase.notes)
    .flat()

  await Promise.all(courtCases.map((courtCase) => insertLockUsers(courtCase, true)))
  await Promise.all(courtCaseNotes.map((courtCaseNote) => insertNoteUser(courtCaseNote)))

  await insertManyIntoDynamoTable(auditLogs)
})

export {}
