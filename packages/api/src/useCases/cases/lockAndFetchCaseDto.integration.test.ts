import type { CaseDto } from "@moj-bichard7/common/types/Case"

import { isError } from "@moj-bichard7/common/types/Result"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"

import { testAhoJsonObj, testAhoXml } from "../../tests/helpers/ahoHelper"
import { createCase } from "../../tests/helpers/caseHelper"
import auditLogDynamoConfig from "../../tests/helpers/dynamoDbConfig"
import FakeLogger from "../../tests/helpers/fakeLogger"
import { createUser } from "../../tests/helpers/userHelper"
import End2EndPostgres from "../../tests/testGateways/e2ePostgres"
import TestDynamoGateway from "../../tests/testGateways/TestDynamoGateway/TestDynamoGateway"
import lockAndFetchCaseDto from "./lockAndFetchCaseDto"

const testDynamoGateway = new TestDynamoGateway(auditLogDynamoConfig)
const databaseGateway = new End2EndPostgres()

describe("lockAndFetchCaseDto", () => {
  const logger = new FakeLogger()

  beforeEach(async () => {
    await databaseGateway.clearDb()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("returns a case", async () => {
    const user = await createUser(databaseGateway, { visibleForces: ["01"] })
    const caseObj = await createCase(databaseGateway, {
      aho: testAhoXml,
      errorId: 1
    })
    const result = await lockAndFetchCaseDto(databaseGateway.writable, testDynamoGateway, user, caseObj.errorId, logger)

    expect(result).toEqual({
      aho: testAhoJsonObj,
      asn: "1901ID0100000006148H",
      canUserEditExceptions: true,
      courtCode: "ABC",
      courtDate: new Date("2025-05-23"),
      courtName: "Kingston Crown Court",
      courtReference: "ABC",
      defendantName: "Defendant",
      errorId: 1,
      errorLockedByUserFullName: "Forename1 Surname1",
      errorLockedByUsername: "User1",
      errorQualityChecked: null,
      errorReport: "HO100304||br7:ArrestSummonsNumber",
      errorStatus: "Unresolved",
      isUrgent: 1,
      messageReceivedAt: new Date("2025-05-23"),
      noteCount: undefined,
      notes: [],
      orgForPoliceFilter: "01",
      phase: 1,
      ptiurn: "00112233",
      resolutionTimestamp: null,
      triggerCount: 1,
      triggerLockedByUserFullName: "Forename1 Surname1",
      triggerLockedByUsername: "User1",
      triggerQualityChecked: null,
      triggers: [],
      triggerStatus: "Unresolved",
      updatedHearingOutcome: null
    } satisfies CaseDto)
  })

  it("returns error when no force associated to a user", async () => {
    const user = await createUser(databaseGateway, { id: 1, visibleCourts: [], visibleForces: [] })
    const caseObj = await createCase(databaseGateway, { errorId: 1 })

    const result = await lockAndFetchCaseDto(databaseGateway.writable, testDynamoGateway, user, caseObj.errorId, logger)

    expect(isError(result)).toBe(true)
    expect((result as Error).message).toBe("Case not found for Case id 1 and user User1")
  })

  it("returns canUserEditExceptions true when case is locked to currentUser, user has access to exceptions and errorStatus is unresolved", async () => {
    const user = await createUser(databaseGateway, {
      groups: [UserGroup.ExceptionHandler],
      username: "user1",
      visibleForces: ["01"]
    })
    const caseObj = await createCase(databaseGateway, {
      aho: testAhoXml,
      errorId: 1,
      errorLockedById: "user1",
      errorStatus: 1
    })

    const result = (await lockAndFetchCaseDto(
      databaseGateway.writable,
      testDynamoGateway,
      user,
      caseObj.errorId,
      logger
    )) as CaseDto

    expect(result.canUserEditExceptions).toBe(true)
  })

  it("returns canUserEditExceptions false when case is not locked to currentUser", async () => {
    const user = await createUser(databaseGateway, {
      groups: [UserGroup.ExceptionHandler],
      username: "user1",
      visibleForces: ["01"]
    })
    const caseObj = await createCase(databaseGateway, {
      aho: testAhoXml,
      errorId: 1,
      errorLockedById: "user2",
      errorStatus: 1
    })

    const result = (await lockAndFetchCaseDto(
      databaseGateway.writable,
      testDynamoGateway,
      user,
      caseObj.errorId,
      logger
    )) as CaseDto

    expect(result.canUserEditExceptions).toBe(false)
  })

  it("returns canUserEditExceptions false when user does not have access to exceptions", async () => {
    const user = await createUser(databaseGateway, {
      groups: [UserGroup.Audit],
      username: "user1",
      visibleForces: ["01"]
    })
    const caseObj = await createCase(databaseGateway, {
      aho: testAhoXml,
      errorId: 1,
      errorLockedById: "user1",
      errorStatus: 1
    })

    const result = (await lockAndFetchCaseDto(
      databaseGateway.writable,
      testDynamoGateway,
      user,
      caseObj.errorId,
      logger
    )) as CaseDto

    expect(result.canUserEditExceptions).toBe(false)
  })

  it("returns canUserEditExceptions false errorStatus is not unresolved", async () => {
    const user = await createUser(databaseGateway, {
      groups: [UserGroup.ExceptionHandler],
      username: "user1",
      visibleForces: ["01"]
    })
    const caseObj = await createCase(databaseGateway, {
      aho: testAhoXml,
      errorId: 1,
      errorLockedById: "user1",
      errorStatus: 2
    })

    const result = (await lockAndFetchCaseDto(
      databaseGateway.writable,
      testDynamoGateway,
      user,
      caseObj.errorId,
      logger
    )) as CaseDto

    expect(result.canUserEditExceptions).toBe(false)
  })

  it("calls transaction on the writable database connection", async () => {
    const writableDatabaseSpy = jest.spyOn(databaseGateway.writable, "transaction")
    const user = await createUser(databaseGateway, {
      visibleForces: ["01"]
    })

    await lockAndFetchCaseDto(databaseGateway.writable, testDynamoGateway, user, 0, logger)

    expect(writableDatabaseSpy).toHaveBeenCalledTimes(1)

    jest.clearAllMocks()
    jest.resetAllMocks()
  })
})
