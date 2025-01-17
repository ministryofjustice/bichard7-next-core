import type { CaseDto } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"

import { UserGroup } from "@moj-bichard7/common/types/UserGroup"

import type { CaseDataForDto } from "../types/CaseDataForDto"

import FakeDataStore from "../services/gateways/dataStoreGateways/fakeDataStore"
import { testAhoJsonObj, testAhoXml } from "../tests/helpers/ahoHelper"
import FakeLogger from "../tests/helpers/fakeLogger"
import fetchCaseDto from "./fetchCaseDto"

describe("fetchCaseDto", () => {
  const logger = new FakeLogger()
  const db = new FakeDataStore()

  it("returns a case", async () => {
    const user = { visible_forces: "001" } as User
    const result = await fetchCaseDto(user, db, 0, logger)

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

    await expect(fetchCaseDto(user, db, 0, logger)).rejects.toThrow("No force associated to User")
  })

  it("returns canUserEditExceptions true when case is locked to currentUser, user has access to exceptions and errorStatus is unresolved", async () => {
    const user = {
      groups: [UserGroup.ExceptionHandler],
      username: "user1",
      visible_forces: "001"
    } as unknown as User
    const caseObj = {
      annotated_msg: testAhoXml,
      error_locked_by_id: "user1",
      error_status: 1
    } as CaseDataForDto

    jest.spyOn(db, "fetchCase").mockResolvedValue(caseObj)

    const result = await fetchCaseDto(user, db, 0, logger)

    expect(result.canUserEditExceptions).toBe(true)
  })

  it("returns canUserEditExceptions false when case is not locked to currentUser", async () => {
    const user = {
      groups: [UserGroup.ExceptionHandler],
      username: "user1",
      visible_forces: "001"
    } as unknown as User
    const caseObj = {
      annotated_msg: testAhoXml,
      error_locked_by_id: "user2",
      error_status: 1
    } as CaseDataForDto

    jest.spyOn(db, "fetchCase").mockResolvedValue(caseObj)

    const result = await fetchCaseDto(user, db, 0, logger)

    expect(result.canUserEditExceptions).toBe(false)
  })

  it("returns canUserEditExceptions false when user does not have access to exceptions", async () => {
    const user = {
      groups: [UserGroup.Audit],
      username: "user1",
      visible_forces: "001"
    } as unknown as User
    const caseObj = {
      annotated_msg: testAhoXml,
      error_locked_by_id: "user1",
      error_status: 1
    } as CaseDataForDto

    jest.spyOn(db, "fetchCase").mockResolvedValue(caseObj)

    const result = await fetchCaseDto(user, db, 0, logger)

    expect(result.canUserEditExceptions).toBe(false)
  })

  it("returns canUserEditExceptions false errorStatus is not unresolved", async () => {
    const user = {
      groups: [UserGroup.ExceptionHandler],
      username: "user1",
      visible_forces: "001"
    } as unknown as User
    const caseObj = {
      annotated_msg: testAhoXml,
      error_locked_by_id: "user1",
      error_status: 2
    } as CaseDataForDto

    jest.spyOn(db, "fetchCase").mockResolvedValue(caseObj)

    const result = await fetchCaseDto(user, db, 0, logger)

    expect(result.canUserEditExceptions).toBe(false)
  })
})
