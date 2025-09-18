import type { ApiCaseQuery } from "@moj-bichard7/common/types/ApiCaseQuery"
import type { CaseIndexMetadata } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import { Order, OrderBy, Reason } from "@moj-bichard7/common/types/ApiCaseQuery"

import { createCases } from "../../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../../tests/helpers/setupAppEnd2EndHelper"
import { createUser } from "../../../../tests/helpers/userHelper"
import fetchCasesAndFilter from "../../../../useCases/cases/getCase/fetchCasesAndFilter"

describe("fetchCasesAndFilter ordering message received at e2e", () => {
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance
  let user: User

  const firstDate = new Date("2001-09-26")
  const secondDate = new Date("2008-01-26")
  const thirdDate = new Date("2013-10-16")
  const defaultQuery: ApiCaseQuery = { maxPerPage: 25, pageNum: 1, reason: Reason.All }

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app

    await helper.postgres.clearDb()
    await helper.dynamo.clearDynamo()

    user = await createUser(helper.postgres)
    await createCases(helper.postgres, 3, {
      0: { messageReceivedAt: secondDate },
      1: { messageReceivedAt: firstDate },
      2: { messageReceivedAt: thirdDate }
    })
  })

  afterEach(async () => {
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    await app.close()
    await helper.postgres.close()
  })

  it("will order the message received at by asc", async () => {
    const caseMetadata = (await fetchCasesAndFilter(
      helper.postgres.readonly,
      { order: Order.asc, orderBy: OrderBy.messageReceivedAt, ...defaultQuery },
      user
    )) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(3)
    expect(caseMetadata.cases[0].messageReceivedAt).toStrictEqual(firstDate)
    expect(caseMetadata.cases[1].messageReceivedAt).toStrictEqual(secondDate)
    expect(caseMetadata.cases[2].messageReceivedAt).toStrictEqual(thirdDate)
  })

  it("will order the message received at by DESC", async () => {
    const caseMetadata = (await fetchCasesAndFilter(
      helper.postgres.readonly,
      { order: Order.desc, orderBy: OrderBy.messageReceivedAt, ...defaultQuery },
      user
    )) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(3)
    expect(caseMetadata.cases[0].messageReceivedAt).toStrictEqual(thirdDate)
    expect(caseMetadata.cases[1].messageReceivedAt).toStrictEqual(secondDate)
    expect(caseMetadata.cases[2].messageReceivedAt).toStrictEqual(firstDate)
  })
})
