import type { Case } from "@moj-bichard7/common/types/Case"
import type { Note } from "@moj-bichard7/common/types/Note"

import { isError } from "@moj-bichard7/common/types/Result"

import { createCase } from "../../../tests/helpers/caseHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"
import fetchNotes from "./fetchNotes"
import insertNotes from "./insertNotes"

const testDatabaseGateway = new End2EndPostgres()

let caseObj: Case

describe("insertNotes", () => {
  beforeEach(async () => {
    await testDatabaseGateway.clearDb()

    caseObj = await createCase(testDatabaseGateway)
  })

  afterAll(async () => {
    await testDatabaseGateway.close()
  })

  it("Inserts one note successfully", async () => {
    const testNotes = ["Note1"]
    const userId = "testUser"

    const result = await insertNotes(testDatabaseGateway.writable, testNotes, userId, caseObj.errorId)

    expect(isError(result)).toBe(false)

    const insertedNotes = (await fetchNotes(testDatabaseGateway.readonly, [caseObj.errorId])) as Note[]

    const createdAt = new Date().toISOString().split("T")[0]

    expect(insertedNotes).toHaveLength(1)
    expect(insertedNotes[0].noteText).toBe(testNotes[0])
    expect(insertedNotes[0].userId).toBe(userId)
    expect(insertedNotes[0].errorId).toBe(caseObj.errorId)
    expect(insertedNotes[0].createdAt.toISOString().split("T")[0]).toBe(createdAt)
  })

  it("Inserts multiple notes successfully", async () => {
    const testNotes = ["Note1", "Note2"]
    const userId = "testUser"

    const result = await insertNotes(testDatabaseGateway.writable, testNotes, userId, caseObj.errorId)

    expect(isError(result)).toBe(false)

    const insertedNotes = (await fetchNotes(testDatabaseGateway.readonly, [caseObj.errorId])) as Note[]

    const createdAt = new Date().toISOString().split("T")[0]

    expect(insertedNotes).toHaveLength(2)
    expect(insertedNotes[0].noteText).toBe(testNotes[0])
    expect(insertedNotes[0].userId).toBe(userId)
    expect(insertedNotes[0].errorId).toBe(caseObj.errorId)
    expect(insertedNotes[0].createdAt.toISOString().split("T")[0]).toBe(createdAt)

    expect(insertedNotes[1].noteText).toBe(testNotes[1])
    expect(insertedNotes[1].userId).toBe(userId)
    expect(insertedNotes[1].errorId).toBe(caseObj.errorId)
    expect(insertedNotes[1].createdAt.toISOString().split("T")[0]).toBe(createdAt)

    expect(insertedNotes[0].createdAt.getTime()).toBe(insertedNotes[1].createdAt.getTime())
  })

  it("Handles empty note array", async () => {
    const testNotes: string[] = []
    const userId = "testUser"

    const result = await insertNotes(testDatabaseGateway.writable, testNotes, userId, caseObj.errorId)

    expect(isError(result)).toBe(false)

    const insertedNotes = (await fetchNotes(testDatabaseGateway.readonly, [caseObj.errorId])) as Note[]

    expect(insertedNotes).toHaveLength(0)
  })

  it("returns error when note couldn't be inserted due to caseId not existing", async () => {
    const caseId = 123
    const testNotes = ["This is a test note"]
    const userId = "testUser"

    const result = await insertNotes(testDatabaseGateway.writable, testNotes, userId, caseId)

    expect(isError(result)).toBe(true)
    expect((result as Error).message).toContain("Couldn't insert notes for case id:123")
  })
})
