import type { DataSource } from "typeorm"

import CourtCase from "../../src/services/entities/CourtCase"
import getCourtCase from "../../src/services/getCourtCase"
import getDataSource from "../../src/services/getDataSource"
import { isError } from "../../src/types/Result"
import deleteFromEntity from "../utils/deleteFromEntity"
import { getDummyCourtCase, insertCourtCases } from "../utils/insertCourtCases"

jest.setTimeout(60 * 60 * 1000)

describe("get court case", () => {
  let dataSource: DataSource

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromEntity(CourtCase)
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  it("Should amend the court case", async () => {
    const inputCourtCase = await getDummyCourtCase({
      errorCount: 1,
      errorLockedByUsername: null,
      errorStatus: "Unresolved",
      phase: 1,
      triggerCount: 1,
      triggerLockedByUsername: null
    })

    await insertCourtCases(inputCourtCase)

    expect(inputCourtCase.updatedHearingOutcome).toBeNull()

    const result = await getCourtCase(dataSource, inputCourtCase.errorId)
    expect(isError(result)).toBe(false)

    expect(result).toStrictEqual(inputCourtCase)
  })

  it("Should return null if the court case doesn't exist", async () => {
    const inputCourtCase = await getDummyCourtCase({
      errorCount: 1,
      errorLockedByUsername: null,
      errorStatus: "Unresolved",
      phase: 1,
      triggerCount: 1,
      triggerLockedByUsername: null
    })
    const result = await getCourtCase(dataSource, inputCourtCase.errorId)

    expect(result).toBeNull()
  })
})
