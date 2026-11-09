import type { Sql } from "postgres"

import createDbConfig from "@moj-bichard7/common/db/createDbConfig"
import { isError } from "@moj-bichard7/common/types/Result"
import postgres from "postgres"

import type ONSPostcodeMapping from "../../types/ONSPostcodeMapping"

import getPoliceForceAreaCode from "./getPoliceForceAreaCode"

const dbConfig = createDbConfig()
const db = postgres({
  ...dbConfig,
  types: {
    date: {
      to: 25,
      from: [1082],
      serialize: (x: string): string => x,
      parse: (x: string): Date => {
        return new Date(x)
      }
    }
  }
})

const record1: ONSPostcodeMapping = { postcode: "SW1A 1AA", police_force_area: "E2300001" }
const record2: ONSPostcodeMapping = { postcode: "M1 1AE", police_force_area: "E2300005" }

describe("getPoliceForceAreaCode", () => {
  beforeAll(async () => {
    await db<ONSPostcodeMapping[]>`INSERT INTO br7own.ons_postcode_mappings ${db([record1, record2])}`
  })

  afterAll(async () => {
    await db`DELETE FROM br7own.ons_postcode_mappings`
    await db.end()
  })

  it("returns correct postcode mapping", async () => {
    const result = await getPoliceForceAreaCode(db, record1.postcode)
    expect(isError(result)).toBe(false)
    expect(result).toEqual(record1)
  })

  it("returns an error if supplied postcode doesn't exist in the mapping table", async () => {
    const result = await getPoliceForceAreaCode(db, "invalid")
    expect(isError(result)).toBe(true)
    expect((result as Error).message).toBe("No postcode mapping found for postcode invalid")
  })

  it("returns an error when postcode casing does not match", async () => {
    const result = await getPoliceForceAreaCode(db, "sw1a 1aa")

    expect(isError(result)).toBe(true)
    expect((result as Error).message).toBe("No postcode mapping found for postcode sw1a 1aa")
  })

  it("returns an error when an empty postcode is supplied", async () => {
    const result = await getPoliceForceAreaCode(db, "")

    expect(isError(result)).toBe(true)
    expect((result as Error).message).toBe("No postcode mapping found for postcode ")
  })

  it("handles errors", async () => {
    const errorMessage = "Database error"
    const mockedDb = jest.fn().mockRejectedValue(new Error("Database error")) as unknown as Sql

    const result = await getPoliceForceAreaCode(mockedDb, "SW1A 1AA")

    expect(isError(result)).toBe(true)
    expect((result as Error).message).toBe(errorMessage)
  })
})
