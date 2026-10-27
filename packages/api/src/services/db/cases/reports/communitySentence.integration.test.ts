import type { CommunitySentenceReportQuery } from "@moj-bichard7/common/contracts/CommunitySentenceReport"
import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type { CommunitySentenceReportDto } from "@moj-bichard7/common/types/reports/CommunitySentence"
import type { Result } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"

import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import parseAhoXml from "@moj-bichard7/common/aho/parseAhoXml/parseAhoXml"
import { ResolutionStatusNumber } from "@moj-bichard7/common/types/ResolutionStatus"
import { isError } from "@moj-bichard7/common/types/Result"
import serialiseToXml from "@moj-bichard7/core/lib/serialise/ahoXml/serialiseToXml"
import { addDays, startOfDay, subDays } from "date-fns"

import { testAhoXml } from "../../../../tests/helpers/ahoHelper"
import { createCases } from "../../../../tests/helpers/caseHelper"
import { createTriggers } from "../../../../tests/helpers/triggerHelper"
import End2EndPostgres from "../../../../tests/testGateways/e2ePostgres"
import { communitySentenceReport } from "./communitySentence"

describe("communitySentenceReport - Integration", () => {
  let database: End2EndPostgres

  const mockUser = {
    visibleCourts: [],
    visibleForces: ["01"]
  } as unknown as User

  beforeAll(async () => {
    database = new End2EndPostgres()
  })

  beforeEach(async () => {
    await database.clearDb()
  })

  afterAll(async () => {
    await database.close()
  })

  // aho needs community order result code to be picked up
  const ahoWithCommunityOrderResultCode = () => {
    const parsedAho: Result<AnnotatedHearingOutcome> = parseAhoXml(testAhoXml)

    if (isError(parsedAho)) {
      console.log("Missing or invalid AHO")
      throw parsedAho
    }

    parsedAho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].Result[0].CJSresultCode = 1030

    return serialiseToXml(parsedAho)
  }

  it("should only return results that have trigger TRPR0031", async () => {
    const today = startOfDay(new Date())

    const cases = await createCases(database, 2, {
      0: {
        aho: ahoWithCommunityOrderResultCode(),
        defendantName: "Trigger31 Defendant",
        messageReceivedAt: today,
        orgForPoliceFilter: "01"
      },
      1: {
        aho: ahoWithCommunityOrderResultCode(),
        defendantName: "Non Trigger31 Defendant",
        messageReceivedAt: today,
        orgForPoliceFilter: "01"
      }
    })

    await createTriggers(database, cases[0].errorId, [
      {
        status: ResolutionStatusNumber.Unresolved,
        triggerCode: TriggerCode.TRPR0031
      }
    ])

    await createTriggers(database, cases[1].errorId, [
      {
        status: ResolutionStatusNumber.Unresolved,
        triggerCode: TriggerCode.TRPR0002
      }
    ])

    const filters: CommunitySentenceReportQuery = {
      fromDate: subDays(today, 1),
      toDate: addDays(today, 1)
    }

    const results: CommunitySentenceReportDto[] = []
    await database.writable.transaction(async (trx) => {
      for await (const batch of communitySentenceReport(trx, mockUser, filters)) {
        results.push(...batch)
      }
    })

    expect(results).toHaveLength(1)
    expect(results[0].defendantName).toBe("Trigger31 Defendant")
  })

  it("should filter out results outside the specified date range", async () => {
    const today = startOfDay(new Date())
    const yesterday = subDays(today, 1)
    const tomorrow = addDays(today, 1)

    const cases = await createCases(database, 3, {
      0: {
        aho: ahoWithCommunityOrderResultCode(),
        defendantName: "In Range",
        messageReceivedAt: today,
        orgForPoliceFilter: "01"
      },
      1: {
        aho: ahoWithCommunityOrderResultCode(),
        defendantName: "Before Range",
        messageReceivedAt: subDays(today, 2),
        orgForPoliceFilter: "01"
      },
      2: {
        aho: ahoWithCommunityOrderResultCode(),
        defendantName: "After Range",
        messageReceivedAt: addDays(today, 2),
        orgForPoliceFilter: "01"
      }
    })

    for (const c of cases) {
      await createTriggers(database, c.errorId, [
        {
          status: ResolutionStatusNumber.Unresolved,
          triggerCode: TriggerCode.TRPR0031
        }
      ])
    }

    const filters: CommunitySentenceReportQuery = {
      fromDate: yesterday,
      toDate: tomorrow
    }

    const results: CommunitySentenceReportDto[] = []
    await database.writable.transaction(async (trx) => {
      for await (const batch of communitySentenceReport(trx, mockUser, filters)) {
        results.push(...batch)
      }
    })

    expect(results).toHaveLength(1)
    expect(results[0].defendantName).toBe("In Range")
  })

  it("should correctly identify and set the domestic violence flag when TRPR0023 or TRPR0024 are present", async () => {
    const today = startOfDay(new Date())

    const cases = await createCases(database, 2, {
      0: {
        aho: ahoWithCommunityOrderResultCode(),
        defendantName: "DV Offender",
        messageReceivedAt: today,
        orgForPoliceFilter: "01"
      },
      1: {
        aho: ahoWithCommunityOrderResultCode(),
        defendantName: "Non DV Offender",
        messageReceivedAt: today,
        orgForPoliceFilter: "01"
      }
    })

    await createTriggers(database, cases[0].errorId, [
      {
        status: ResolutionStatusNumber.Unresolved,
        triggerCode: TriggerCode.TRPR0031
      },
      {
        status: ResolutionStatusNumber.Unresolved,
        triggerCode: TriggerCode.TRPR0024
      }
    ])

    await createTriggers(database, cases[1].errorId, [
      {
        status: ResolutionStatusNumber.Unresolved,
        triggerCode: TriggerCode.TRPR0031
      }
    ])

    const filters: CommunitySentenceReportQuery = {
      fromDate: subDays(today, 1),
      toDate: addDays(today, 1)
    }

    const results: CommunitySentenceReportDto[] = []
    await database.writable.transaction(async (trx) => {
      for await (const batch of communitySentenceReport(trx, mockUser, filters)) {
        results.push(...batch)
      }
    })

    expect(results).toHaveLength(2)

    const dvResult = results.find((r) => r.errorId === cases[0].errorId)
    const nonDvResult = results.find((r) => r.errorId === cases[1].errorId)

    expect(dvResult?.domesticViolenceFlag).toBe("Yes")
    expect(nonDvResult?.domesticViolenceFlag).toBe("No")
  })

  it("should restrict results based on user organisation", async () => {
    const today = startOfDay(new Date())

    const cases = await createCases(database, 2, {
      0: {
        aho: ahoWithCommunityOrderResultCode(),
        defendantName: "Visible Org Case",
        messageReceivedAt: today,
        orgForPoliceFilter: "01"
      },
      1: {
        aho: ahoWithCommunityOrderResultCode(),
        defendantName: "Restricted Org Case",
        messageReceivedAt: today,
        orgForPoliceFilter: "02"
      }
    })

    for (const c of cases) {
      await createTriggers(database, c.errorId, [
        {
          status: ResolutionStatusNumber.Unresolved,
          triggerCode: TriggerCode.TRPR0031
        }
      ])
    }

    const filters: CommunitySentenceReportQuery = {
      fromDate: subDays(today, 1),
      toDate: addDays(today, 1)
    }

    const results: CommunitySentenceReportDto[] = []
    await database.writable.transaction(async (trx) => {
      for await (const batch of communitySentenceReport(trx, mockUser, filters)) {
        results.push(...batch)
      }
    })

    expect(results).toHaveLength(1)
    expect(results[0].defendantName).toBe("Visible Org Case")
  })
})
