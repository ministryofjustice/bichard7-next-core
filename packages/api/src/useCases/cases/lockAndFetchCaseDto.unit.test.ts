import type { CaseDto } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"

import { UserGroup } from "@moj-bichard7/common/types/UserGroup"

import type { CaseDataForDto } from "../../types/Case"

import FakeDataStore from "../../services/gateways/dataStoreGateways/fakeDataStore"
import { testAhoJsonObj, testAhoXml } from "../../tests/helpers/ahoHelper"
import auditLogDynamoConfig from "../../tests/helpers/dynamoDbConfig"
import FakeLogger from "../../tests/helpers/fakeLogger"
import TestDynamoGateway from "../../tests/testGateways/TestDynamoGateway/TestDynamoGateway"
import lockAndFetchCaseDto from "./lockAndFetchCaseDto"

const testDynamoGateway = new TestDynamoGateway(auditLogDynamoConfig)

describe("lockAndFetchCaseDto", () => {
  const logger = new FakeLogger()
  const fakeDataStore = new FakeDataStore()

  it("returns a case", async () => {
    const user = { visible_forces: "001" } as User
    fakeDataStore.forceIds = [1]
    const result = await lockAndFetchCaseDto(user, fakeDataStore, 0, testDynamoGateway, logger)

    expect(result).toEqual({
      aho: testAhoJsonObj,
      asn: "",
      canUserEditExceptions: false,
      courtCode: "",
      courtDate: new Date("2022-06-30"),
      courtName: "",
      courtReference: "",
      defendantName: "",
      errorId: 0,
      errorLockedByUserFullName: null,
      errorLockedByUsername: null,
      errorReport: "",
      errorStatus: null,
      isUrgent: 0,
      notes: [],
      orgForPoliceFilter: "",
      phase: 1,
      ptiurn: null,
      resolutionTimestamp: null,
      triggerCount: 0,
      triggerLockedByUserFullName: null,
      triggerLockedByUsername: null,
      triggers: [],
      triggerStatus: null,
      updatedHearingOutcome: null
    } satisfies CaseDto)
  })

  it("returns error when no force associated to a user", async () => {
    const user = { visible_forces: "" } as User
    fakeDataStore.forceIds = []

    await expect(lockAndFetchCaseDto(user, fakeDataStore, 0, testDynamoGateway, logger)).rejects.toThrow(
      "No force associated to User"
    )
  })

  it("returns canUserEditExceptions true when case is locked to currentUser, user has access to exceptions and errorStatus is unresolved", async () => {
    const user = {
      groups: [UserGroup.ExceptionHandler],
      username: "user1",
      visible_forces: "001"
    } as unknown as User
    fakeDataStore.forceIds = [1]
    const caseObj = {
      annotated_msg: testAhoXml,
      error_locked_by_id: "user1",
      error_status: 1
    } as CaseDataForDto

    jest.spyOn(fakeDataStore, "fetchCase").mockResolvedValue(caseObj)

    const result = await lockAndFetchCaseDto(user, fakeDataStore, 0, testDynamoGateway, logger)

    expect(result.canUserEditExceptions).toBe(true)
  })

  it("returns canUserEditExceptions false when case is not locked to currentUser", async () => {
    const user = {
      groups: [UserGroup.ExceptionHandler],
      username: "user1",
      visible_forces: "001"
    } as unknown as User
    fakeDataStore.forceIds = [1]
    const caseObj = {
      annotated_msg: testAhoXml,
      error_locked_by_id: "user2",
      error_status: 1
    } as CaseDataForDto

    jest.spyOn(fakeDataStore, "fetchCase").mockResolvedValue(caseObj)

    const result = await lockAndFetchCaseDto(user, fakeDataStore, 0, testDynamoGateway, logger)

    expect(result.canUserEditExceptions).toBe(false)
  })

  it("returns canUserEditExceptions false when user does not have access to exceptions", async () => {
    const user = {
      groups: [UserGroup.Audit],
      username: "user1",
      visible_forces: "001"
    } as unknown as User
    fakeDataStore.forceIds = [1]
    const caseObj = {
      annotated_msg: testAhoXml,
      error_locked_by_id: "user1",
      error_status: 1
    } as CaseDataForDto

    jest.spyOn(fakeDataStore, "fetchCase").mockResolvedValue(caseObj)

    const result = await lockAndFetchCaseDto(user, fakeDataStore, 0, testDynamoGateway, logger)

    expect(result.canUserEditExceptions).toBe(false)
  })

  it("returns canUserEditExceptions false errorStatus is not unresolved", async () => {
    const user = {
      groups: [UserGroup.ExceptionHandler],
      username: "user1",
      visible_forces: "001"
    } as unknown as User
    fakeDataStore.forceIds = [1]
    const caseObj = {
      annotated_msg: testAhoXml,
      error_locked_by_id: "user1",
      error_status: 2
    } as CaseDataForDto

    jest.spyOn(fakeDataStore, "fetchCase").mockResolvedValue(caseObj)

    const result = await lockAndFetchCaseDto(user, fakeDataStore, 0, testDynamoGateway, logger)

    expect(result.canUserEditExceptions).toBe(false)
  })

  it("calls transaction on the dataStore", async () => {
    const user = { visible_forces: "001" } as User
    fakeDataStore.forceIds = [1]

    jest.spyOn(fakeDataStore, "transaction")
    jest.spyOn(fakeDataStore, "fetchCase")
    await lockAndFetchCaseDto(user, fakeDataStore, 0, testDynamoGateway, logger)

    expect(fakeDataStore.transaction).toHaveBeenCalledTimes(1)
    expect(fakeDataStore.fetchCase).toHaveBeenCalledTimes(1)
  })
})
