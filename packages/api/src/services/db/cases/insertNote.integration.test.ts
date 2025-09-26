import type { Case } from "@moj-bichard7/common/types/Case"
import type { Note } from "@moj-bichard7/common/types/Note"

import { isError } from "@moj-bichard7/common/types/Result"

import { createCase } from "../../../tests/helpers/caseHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"
import fetchNotes from "./fetchNotes"
import insertNote from "./insertNote"

const testDatabaseGateway = new End2EndPostgres()

let caseObj: Case

describe("createNote", () => {
  beforeEach(async () => {
    await testDatabaseGateway.clearDb()

    caseObj = await createCase(testDatabaseGateway)
  })

  afterAll(async () => {
    await testDatabaseGateway.close()
  })

  it("Inserts note successfully", async () => {
    const testNote = "This is a test note"
    const userId = "testUser"

    const result = await insertNote(testDatabaseGateway.writable, caseObj.errorId, testNote, userId)
    console.log(result)

    expect(isError(result)).toBe(false)
    expect(result).toBe(true)

    const insertedNotes = (await fetchNotes(testDatabaseGateway.readonly, [caseObj.errorId])) as Note[]
    console.log(insertedNotes[0])

    console.log(typeof insertedNotes[0].userId)

    expect(insertedNotes[0].noteText).toBe(testNote)
    expect(insertedNotes[0].userId).toBe(userId)
    expect(insertedNotes[0].errorId).toBe(caseObj.errorId)
    expect(insertedNotes[0].createdAt.toISOString().split("T")[0]).toBe(new Date().toISOString().split("T")[0])
  })

  it("returns error when note couldn't be inserted", async () => {
    const caseId = 123
    const testNote = "This is a test note"
    const userId = "testUser"

    const result = await insertNote(testDatabaseGateway.writable, caseId, testNote, userId)

    expect(isError(result)).toBe(true)
    expect((result as Error).message).toContain("Couldn't insert note for case id:123")
  })
})
