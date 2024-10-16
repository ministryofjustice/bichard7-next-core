import type { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import MockDate from "mockdate"
import type { DataSource, UpdateResult } from "typeorm"
import { UpdateQueryBuilder } from "typeorm"
import { v4 as uuid } from "uuid"
import CourtCase from "../../../src/services/entities/CourtCase"
import Trigger from "../../../src/services/entities/Trigger"
import getDataSource from "../../../src/services/getDataSource"
import updateCourtCase from "../../../src/services/reallocateCourtCase/updateCourtCase"
import type { ResolutionStatus } from "../../../src/types/ResolutionStatus"
import { isError } from "../../../src/types/Result"
import deleteFromDynamoTable from "../../utils/deleteFromDynamoTable"
import deleteFromEntity from "../../utils/deleteFromEntity"
import { insertCourtCasesWithFields } from "../../utils/insertCourtCases"
import { insertTriggers } from "../../utils/manageTriggers"

const getAho = (
  asn: string | null = "a".repeat(50),
  ptiurn: string | null = "b".repeat(50),
  secondLevelCode: string | null = "AB",
  thirdLevelCode: string | null = "12"
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
    errorId: 0,
    courtDate: new Date("2008-09-25"),
    messageId: uuid(),
    triggerCount: 0,
    asn: "dummyAsn",
    ptiurn: "dummyPtiurn",
    orgForPoliceFilter: "123456",
    resolutionTimestamp: null,
    triggerReason: null,
    triggerStatus: null,
    triggerResolvedBy: null,
    triggerResolvedTimestamp: null,
    triggerQualityChecked: null,
    triggerInsertedTimestamp: null,
    ...fields
  }

  const courtCases = await insertCourtCasesWithFields([existingCourtCasesDbObject])
  if (isError(courtCases)) {
    throw courtCases
  }

  return courtCases[0]
}

const addTriggers = async (courtCaseId: number, triggers: { status: ResolutionStatus; code: TriggerCode }[]) => {
  await insertTriggers(
    courtCaseId,
    triggers.map((trigger, index) => ({
      triggerId: index,
      status: trigger.status,
      triggerCode: trigger.code,
      createdAt: new Date()
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
      description: "should truncate asn and ptiurn when string values are too long",
      secondLevelCode: "12",
      thirdLevelCode: "AB",
      asn: "a".repeat(50),
      ptiurn: "b".repeat(50),
      hasAddedOrDeletedTriggers: false,
      triggers: [],
      errorStatus: "Resolved",
      expectedOrgForPoliceFilter: "12AB  ",
      expectedAsn: "a".repeat(21),
      expectedPtiurn: "b".repeat(11),
      expectedResolutionTimestamp: undefined,
      expectedTriggerCount: 0,
      expectedTriggerReason: null,
      expectedTriggerStatus: null,
      expectedTriggerResolvedBy: null,
      expectedTriggerResolvedTimestamp: undefined,
      expectedTriggerQualityChecked: null,
      expectedTriggerInsertedTimestamp: undefined
    },
    {
      description: [
        "should not include force third level code in orgForPoliceFilter when third level code is 00",
        "should not update court case when no triggers have been added or deleted"
      ],
      secondLevelCode: "12",
      thirdLevelCode: "00",
      asn: "a".repeat(50),
      ptiurn: "b".repeat(50),
      hasAddedOrDeletedTriggers: false,
      triggers: [],
      errorStatus: "Resolved",
      expectedOrgForPoliceFilter: "12    ",
      expectedAsn: "a".repeat(21),
      expectedPtiurn: "b".repeat(11),
      expectedResolutionTimestamp: undefined,
      expectedTriggerCount: 0,
      expectedTriggerReason: null,
      expectedTriggerStatus: null,
      expectedTriggerResolvedBy: null,
      expectedTriggerResolvedTimestamp: undefined,
      expectedTriggerQualityChecked: null,
      expectedTriggerInsertedTimestamp: undefined
    },
    {
      description: "should set resolution timestamp when there are no triggers and exceptions",
      secondLevelCode: "12",
      thirdLevelCode: "AB",
      asn: "a".repeat(50),
      ptiurn: "b".repeat(50),
      hasAddedOrDeletedTriggers: true,
      triggers: [],
      errorStatus: null,
      expectedOrgForPoliceFilter: "12AB  ",
      expectedAsn: "a".repeat(21),
      expectedPtiurn: "b".repeat(11),
      expectedResolutionTimestamp: timestamp,
      expectedTriggerCount: 0,
      expectedTriggerReason: null,
      expectedTriggerStatus: null,
      expectedTriggerResolvedBy: null,
      expectedTriggerResolvedTimestamp: undefined,
      expectedTriggerQualityChecked: null,
      expectedTriggerInsertedTimestamp: undefined
    },
    {
      description: "should set resolution timestamp when there are no triggers and exceptions are resolved",
      secondLevelCode: "12",
      thirdLevelCode: "AB",
      asn: "a".repeat(50),
      ptiurn: "b".repeat(50),
      hasAddedOrDeletedTriggers: true,
      triggers: [],
      errorStatus: "Resolved",
      expectedOrgForPoliceFilter: "12AB  ",
      expectedAsn: "a".repeat(21),
      expectedPtiurn: "b".repeat(11),
      expectedResolutionTimestamp: timestamp,
      expectedTriggerCount: 0,
      expectedTriggerReason: null,
      expectedTriggerStatus: null,
      expectedTriggerResolvedBy: null,
      expectedTriggerResolvedTimestamp: undefined,
      expectedTriggerQualityChecked: null,
      expectedTriggerInsertedTimestamp: undefined
    },
    {
      description: "should not set resolution timestamp when there are no triggers and unresolved exceptions",
      secondLevelCode: "12",
      thirdLevelCode: "AB",
      asn: "a".repeat(50),
      ptiurn: "b".repeat(50),
      hasAddedOrDeletedTriggers: true,
      triggers: [],
      errorStatus: "Unresolved",
      expectedOrgForPoliceFilter: "12AB  ",
      expectedAsn: "a".repeat(21),
      expectedPtiurn: "b".repeat(11),
      expectedResolutionTimestamp: undefined,
      expectedTriggerCount: 0,
      expectedTriggerReason: null,
      expectedTriggerStatus: null,
      expectedTriggerResolvedBy: null,
      expectedTriggerResolvedTimestamp: undefined,
      expectedTriggerQualityChecked: null,
      expectedTriggerInsertedTimestamp: undefined
    },
    {
      description:
        "should set resolution timestamp and trigger fields when all triggers are resolved and there are no exceptions",
      secondLevelCode: "12",
      thirdLevelCode: "AB",
      asn: "a".repeat(50),
      ptiurn: "b".repeat(50),
      hasAddedOrDeletedTriggers: true,
      triggers: [
        { code: TriggerCode.TRPR0001, status: "Resolved" },
        { code: TriggerCode.TRPR0002, status: "Resolved" }
      ],
      errorStatus: null,
      expectedOrgForPoliceFilter: "12AB  ",
      expectedAsn: "a".repeat(21),
      expectedPtiurn: "b".repeat(11),
      expectedResolutionTimestamp: timestamp,
      expectedTriggerCount: 2,
      expectedTriggerReason: TriggerCode.TRPR0001,
      expectedTriggerStatus: "Resolved",
      expectedTriggerResolvedBy: "System",
      expectedTriggerResolvedTimestamp: timestamp,
      expectedTriggerQualityChecked: 1,
      expectedTriggerInsertedTimestamp: undefined
    },
    {
      description: "should set resolution timestamp and trigger fields when all triggers and exceptions are resolved",
      secondLevelCode: "12",
      thirdLevelCode: "AB",
      asn: "a".repeat(50),
      ptiurn: "b".repeat(50),
      hasAddedOrDeletedTriggers: true,
      triggers: [
        { code: TriggerCode.TRPR0001, status: "Resolved" },
        { code: TriggerCode.TRPR0002, status: "Resolved" }
      ],
      errorStatus: "Resolved",
      expectedOrgForPoliceFilter: "12AB  ",
      expectedAsn: "a".repeat(21),
      expectedPtiurn: "b".repeat(11),
      expectedResolutionTimestamp: timestamp,
      expectedTriggerCount: 2,
      expectedTriggerReason: TriggerCode.TRPR0001,
      expectedTriggerStatus: "Resolved",
      expectedTriggerResolvedBy: "System",
      expectedTriggerResolvedTimestamp: timestamp,
      expectedTriggerQualityChecked: 1,
      expectedTriggerInsertedTimestamp: undefined
    },
    {
      description:
        "should set trigger fields but not resolution timestamp when all triggers are resolved but exceptions are unresolved",
      secondLevelCode: "12",
      thirdLevelCode: "AB",
      asn: "a".repeat(50),
      ptiurn: "b".repeat(50),
      hasAddedOrDeletedTriggers: true,
      triggers: [
        { code: TriggerCode.TRPR0001, status: "Resolved" },
        { code: TriggerCode.TRPR0002, status: "Resolved" }
      ],
      errorStatus: "Unresolved",
      expectedOrgForPoliceFilter: "12AB  ",
      expectedAsn: "a".repeat(21),
      expectedPtiurn: "b".repeat(11),
      expectedResolutionTimestamp: undefined,
      expectedTriggerCount: 2,
      expectedTriggerReason: TriggerCode.TRPR0001,
      expectedTriggerStatus: "Resolved",
      expectedTriggerResolvedBy: "System",
      expectedTriggerResolvedTimestamp: timestamp,
      expectedTriggerQualityChecked: 1,
      expectedTriggerInsertedTimestamp: undefined
    },
    {
      description: "should set trigger fields when some triggers are resolved",
      secondLevelCode: "12",
      thirdLevelCode: "AB",
      asn: "a".repeat(50),
      ptiurn: "b".repeat(50),
      hasAddedOrDeletedTriggers: true,
      triggers: [
        { code: TriggerCode.TRPR0005, status: "Resolved" },
        { code: TriggerCode.TRPR0004, status: "Unresolved" },
        { code: TriggerCode.TRPR0004, status: "Unresolved" }
      ],
      errorStatus: null,
      expectedOrgForPoliceFilter: "12AB  ",
      expectedAsn: "a".repeat(21),
      expectedPtiurn: "b".repeat(11),
      expectedResolutionTimestamp: undefined,
      expectedTriggerCount: 3,
      expectedTriggerReason: TriggerCode.TRPR0005,
      expectedTriggerStatus: "Unresolved",
      expectedTriggerResolvedBy: null,
      expectedTriggerResolvedTimestamp: undefined,
      expectedTriggerQualityChecked: 1,
      expectedTriggerInsertedTimestamp: timestamp
    }
  ])(
    "$description",
    async ({
      secondLevelCode,
      thirdLevelCode,
      asn,
      ptiurn,
      hasAddedOrDeletedTriggers,
      triggers,
      errorStatus,
      expectedOrgForPoliceFilter,
      expectedAsn,
      expectedPtiurn,
      expectedResolutionTimestamp,
      expectedTriggerCount,
      expectedTriggerInsertedTimestamp,
      expectedTriggerQualityChecked,
      expectedTriggerReason,
      expectedTriggerResolvedBy,
      expectedTriggerResolvedTimestamp,
      expectedTriggerStatus
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
