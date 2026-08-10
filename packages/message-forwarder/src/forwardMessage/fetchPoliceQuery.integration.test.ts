import "../test/setup/setEnvironmentVariables"

import createDbConfig from "@moj-bichard7/common/db/createDbConfig"
import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type { PoliceQueryResult } from "@moj-bichard7/common/types/PoliceQueryResult"
import { isError } from "@moj-bichard7/common/types/Result"
import { randomUUID } from "crypto"
import type { Sql } from "postgres"
import postgres from "postgres"
import { clearTables, generateAho, insertCase } from "../test/setup/database"
import fetchPoliceQuery from "./fetchPoliceQuery"

const dbConfig = createDbConfig()

describe("fetchPoliceQuery", () => {
  const db = postgres(dbConfig)

  beforeEach(async () => {
    await clearTables(db)
  })

  afterAll(async () => {
    await db.end()
  })

  it("should return police query when hearing outcome JSON column has value", async () => {
    const aho = generateAho()
    aho.PncQuery!.checkName = "JSON COLUMN"
    const messageId = randomUUID()
    await insertCase(db, {
      message_id: messageId,
      hearing_outcome: aho as unknown as AnnotatedHearingOutcome
    })

    const policeQueryResult = await fetchPoliceQuery(db, messageId)

    expect(isError(policeQueryResult)).toBe(false)
    expect((policeQueryResult as PoliceQueryResult).checkName).toBe("JSON COLUMN")
  })

  it("should return null when hearing outcome JSON column is null", async () => {
    const messageId = randomUUID()
    await insertCase(db, {
      message_id: messageId,
      hearing_outcome: null
    })

    const policeQueryResult = await fetchPoliceQuery(db, messageId)

    expect(isError(policeQueryResult)).toBe(false)
    expect(policeQueryResult).toBeUndefined()
  })

  it("should return undefined when hearing outcome JSON column is null", async () => {
    const messageId = randomUUID()
    await insertCase(db, {
      message_id: messageId,
      hearing_outcome: null
    })

    const policeQueryResult = await fetchPoliceQuery(db, messageId)

    expect(isError(policeQueryResult)).toBe(false)
    expect(policeQueryResult).toBeUndefined()
  })

  it("should return undefined when police query in hearing outcome JSON column is not set", async () => {
    const aho = { ...generateAho(), PncQuery: undefined }
    const messageId = randomUUID()
    await insertCase(db, {
      message_id: messageId,
      hearing_outcome: aho as unknown as AnnotatedHearingOutcome
    })

    const policeQueryResult = await fetchPoliceQuery(db, messageId)

    expect(isError(policeQueryResult)).toBe(false)
    expect(policeQueryResult).toBeUndefined()
  })

  it("should return error when message ID doesn't exist in the database", async () => {
    const messageId = randomUUID()

    const policeQueryResult = await fetchPoliceQuery(db, messageId)

    expect(isError(policeQueryResult)).toBe(true)
    expect((policeQueryResult as Error).message).toBe(`Case with message ID ${messageId} not found in the database`)
  })

  it("should return error when there is a database error", async () => {
    const fakeDb = jest.fn().mockRejectedValue(Error("Dummy database error"))
    const messageId = randomUUID()

    const policeQueryResult = await fetchPoliceQuery(fakeDb as unknown as Sql, messageId)

    expect(isError(policeQueryResult)).toBe(true)
    expect((policeQueryResult as Error).message).toBe("Dummy database error")
  })

  it("should return an error when database result does not match the schema", async () => {
    const fakeDb = jest.fn().mockResolvedValue({ hearing_outcome: { dummy: "invalid schema" } })
    const messageId = randomUUID()

    const policeQueryResult = await fetchPoliceQuery(fakeDb as unknown as Sql, messageId)

    expect(isError(policeQueryResult)).toBe(true)
    expect((policeQueryResult as Error).message).toBe("Schema validation failed for error_list SELECT query")
  })
})
