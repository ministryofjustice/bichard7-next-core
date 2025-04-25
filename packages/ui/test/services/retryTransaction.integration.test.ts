import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import CourtCase from "services/entities/CourtCase"
import Note from "services/entities/Note"
import type User from "services/entities/User"
import getDataSource from "services/getDataSource"
import resolveTriggers from "services/resolveTriggers"
import type { DataSource } from "typeorm"
import { QueryFailedError } from "typeorm"
import { hasAccessToAll } from "../helpers/hasAccessTo"
import deleteFromDynamoTable from "../utils/deleteFromDynamoTable"
import deleteFromEntity from "../utils/deleteFromEntity"
import { insertCourtCasesWithFields } from "../utils/insertCourtCases"
import type { TestTrigger } from "../utils/manageTriggers"
import { insertTriggers } from "../utils/manageTriggers"

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

  it("throws error QueryFailedError", async () => {
    const error = new QueryFailedError("QueryFailedError", ["Transaction failed"], new Error())
    jest.spyOn(dataSource, "transaction").mockRejectedValue(error)

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

    expect(dataSource.transaction).toHaveBeenCalledTimes(2)
  })

  it("will retry if the first transaction throws a QueryFailedError", async () => {
    const error = new QueryFailedError("QueryFailedError", ["Transaction failed"], new Error())
    jest.spyOn(dataSource, "transaction").mockRejectedValueOnce(error).mockResolvedValueOnce(true)

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
  })

  it("throws immediately if it isn't a QueryFailedError", async () => {
    const error = new Error("One or more triggers are already resolved")
    jest.spyOn(dataSource, "transaction").mockRejectedValueOnce(error)

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
  })
})
