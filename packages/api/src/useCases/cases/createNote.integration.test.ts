import { isError } from "@moj-bichard7/common/types/Result"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"

import { createCase } from "../../tests/helpers/caseHelper"
import { createUser } from "../../tests/helpers/userHelper"
import End2EndPostgres from "../../tests/testGateways/e2ePostgres"
import { NotFoundError } from "../../types/errors/NotFoundError"
import createNote from "./createNote"

describe("createNote", () => {
  const testDatabaseGateway = new End2EndPostgres()

  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await testDatabaseGateway.close()
  })

  it("returns NotFoundError if the user has no visible courts or visible forces in common with the case", async () => {
    const user = await createUser(testDatabaseGateway, {
      groups: [UserGroup.Supervisor],
      visibleCourts: ["DEF"],
      visibleForces: ["02"]
    })

    const caseObj = await createCase(testDatabaseGateway, {})

    const noteText = "This is a short test note."
    const result = await createNote(testDatabaseGateway.writable, user, caseObj.errorId, noteText)

    expect(isError(result)).toBe(true)
    expect(result).toBeInstanceOf(NotFoundError)
  })

  it("returns NotFoundError if the case does not exist", async () => {
    const user = await createUser(testDatabaseGateway, {
      groups: [UserGroup.Supervisor],
      visibleForces: ["01"]
    })

    const result = await createNote(testDatabaseGateway.writable, user, 999, "This is a test note")

    expect(isError(result)).toBe(true)
    expect(result).toBeInstanceOf(NotFoundError)
  })

  it("successfully creates a single note for an existing case", async () => {
    const user = await createUser(testDatabaseGateway, {
      groups: [UserGroup.Supervisor],
      username: "test_supervisor",
      visibleForces: ["01"]
    })

    const caseObj = await createCase(testDatabaseGateway, {})
    const noteText = "This is a short test note."

    const result = await createNote(testDatabaseGateway.writable, user, caseObj.errorId, noteText)

    expect(isError(result)).toBe(false)

    const updatedNotes = await testDatabaseGateway.writable
      .connection`SELECT * FROM br7own.error_list_notes WHERE error_id = ${caseObj.errorId}`

    expect(updatedNotes).toHaveLength(1)
    expect(updatedNotes[0].note_text).toBe(noteText)
    expect(updatedNotes[0].user_id).toBe(user.username)
  })

  it("splits a note exceeding 2000 characters and saves as multiple notes", async () => {
    const user = await createUser(testDatabaseGateway, {
      groups: [UserGroup.GeneralHandler],
      username: "test_handler",
      visibleForces: ["01"]
    })

    const caseObj = await createCase(testDatabaseGateway, {})

    // Create a string of 4500 characters
    const longNoteText = "A".repeat(4500)

    const result = await createNote(testDatabaseGateway.writable, user, caseObj.errorId, longNoteText)

    expect(isError(result)).toBe(false)

    const updatedNotes = await testDatabaseGateway.writable
      .connection`SELECT * FROM br7own.error_list_notes WHERE error_id = ${caseObj.errorId} ORDER BY note_id ASC`

    expect(updatedNotes).toHaveLength(3) // 2000 + 2000 + 500 = 4500

    expect(updatedNotes[0].note_text).toHaveLength(2000)
    expect(updatedNotes[0].note_text).toBe("A".repeat(2000))

    expect(updatedNotes[1].note_text).toHaveLength(2000)
    expect(updatedNotes[1].note_text).toBe("A".repeat(2000))

    expect(updatedNotes[2].note_text).toHaveLength(500)
    expect(updatedNotes[2].note_text).toBe("A".repeat(500))
  })
})
