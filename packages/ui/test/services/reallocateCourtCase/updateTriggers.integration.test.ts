import type { AuditLogEvent } from "@moj-bichard7/common/types/AuditLogEvent"
import type { Trigger } from "@moj-bichard7/core/types/Trigger"
import type { DataSource } from "typeorm"

import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { randomUUID } from "crypto"
import MockDate from "mockdate"
import { Repository } from "typeorm"

import type User from "../../../src/services/entities/User"

import CourtCase from "../../../src/services/entities/CourtCase"
import { default as TriggerEntity } from "../../../src/services/entities/Trigger"
import getDataSource from "../../../src/services/getDataSource"
import updateTriggers from "../../../src/services/reallocateCourtCase/updateTriggers"
import { isError } from "../../../src/types/Result"
import deleteFromDynamoTable from "../../utils/deleteFromDynamoTable"
import deleteFromEntity from "../../utils/deleteFromEntity"
import { insertCourtCasesWithFields } from "../../utils/insertCourtCases"
import { insertTriggers } from "../../utils/manageTriggers"

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

const addTriggers = async (courtCaseId: number, triggers: { code: TriggerCode; offenceSequenceNumber?: number }[]) => {
  await insertTriggers(
    courtCaseId,
    triggers.map((trigger, index) => ({
      createdAt: new Date(),
      status: "Unresolved",
      triggerCode: trigger.code,
      triggerId: index,
      triggerItemIdentity: trigger.offenceSequenceNumber
    }))
  )
}

describe("updateCourtCase", () => {
  let dataSource: DataSource
  const timestamp = new Date().toISOString()
  const user = { username: "dummy.user" } as User

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    MockDate.set(timestamp)
    await deleteFromDynamoTable("auditLogTable", "messageId")
    await deleteFromDynamoTable("auditLogEventsTable", "_id")
    await deleteFromEntity(TriggerEntity)
    await deleteFromEntity(CourtCase)
  }, 20_000)

  afterAll(async () => {
    MockDate.reset()
    await dataSource.destroy()
  })

  it("should add and delete passed triggers", async () => {
    const courtCase = await insertCourtCase()
    await addTriggers(courtCase.errorId, [
      { code: TriggerCode.TRPR0001, offenceSequenceNumber: 1 },
      { code: TriggerCode.TRPR0001, offenceSequenceNumber: 2 },
      { code: TriggerCode.TRPR0002 }
    ])

    const triggersToDelete: Trigger[] = [{ code: TriggerCode.TRPR0001, offenceSequenceNumber: 2 } as Trigger]
    const triggersToAdd: Trigger[] = [{ code: TriggerCode.TRPR0005, offenceSequenceNumber: 3 } as Trigger]
    const events: AuditLogEvent[] = []

    const updateResult = await updateTriggers(
      dataSource.manager,
      courtCase,
      triggersToAdd,
      triggersToDelete,
      false,
      user,
      events
    )
    expect(isError(updateResult)).toBeFalsy()

    const triggers = (await dataSource
      .getRepository(TriggerEntity)
      .findBy({ errorId: courtCase.errorId })) as TriggerEntity[]

    expect(triggers).toHaveLength(3)
    expect(triggers.map((x) => ({ code: x.triggerCode, offenceSequenceNumber: x.triggerItemIdentity }))).toEqual([
      { code: TriggerCode.TRPR0001, offenceSequenceNumber: 1 },
      { code: TriggerCode.TRPR0002, offenceSequenceNumber: null },
      { code: TriggerCode.TRPR0005, offenceSequenceNumber: 3 }
    ])

    expect(events).toHaveLength(2)
    expect(events).toStrictEqual([
      {
        attributes: {
          auditLogVersion: 2,
          "Number of Triggers": 1,
          "Trigger 1 Details": "TRPR0005",
          "Trigger and Exception Flag": false,
          user: "dummy.user"
        },
        category: "information",
        eventCode: "triggers.generated",
        eventSource: "Bichard New UI",
        eventType: "Triggers generated",
        timestamp: expect.anything()
      },
      {
        attributes: {
          auditLogVersion: 2,
          "Number of Triggers": 1,
          "Trigger 1 Details": "TRPR0001",
          "Trigger and Exception Flag": false,
          user: "dummy.user"
        },
        category: "information",
        eventCode: "triggers.deleted",
        eventSource: "Bichard New UI",
        eventType: "Triggers deleted",
        timestamp: expect.anything()
      }
    ])
  })

  it("should not add or delete any triggers when no triggers to add or delete are passed", async () => {
    const courtCase = await insertCourtCase()
    await addTriggers(courtCase.errorId, [
      { code: TriggerCode.TRPR0001, offenceSequenceNumber: 1 },
      { code: TriggerCode.TRPR0001, offenceSequenceNumber: 2 },
      { code: TriggerCode.TRPR0002 }
    ])
    const events: AuditLogEvent[] = []

    const updateResult = await updateTriggers(dataSource.manager, courtCase, [], [], true, user, events)
    expect(isError(updateResult)).toBeFalsy()

    const triggers = (await dataSource
      .getRepository(TriggerEntity)
      .findBy({ errorId: courtCase.errorId })) as TriggerEntity[]

    expect(triggers).toHaveLength(3)
    expect(triggers.map((x) => ({ code: x.triggerCode, offenceSequenceNumber: x.triggerItemIdentity }))).toEqual([
      { code: TriggerCode.TRPR0001, offenceSequenceNumber: 1 },
      { code: TriggerCode.TRPR0001, offenceSequenceNumber: 2 },
      { code: TriggerCode.TRPR0002, offenceSequenceNumber: null }
    ])

    expect(events).toHaveLength(0)
  })

  it("should not delete other case's triggers", async () => {
    const courtCase1 = await insertCourtCase({ errorId: 0 })
    const courtCase2 = await insertCourtCase({ errorId: 1 })
    await addTriggers(courtCase1.errorId, [
      { code: TriggerCode.TRPR0001, offenceSequenceNumber: 1 },
      { code: TriggerCode.TRPR0001, offenceSequenceNumber: 2 },
      { code: TriggerCode.TRPR0002 }
    ])

    await addTriggers(courtCase2.errorId, [
      { code: TriggerCode.TRPR0003, offenceSequenceNumber: 2 },
      { code: TriggerCode.TRPR0008, offenceSequenceNumber: 3 }
    ])

    const triggersToDelete: Trigger[] = [{ code: TriggerCode.TRPR0001, offenceSequenceNumber: 2 } as Trigger]
    const triggersToAdd: Trigger[] = [{ code: TriggerCode.TRPR0005, offenceSequenceNumber: 3 } as Trigger]
    const events: AuditLogEvent[] = []

    const updateResult = await updateTriggers(
      dataSource.manager,
      courtCase1,
      triggersToAdd,
      triggersToDelete,
      true,
      user,
      events
    )
    expect(isError(updateResult)).toBeFalsy()

    const case2triggers = (await dataSource
      .getRepository(TriggerEntity)
      .findBy({ errorId: courtCase2.errorId })) as TriggerEntity[]

    expect(case2triggers).toHaveLength(2)
    expect(case2triggers.map((x) => x.triggerCode)).toEqual([TriggerCode.TRPR0003, TriggerCode.TRPR0008])
  })

  it("should return error if fails to add a trigger", async () => {
    const courtCase = await insertCourtCase()
    await addTriggers(courtCase.errorId, [
      { code: TriggerCode.TRPR0001, offenceSequenceNumber: 1 },
      { code: TriggerCode.TRPR0001, offenceSequenceNumber: 2 },
      { code: TriggerCode.TRPR0002 }
    ])
    const triggersToDelete: Trigger[] = [{ code: TriggerCode.TRPR0001, offenceSequenceNumber: 2 } as Trigger]
    const triggersToAdd: Trigger[] = [{ code: TriggerCode.TRPR0005, offenceSequenceNumber: 3 } as Trigger]
    const events: AuditLogEvent[] = []

    jest
      .spyOn(Repository.prototype, "insert")
      .mockImplementationOnce(() => new Promise((_, reject) => reject(Error("dummy insert error"))))

    const result = await updateTriggers(
      dataSource.manager,
      courtCase,
      triggersToAdd,
      triggersToDelete,
      true,
      user,
      events
    )

    expect(isError(result)).toBeTruthy()
    expect((result as Error).message).toBe("dummy insert error")
    expect(events).toHaveLength(0)
  })

  it("should return error if fails to delete a trigger", async () => {
    const courtCase = await insertCourtCase()
    await addTriggers(courtCase.errorId, [
      { code: TriggerCode.TRPR0001, offenceSequenceNumber: 1 },
      { code: TriggerCode.TRPR0001, offenceSequenceNumber: 2 },
      { code: TriggerCode.TRPR0002 }
    ])
    const triggersToDelete: Trigger[] = [{ code: TriggerCode.TRPR0001, offenceSequenceNumber: 2 } as Trigger]
    const triggersToAdd: Trigger[] = [{ code: TriggerCode.TRPR0005, offenceSequenceNumber: 3 } as Trigger]
    const events: AuditLogEvent[] = []

    jest
      .spyOn(Repository.prototype, "delete")
      .mockImplementationOnce(() => new Promise((_, reject) => reject(Error("dummy delete error"))))

    const result = await updateTriggers(
      dataSource.manager,
      courtCase,
      triggersToAdd,
      triggersToDelete,
      true,
      user,
      events
    )

    expect(isError(result)).toBeTruthy()
    expect((result as Error).message).toBe("dummy delete error")
    expect(events).toHaveLength(0)
  })
})
