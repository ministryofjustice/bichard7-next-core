import type { CaseDto } from "@moj-bichard7/common/types/Case"
import type { FastifyInstance } from "fastify"

import { OK } from "http-status"

import { VersionedEndpoints } from "../../../endpoints/versionedEndpoints"
import { testAhoJsonStr, testAhoXml } from "../../../tests/helpers/ahoHelper"
import { createCase } from "../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../tests/helpers/setupAppEnd2EndHelper"
import { createUserAndJwtToken, createUsers, generateJwtForUser } from "../../../tests/helpers/userHelper"

describe("/v1/case e2e", () => {
  const endpoint = VersionedEndpoints.V1.Case
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app
  })

  beforeEach(async () => {
    await helper.postgres.clearDb()
  })

  afterAll(async () => {
    await app.close()
    await helper.postgres.close()
  })

  it("returns case data", async () => {
    const [encodedJwt] = await createUserAndJwtToken(helper.postgres)
    const dummyCase = {
      annotated_msg: testAhoXml,
      asn: "1901ID0100000006148H",
      court_code: "ABC",
      court_date: new Date(),
      court_name: "Kingston Crown Court",
      court_reference: "ABC",
      create_ts: new Date(2025, 1, 1),
      defendant_name: "Defendant",
      error_count: 0,
      error_id: 0,
      error_locked_by_id: "user1",
      error_report: "HO100304||br7:ArrestSummonsNumber",
      error_status: 1,
      is_urgent: 1,
      message_id: "ABC-DEF",
      msg_received_ts: new Date(2025, 1, 1),
      org_for_police_filter: "01",
      phase: 1,
      ptiurn: "00112233",
      resolution_ts: new Date(2025, 1, 2),
      trigger_count: 1,
      trigger_locked_by_id: "user2",
      trigger_status: 1,
      updated_msg: testAhoXml
    }

    const testCase = await createCase(helper.postgres, dummyCase)

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", testCase.error_id.toString())}`, {
      headers: {
        Authorization: `Bearer ${encodedJwt}`
      },
      method: "GET"
    })

    expect(response.status).toBe(OK)
    const responseJson = (await response.json()) satisfies CaseDto
    expect(responseJson.aho).toEqual(testAhoJsonStr)
    expect(responseJson.asn).toBe(testCase.asn)
    expect(responseJson.courtCode).toBe(testCase.court_code)
    expect(responseJson.courtDate).toBe(testCase.court_date?.toISOString())
    expect(responseJson.courtReference).toBe(testCase.court_reference)
    expect(responseJson.defendantName).toBe(testCase.defendant_name)
    expect(responseJson.errorId).toBe(testCase.error_id)
    expect(responseJson.errorLockedByUsername).toBe(testCase.error_locked_by_id)
    expect(responseJson.errorReport).toBe(testCase.error_report)
    expect(responseJson.errorStatus).toBe("Unresolved")
    expect(responseJson.isUrgent).toBe(testCase.is_urgent)
    expect(responseJson.orgForPoliceFilter).toBe(testCase.org_for_police_filter)
    expect(responseJson.phase).toBe(testCase.phase)
    expect(responseJson.ptiurn).toBe(testCase.ptiurn)
    expect(responseJson.resolutionTimestamp).toBe(testCase.resolution_ts?.toISOString())
    expect(responseJson.triggerCount).toBe(testCase.trigger_count)
    expect(responseJson.triggerLockedByUsername).toBe(testCase.trigger_locked_by_id)
    expect(responseJson.triggerStatus).toBe("Unresolved")
    expect(responseJson.updatedHearingOutcome).toEqual(testAhoJsonStr)
  })

  it("returns errorLockedByUsername and errorLockedByUserFullName", async () => {
    const [user] = await createUsers(helper.postgres, 3)
    const jwtToken = await generateJwtForUser(user)

    const testCase = await createCase(helper.postgres, { error_locked_by_id: user.username })

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", testCase.error_id.toString())}`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`
      },
      method: "GET"
    })

    expect(response.status).toBe(OK)
    const responseJson: CaseDto = (await response.json()) satisfies CaseDto
    expect(responseJson.errorLockedByUsername).toBe(user.username)
    expect(responseJson.errorLockedByUserFullName).toBe("Forename1 Surname1")
  })

  it("returns triggerLockedByUsername and triggerLockedByUserFullName", async () => {
    const [user] = await createUsers(helper.postgres, 3)
    const jwtToken = await generateJwtForUser(user)

    const testCase = await createCase(helper.postgres, { trigger_locked_by_id: user.username })

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", testCase.error_id.toString())}`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`
      },
      method: "GET"
    })

    expect(response.status).toBe(OK)
    const responseJson: CaseDto = (await response.json()) satisfies CaseDto
    expect(responseJson.triggerLockedByUsername).toBe(user.username)
    expect(responseJson.triggerLockedByUserFullName).toBe("Forename1 Surname1")
  })

  it("locks exception to the user when the case is unlocked, has exceptions, and has error status unresolved", async () => {
    const [user] = await createUsers(helper.db, 3)
    const jwtToken = await generateJwtForUser(user)

    const testCase = await createCase(helper.db, {
      error_count: 1,
      error_locked_by_id: null,
      error_status: 1,
      org_for_police_filter: "01"
    })

    const response = await fetch(`${helper.address}${endpoint.replace(":caseId", testCase.error_id.toString())}`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`
      },
      method: "GET"
    })

    expect(response.status).toBe(OK)
    const responseJson: CaseDto = (await response.json()) satisfies CaseDto
    expect(responseJson.errorLockedByUsername).toBe(user.username)
  })

  const testCases = [
    {
      caseData: {
        error_count: 1,
        error_locked_by_id: "another_user",
        error_status: 1
      },
      description: "doesn't lock exception to the user when the case is locked to another user",
      expectedLockedByUsername: "another_user"
    },
    {
      caseData: { error_count: 0, error_locked_by_id: null, error_status: null },
      description: "doesn't lock exception when case does not have any exception",
      expectedLockedByUsername: null
    },
    {
      caseData: { error_count: 1, error_locked_by_id: null, error_status: 2 },
      description: "doesn't lock exception when error status is resolved",
      expectedLockedByUsername: null
    },
    {
      caseData: { error_count: 1, error_locked_by_id: null, error_status: 3 },
      description: "doesn't lock exception when error status is submitted",
      expectedLockedByUsername: null
    }
  ]

  testCases.forEach(({ caseData, description, expectedLockedByUsername }) => {
    it(`${description}`, async () => {
      const [user] = await createUsers(helper.db, 1)
      const jwtToken = await generateJwtForUser(user)

      const testCase = await createCase(helper.db, caseData)

      const response = await fetch(`${helper.address}${endpoint.replace(":caseId", testCase.error_id.toString())}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        },
        method: "GET"
      })

      expect(response.status).toBe(OK)
      const responseJson: CaseDto = (await response.json()) satisfies CaseDto
      expect(responseJson.errorLockedByUsername).toBe(expectedLockedByUsername)
    })
  })
})
