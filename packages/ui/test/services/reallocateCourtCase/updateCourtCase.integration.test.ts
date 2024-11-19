import type { AnnotatedHearingOutcome } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import type { DataSource, UpdateResult } from "typeorm"

import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { randomUUID } from "crypto"
import MockDate from "mockdate"
import { UpdateQueryBuilder } from "typeorm"

import type { ResolutionStatus } from "../../../src/types/ResolutionStatus"

import CourtCase from "../../../src/services/entities/CourtCase"
import Trigger from "../../../src/services/entities/Trigger"
import getDataSource from "../../../src/services/getDataSource"
import updateCourtCase from "../../../src/services/reallocateCourtCase/updateCourtCase"
import { isError } from "../../../src/types/Result"
import deleteFromDynamoTable from "../../utils/deleteFromDynamoTable"
import deleteFromEntity from "../../utils/deleteFromEntity"
import { insertCourtCasesWithFields } from "../../utils/insertCourtCases"
import { insertTriggers } from "../../utils/manageTriggers"

const getAho = (
  asn: null | string = "a".repeat(50),
  ptiurn: null | string = "b".repeat(50),
  secondLevelCode: null | string = "AB",
  thirdLevelCode: null | string = "12"
) =>
  ({
    AnnotatedHearingOutcome: {
      HearingOutcome: {
        Case: {
          ForceOwner: {
            SecondLevelCode: secondLevelCode,
            ThirdLevelCode: thirdLevelCode
          },
          HearingDefendant: {
            ArrestSummonsNumber: asn
          },
          PTIURN: ptiurn
        }
      }
    }
  }) as unknown as AnnotatedHearingOutcome

const insertCourtCase = async (fields: Partial<CourtCase> = {}) => {
  const existingCourtCasesDbObject: Partial<CourtCase> = {
    asn: "dummyAsn",
    courtDate: new Date("2008-09-25"),
    errorId: 0,
    messageId: randomUUID(),
    orgForPoliceFilter: "123456",
    ptiurn: "dummyPtiurn",
    resolutionTimestamp: null,
    triggerCount: 0,
    triggerInsertedTimestamp: null,
    triggerQualityChecked: null,
    triggerReason: null,
    triggerResolvedBy: null,
    triggerResolvedTimestamp: null,
    triggerStatus: null,
    ...fields
  }

  const courtCases = await insertCourtCasesWithFields([existingCourtCasesDbObject])
  if (isError(courtCases)) {
    throw courtCases
  }

  return courtCases[0]
}

const addTriggers = async (courtCaseId: number, triggers: { code: TriggerCode; status: ResolutionStatus }[]) => {
  await insertTriggers(
    courtCaseId,
    triggers.map((trigger, index) => ({
      createdAt: new Date(),
      status: trigger.status,
      triggerCode: trigger.code,
      triggerId: index
    }))
  )
}

describe("updateCourtCase", () => {
  let dataSource: DataSource
  const timestamp = new Date().toISOString()

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    MockDate.set(timestamp)
    await deleteFromDynamoTable("auditLogTable", "messageId")
    await deleteFromDynamoTable("auditLogEventsTable", "_id")
    await deleteFromEntity(Trigger)
    await deleteFromEntity(CourtCase)
  }, 20_000)

  afterAll(async () => {
    MockDate.reset()
    await dataSource.destroy()
  })

  test.each([
    {
      asn: "a".repeat(50),
      description: "should truncate asn and ptiurn when string values are too long",
      errorStatus: "Resolved",
      expectedAsn: "a".repeat(21),
      expectedOrgForPoliceFilter: "12AB  ",
      expectedPtiurn: "b".repeat(11),
      expectedResolutionTimestamp: undefined,
      expectedTriggerCount: 0,
      expectedTriggerInsertedTimestamp: undefined,
      expectedTriggerQualityChecked: null,
      expectedTriggerReason: null,
      expectedTriggerResolvedBy: null,
      expectedTriggerResolvedTimestamp: undefined,
      expectedTriggerStatus: null,
      hasAddedOrDeletedTriggers: false,
      ptiurn: "b".repeat(50),
      secondLevelCode: "12",
      thirdLevelCode: "AB",
      triggers: []
    },
    {
      asn: "a".repeat(50),
      description: [
        "should not include force third level code in orgForPoliceFilter when third level code is 00",
        "should not update court case when no triggers have been added or deleted"
      ],
      errorStatus: "Resolved",
      expectedAsn: "a".repeat(21),
      expectedOrgForPoliceFilter: "12    ",
      expectedPtiurn: "b".repeat(11),
      expectedResolutionTimestamp: undefined,
      expectedTriggerCount: 0,
      expectedTriggerInsertedTimestamp: undefined,
      expectedTriggerQualityChecked: null,
      expectedTriggerReason: null,
      expectedTriggerResolvedBy: null,
      expectedTriggerResolvedTimestamp: undefined,
      expectedTriggerStatus: null,
      hasAddedOrDeletedTriggers: false,
      ptiurn: "b".repeat(50),
      secondLevelCode: "12",
      thirdLevelCode: "00",
      triggers: []
    },
    {
      asn: "a".repeat(50),
      description: "should set resolution timestamp when there are no triggers and exceptions",
      errorStatus: null,
      expectedAsn: "a".repeat(21),
      expectedOrgForPoliceFilter: "12AB  ",
      expectedPtiurn: "b".repeat(11),
      expectedResolutionTimestamp: timestamp,
      expectedTriggerCount: 0,
      expectedTriggerInsertedTimestamp: undefined,
      expectedTriggerQualityChecked: null,
      expectedTriggerReason: null,
      expectedTriggerResolvedBy: null,
      expectedTriggerResolvedTimestamp: undefined,
      expectedTriggerStatus: null,
      hasAddedOrDeletedTriggers: true,
      ptiurn: "b".repeat(50),
      secondLevelCode: "12",
      thirdLevelCode: "AB",
      triggers: []
    },
    {
      asn: "a".repeat(50),
      description: "should set resolution timestamp when there are no triggers and exceptions are resolved",
      errorStatus: "Resolved",
      expectedAsn: "a".repeat(21),
      expectedOrgForPoliceFilter: "12AB  ",
      expectedPtiurn: "b".repeat(11),
      expectedResolutionTimestamp: timestamp,
      expectedTriggerCount: 0,
      expectedTriggerInsertedTimestamp: undefined,
      expectedTriggerQualityChecked: null,
      expectedTriggerReason: null,
      expectedTriggerResolvedBy: null,
      expectedTriggerResolvedTimestamp: undefined,
      expectedTriggerStatus: null,
      hasAddedOrDeletedTriggers: true,
      ptiurn: "b".repeat(50),
      secondLevelCode: "12",
      thirdLevelCode: "AB",
      triggers: []
    },
    {
      asn: "a".repeat(50),
      description: "should not set resolution timestamp when there are no triggers and unresolved exceptions",
      errorStatus: "Unresolved",
      expectedAsn: "a".repeat(21),
      expectedOrgForPoliceFilter: "12AB  ",
      expectedPtiurn: "b".repeat(11),
      expectedResolutionTimestamp: undefined,
      expectedTriggerCount: 0,
      expectedTriggerInsertedTimestamp: undefined,
      expectedTriggerQualityChecked: null,
      expectedTriggerReason: null,
      expectedTriggerResolvedBy: null,
      expectedTriggerResolvedTimestamp: undefined,
      expectedTriggerStatus: null,
      hasAddedOrDeletedTriggers: true,
      ptiurn: "b".repeat(50),
      secondLevelCode: "12",
      thirdLevelCode: "AB",
      triggers: []
    },
    {
      asn: "a".repeat(50),
      description:
        "should set resolution timestamp and trigger fields when all triggers are resolved and there are no exceptions",
      errorStatus: null,
      expectedAsn: "a".repeat(21),
      expectedOrgForPoliceFilter: "12AB  ",
      expectedPtiurn: "b".repeat(11),
      expectedResolutionTimestamp: timestamp,
      expectedTriggerCount: 2,
      expectedTriggerInsertedTimestamp: undefined,
      expectedTriggerQualityChecked: 1,
      expectedTriggerReason: TriggerCode.TRPR0001,
      expectedTriggerResolvedBy: "System",
      expectedTriggerResolvedTimestamp: timestamp,
      expectedTriggerStatus: "Resolved",
      hasAddedOrDeletedTriggers: true,
      ptiurn: "b".repeat(50),
      secondLevelCode: "12",
      thirdLevelCode: "AB",
      triggers: [
        { code: TriggerCode.TRPR0001, status: "Resolved" },
        { code: TriggerCode.TRPR0002, status: "Resolved" }
      ]
    },
    {
      asn: "a".repeat(50),
      description: "should set resolution timestamp and trigger fields when all triggers and exceptions are resolved",
      errorStatus: "Resolved",
      expectedAsn: "a".repeat(21),
      expectedOrgForPoliceFilter: "12AB  ",
      expectedPtiurn: "b".repeat(11),
      expectedResolutionTimestamp: timestamp,
      expectedTriggerCount: 2,
      expectedTriggerInsertedTimestamp: undefined,
      expectedTriggerQualityChecked: 1,
      expectedTriggerReason: TriggerCode.TRPR0001,
      expectedTriggerResolvedBy: "System",
      expectedTriggerResolvedTimestamp: timestamp,
      expectedTriggerStatus: "Resolved",
      hasAddedOrDeletedTriggers: true,
      ptiurn: "b".repeat(50),
      secondLevelCode: "12",
      thirdLevelCode: "AB",
      triggers: [
        { code: TriggerCode.TRPR0001, status: "Resolved" },
        { code: TriggerCode.TRPR0002, status: "Resolved" }
      ]
    },
    {
      asn: "a".repeat(50),
      description:
        "should set trigger fields but not resolution timestamp when all triggers are resolved but exceptions are unresolved",
      errorStatus: "Unresolved",
      expectedAsn: "a".repeat(21),
      expectedOrgForPoliceFilter: "12AB  ",
      expectedPtiurn: "b".repeat(11),
      expectedResolutionTimestamp: undefined,
      expectedTriggerCount: 2,
      expectedTriggerInsertedTimestamp: undefined,
      expectedTriggerQualityChecked: 1,
      expectedTriggerReason: TriggerCode.TRPR0001,
      expectedTriggerResolvedBy: "System",
      expectedTriggerResolvedTimestamp: timestamp,
      expectedTriggerStatus: "Resolved",
      hasAddedOrDeletedTriggers: true,
      ptiurn: "b".repeat(50),
      secondLevelCode: "12",
      thirdLevelCode: "AB",
      triggers: [
        { code: TriggerCode.TRPR0001, status: "Resolved" },
        { code: TriggerCode.TRPR0002, status: "Resolved" }
      ]
    },
    {
      asn: "a".repeat(50),
      description: "should set trigger fields when some triggers are resolved",
      errorStatus: null,
      expectedAsn: "a".repeat(21),
      expectedOrgForPoliceFilter: "12AB  ",
      expectedPtiurn: "b".repeat(11),
      expectedResolutionTimestamp: undefined,
      expectedTriggerCount: 3,
      expectedTriggerInsertedTimestamp: timestamp,
      expectedTriggerQualityChecked: 1,
      expectedTriggerReason: TriggerCode.TRPR0005,
      expectedTriggerResolvedBy: null,
      expectedTriggerResolvedTimestamp: undefined,
      expectedTriggerStatus: "Unresolved",
      hasAddedOrDeletedTriggers: true,
      ptiurn: "b".repeat(50),
      secondLevelCode: "12",
      thirdLevelCode: "AB",
      triggers: [
        { code: TriggerCode.TRPR0005, status: "Resolved" },
        { code: TriggerCode.TRPR0004, status: "Unresolved" },
        { code: TriggerCode.TRPR0004, status: "Unresolved" }
      ]
    }
  ])(
    "$description",
    async ({
      asn,
      errorStatus,
      expectedAsn,
      expectedOrgForPoliceFilter,
      expectedPtiurn,
      expectedResolutionTimestamp,
      expectedTriggerCount,
      expectedTriggerInsertedTimestamp,
      expectedTriggerQualityChecked,
      expectedTriggerReason,
      expectedTriggerResolvedBy,
      expectedTriggerResolvedTimestamp,
      expectedTriggerStatus,
      hasAddedOrDeletedTriggers,
      ptiurn,
      secondLevelCode,
      thirdLevelCode,
      triggers
    }) => {
      const aho = getAho(asn, ptiurn, secondLevelCode, thirdLevelCode)
      const courtCase = (await insertCourtCase({ errorStatus: errorStatus as ResolutionStatus })) as CourtCase
      if (triggers.length > 0) {
        await addTriggers(
          courtCase.errorId,
          triggers.map((trigger) => ({ code: trigger.code, status: trigger.status as ResolutionStatus }))
        )
      }

      const result = await updateCourtCase(
        dataSource.manager,
        courtCase,
        aho as unknown as AnnotatedHearingOutcome,
        hasAddedOrDeletedTriggers
      )

      expect(isError(result)).toBeFalsy()

      const actualCourtCase = (await dataSource
        .getRepository(CourtCase)
        .findOneBy({ errorId: courtCase.errorId })) as CourtCase
      expect(actualCourtCase.orgForPoliceFilter).toBe(expectedOrgForPoliceFilter)
      expect(actualCourtCase.asn).toBe(expectedAsn)
      expect(actualCourtCase.ptiurn).toBe(expectedPtiurn)
      expect(actualCourtCase.triggerCount).toBe(expectedTriggerCount)
      expect(actualCourtCase.resolutionTimestamp?.toISOString()).toBe(expectedResolutionTimestamp)
      expect(actualCourtCase.triggerReason).toBe(expectedTriggerReason)
      expect(actualCourtCase.triggerStatus).toBe(expectedTriggerStatus)
      expect(actualCourtCase.triggerResolvedBy).toBe(expectedTriggerResolvedBy)
      expect(actualCourtCase.triggerResolvedTimestamp?.toISOString()).toBe(expectedTriggerResolvedTimestamp)
      expect(actualCourtCase.triggerQualityChecked).toBe(expectedTriggerQualityChecked)
      expect(actualCourtCase.triggerInsertedTimestamp?.toISOString()).toBe(expectedTriggerInsertedTimestamp)
    }
  )

  it("should only update the specified court case", async () => {
    const aho = getAho()
    const courtCaseToUpdate = (await insertCourtCase({ errorId: 0 })) as CourtCase
    const courtCaseToNotUpdate = (await insertCourtCase({ errorId: 1 })) as CourtCase

    const result = await updateCourtCase(
      dataSource.manager,
      courtCaseToUpdate,
      aho as unknown as AnnotatedHearingOutcome,
      false
    )

    expect(isError(result)).toBeFalsy()

    const actualCourtCaseToUpdate = (await dataSource
      .getRepository(CourtCase)
      .findOneBy({ errorId: courtCaseToUpdate.errorId })) as CourtCase
    expect(actualCourtCaseToUpdate.asn).toBe("a".repeat(21))
    expect(actualCourtCaseToUpdate.ptiurn).toBe("b".repeat(11))

    const actualCourtCaseToNotUpdate = (await dataSource
      .getRepository(CourtCase)
      .findOneBy({ errorId: courtCaseToNotUpdate.errorId })) as CourtCase
    expect(actualCourtCaseToNotUpdate.asn).toBe("dummyAsn")
    expect(actualCourtCaseToNotUpdate.ptiurn).toBe("dummyPtiurn")
  })

  it("should return error if there is an unexpected error", async () => {
    const aho = getAho()
    const courtCase = (await insertCourtCase({ errorId: 0 })) as CourtCase
    jest
      .spyOn(UpdateQueryBuilder.prototype, "execute")
      .mockResolvedValueOnce(Error("Dummy error") as unknown as UpdateResult)

    const result = await updateCourtCase(dataSource.manager, courtCase, aho, false)

    expect(isError(result)).toBeTruthy()
    expect((result as Error).message).toBe("Dummy error")

    const actualCourtCase = (await dataSource
      .getRepository(CourtCase)
      .findOneBy({ errorId: courtCase.errorId })) as CourtCase
    expect(actualCourtCase.asn).toBe("dummyAsn")
    expect(actualCourtCase.ptiurn).toBe("dummyPtiurn")
  })

  it("should return error if record is not updated", async () => {
    const aho = getAho()
    const courtCase = (await insertCourtCase({ errorId: 0 })) as CourtCase
    jest.spyOn(UpdateQueryBuilder.prototype, "execute").mockResolvedValueOnce({ affected: 0 } as UpdateResult)

    const result = await updateCourtCase(dataSource.manager, courtCase, aho, false)

    expect(isError(result)).toBeTruthy()
    expect((result as Error).message).toBe("Couldn't update the court case")

    const actualCourtCase = (await dataSource
      .getRepository(CourtCase)
      .findOneBy({ errorId: courtCase.errorId })) as CourtCase
    expect(actualCourtCase.asn).toBe("dummyAsn")
    expect(actualCourtCase.ptiurn).toBe("dummyPtiurn")
  })
})
