import { parseHearingOutcome } from "@moj-bichard7/common/aho/parseHearingOutcome"
import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"
import { readFileSync } from "fs"
import path from "path"
import type { DataSource, UpdateResult } from "typeorm"
import CourtCase from "../../src/services/entities/CourtCase"
import getDataSource from "../../src/services/getDataSource"
import updateCourtCaseAho from "../../src/services/updateCourtCaseAho"
import { isError } from "../../src/types/Result"
import { hearingOutcomeXml as dummyAhoXml } from "../test-data/AnnotatedHO1.json"
import deleteFromEntity from "../utils/deleteFromEntity"
import { getDummyCourtCase, insertCourtCases } from "../utils/insertCourtCases"

jest.setTimeout(60 * 60 * 1000)

const expectHearingOutcomeToMatchSnapshot = (
  courtCase: CourtCase | null | undefined,
  state: "Before update" | "After update"
) => {
  expect(courtCase?.hearingOutcome).toMatchSnapshot(`${state} (hearingOutcome XML)`)
  expect(courtCase?.updatedHearingOutcome).toMatchSnapshot(`${state} (updatedHearingOutcome XML)`)
  expect(courtCase?.hearingOutcomeJson).toMatchSnapshot(`${state} (hearingOutcome JSON)`)
  expect(courtCase?.updatedHearingOutcomeJson).toMatchSnapshot(`${state} (updatedHearingOutcome JSON)`)
}

const dummyPncUpdateDatasetXml = readFileSync(
  path.join(__dirname, "../test-data/AnnotatedPNCUpdateDataset.xml")
).toString()
const dummyAho = parseHearingOutcome(dummyAhoXml) as AnnotatedHearingOutcome
const dummyPncUpdateDataset = parseHearingOutcome(dummyPncUpdateDatasetXml) as PncUpdateDataset

describe("update court case updated hearing outcome", () => {
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

  describe("when message is AHO", () => {
    it("Should update the court case `updated_msg` and `updated_hearing_outcome` fields in the db", async () => {
      const inputCourtCase = await getDummyCourtCase({
        errorLockedByUsername: null,
        triggerLockedByUsername: null,
        errorCount: 1,
        errorStatus: "Unresolved",
        triggerCount: 1,
        phase: 1
      })

      await insertCourtCases(inputCourtCase)

      const courtCaseBeforeUpdate = await dataSource
        .getRepository(CourtCase)
        .findOne({ where: { errorId: inputCourtCase.errorId } })
      expectHearingOutcomeToMatchSnapshot(courtCaseBeforeUpdate, "Before update")

      const updateResult = (await updateCourtCaseAho(dataSource, inputCourtCase.errorId, dummyAho)) as UpdateResult

      expect(isError(updateResult)).toBe(false)
      expect(updateResult.raw).toHaveLength(1)
      expect(updateResult.affected).toBe(1)
      expect(updateResult.raw[0].user_updated_flag).toBe(1)

      const courtCaseAfterUpdate = await dataSource
        .getRepository(CourtCase)
        .findOne({ where: { errorId: inputCourtCase.errorId } })
      expectHearingOutcomeToMatchSnapshot(courtCaseAfterUpdate, "After update")
    })

    it("Should not update if the court case doesn't exist", async () => {
      const nonExistentErrorId = 2
      const updateResult = (await updateCourtCaseAho(dataSource, nonExistentErrorId, dummyAho)) as UpdateResult

      expect(isError(updateResult)).toBe(false)
      expect(updateResult.raw).toHaveLength(0)
      expect(updateResult.affected).toBe(0)
    })
  })

  describe("when message is PNC Update Dataset", () => {
    it("Should update the court case `updated_msg` and `updated_hearing_outcome` fields in the db", async () => {
      const inputCourtCase = await getDummyCourtCase({
        errorLockedByUsername: null,
        triggerLockedByUsername: null,
        errorCount: 1,
        errorStatus: "Unresolved",
        triggerCount: 1,
        phase: 1
      })

      await insertCourtCases(inputCourtCase)

      const courtCaseBeforeUpdate = await dataSource
        .getRepository(CourtCase)
        .findOne({ where: { errorId: inputCourtCase.errorId } })
      expectHearingOutcomeToMatchSnapshot(courtCaseBeforeUpdate, "Before update")

      const updateResult = (await updateCourtCaseAho(
        dataSource,
        inputCourtCase.errorId,
        dummyPncUpdateDataset
      )) as UpdateResult

      expect(isError(updateResult)).toBe(false)
      expect(updateResult.raw).toHaveLength(1)
      expect(updateResult.affected).toBe(1)
      expect(updateResult.raw[0].user_updated_flag).toBe(1)

      const courtCaseAfterUpdate = await dataSource
        .getRepository(CourtCase)
        .findOne({ where: { errorId: inputCourtCase.errorId } })
      expectHearingOutcomeToMatchSnapshot(courtCaseAfterUpdate, "After update")
    })

    it("Should not update if the court case doesn't exist", async () => {
      const nonExistentErrorId = 1
      const updateResult = (await updateCourtCaseAho(
        dataSource,
        nonExistentErrorId,
        dummyPncUpdateDataset
      )) as UpdateResult

      expect(isError(updateResult)).toBe(false)
      expect(updateResult.raw).toHaveLength(0)
      expect(updateResult.affected).toBe(0)
    })
  })
})
