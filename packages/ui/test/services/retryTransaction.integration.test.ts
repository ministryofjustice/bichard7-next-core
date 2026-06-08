import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import CourtCase from "services/entities/CourtCase"
import Note from "services/entities/Note"
import type User from "services/entities/User"
import getDataSource from "services/getDataSource"
import resolveTriggers from "services/resolveTriggers"
import type { DataSource } from "typeorm"
import { QueryFailedError } from "typeorm"
import logger from "utils/logger"
import { hasAccessToAll } from "../helpers/hasAccessTo"
import deleteFromDynamoTable from "../utils/deleteFromDynamoTable"
import deleteFromEntity from "../utils/deleteFromEntity"
import { insertCourtCasesWithFields } from "../utils/insertCourtCases"
import type { TestTrigger } from "../utils/manageTriggers"
import { insertTriggers } from "../utils/manageTriggers"

const serializationError = () => {
  const error = new QueryFailedError("", [], new Error())
  ;(error as QueryFailedError & { code: string }).code = "40001"
  return error
}

describe("retryTransaction using resolveTriggers as an example", () => {
  let dataSource: DataSource
  const resolverUsername = "TriggerHandler"
  const visibleForce = "36"
  const user = {
    visibleCourts: [],
    visibleForces: [visibleForce],
    username: resolverUsername,
    hasAccessTo: hasAccessToAll,
    excludedTriggers: [TriggerCode.TRPR0015]
  } as Partial<User> as User

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromEntity(Note)
    await deleteFromEntity(CourtCase)
    await deleteFromDynamoTable("auditLogTable", "messageId")
    await deleteFromDynamoTable("auditLogEventsTable", "_id")
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  it("retries and throws if serialization error persists", async () => {
    const error = serializationError()
    jest.spyOn(dataSource, "transaction").mockRejectedValue(error)
    jest.spyOn(logger, "warn")
    jest.spyOn(logger, "error")

    const [courtCase] = await insertCourtCasesWithFields([
      {
        triggerLockedByUsername: resolverUsername,
        orgForPoliceFilter: visibleForce
      }
    ])
    const trigger: TestTrigger = {
      triggerId: 0,
      triggerCode: TriggerCode.TRPR0001,
      status: "Unresolved",
      createdAt: new Date("2022-07-12T10:22:34.000Z")
    }
    await insertTriggers(0, [trigger])

    await expect(resolveTriggers(dataSource, [trigger.triggerId], courtCase.errorId, user)).rejects.toEqual(error)

    expect(dataSource.transaction).toHaveBeenCalledTimes(3)
    expect(logger.warn).toHaveBeenCalledTimes(2)
    expect(logger.error).toHaveBeenCalledTimes(1)
  })

  it("retries and succeeds if first transaction throws a serialization error", async () => {
    const error = serializationError()
    jest.spyOn(dataSource, "transaction").mockRejectedValueOnce(error).mockResolvedValueOnce(true)
    jest.spyOn(logger, "warn")
    jest.spyOn(logger, "error")

    const [courtCase] = await insertCourtCasesWithFields([
      {
        triggerLockedByUsername: resolverUsername,
        orgForPoliceFilter: visibleForce
      }
    ])
    const trigger: TestTrigger = {
      triggerId: 0,
      triggerCode: TriggerCode.TRPR0001,
      status: "Unresolved",
      createdAt: new Date("2022-07-12T10:22:34.000Z")
    }
    await insertTriggers(0, [trigger])

    await expect(resolveTriggers(dataSource, [trigger.triggerId], courtCase.errorId, user)).resolves.toBe(true)

    expect(dataSource.transaction).toHaveBeenCalledTimes(2)
    expect(logger.warn).toHaveBeenCalledTimes(1)
    expect(logger.error).not.toHaveBeenCalled()
  })

  it("throws immediately if it is not a QueryFailedError", async () => {
    const error = new Error("One or more triggers are already resolved")
    jest.spyOn(dataSource, "transaction").mockRejectedValueOnce(error)
    jest.spyOn(logger, "warn")
    jest.spyOn(logger, "error")

    const [courtCase] = await insertCourtCasesWithFields([
      {
        triggerLockedByUsername: resolverUsername,
        orgForPoliceFilter: visibleForce
      }
    ])
    const trigger: TestTrigger = {
      triggerId: 0,
      triggerCode: TriggerCode.TRPR0001,
      status: "Unresolved",
      createdAt: new Date("2022-07-12T10:22:34.000Z")
    }
    await insertTriggers(0, [trigger])

    await expect(resolveTriggers(dataSource, [trigger.triggerId], courtCase.errorId, user)).rejects.toThrow(error)

    expect(dataSource.transaction).toHaveBeenCalledTimes(1)
    expect(logger.warn).not.toHaveBeenCalled()
    expect(logger.error).toHaveBeenCalledTimes(1)
  })

  it("throws immediately if QueryFailedError is not a serialization error", async () => {
    const error = new QueryFailedError("", [], new Error())
    ;(error as QueryFailedError & { code: string }).code = "23505"
    jest.spyOn(dataSource, "transaction").mockRejectedValueOnce(error)
    jest.spyOn(logger, "warn")
    jest.spyOn(logger, "error")

    const [courtCase] = await insertCourtCasesWithFields([
      {
        triggerLockedByUsername: resolverUsername,
        orgForPoliceFilter: visibleForce
      }
    ])
    const trigger: TestTrigger = {
      triggerId: 0,
      triggerCode: TriggerCode.TRPR0001,
      status: "Unresolved",
      createdAt: new Date("2022-07-12T10:22:34.000Z")
    }
    await insertTriggers(0, [trigger])

    await expect(resolveTriggers(dataSource, [trigger.triggerId], courtCase.errorId, user)).rejects.toEqual(error)

    expect(dataSource.transaction).toHaveBeenCalledTimes(1)
    expect(logger.warn).not.toHaveBeenCalled()
    expect(logger.error).toHaveBeenCalledTimes(1)
  })
})
