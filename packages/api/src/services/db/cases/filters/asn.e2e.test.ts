import type { CaseIndexMetadata } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import { type ApiCaseQuery, Reason } from "@moj-bichard7/common/types/ApiCaseQuery"

import { createCases } from "../../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../../tests/helpers/setupAppEnd2EndHelper"
import { createUser } from "../../../../tests/helpers/userHelper"
import fetchCasesAndFilter from "../../../../useCases/cases/getCase/fetchCasesAndFilter"

describe("fetchCasesAndFilter filtering by ASN e2e", () => {
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance
  let user: User

  const defaultQuery: ApiCaseQuery = { maxPerPage: 25, pageNum: 1, reason: Reason.All }
  const asnWithoutSlashes = "1101ZD0100000448754K"
  const invalidAsnWithoutSlashes = "AAAAAAAAAAAAAAAAAAA"
  const validAsnWithoutSlashes = "1101ZD0100000410836V"
  const asnWithSlashesInput = "11/01ZD/01/00000448754K"
  const invalidAsnInput = "AA/AAAA/AA/AAAAAAAAAAA"
  const partialAsnInput = "01ZD/01/0"

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app

    await helper.postgres.clearDb()
    await helper.dynamo.clearDynamo()

    user = await createUser(helper.postgres)
    await createCases(helper.postgres, 3, {
      0: { asn: asnWithoutSlashes },
      1: { asn: validAsnWithoutSlashes },
      2: { asn: invalidAsnWithoutSlashes }
    })
  })

  afterEach(async () => {
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    await app.close()
    await helper.postgres.close()
  })

  it("will match cases when the ASN is case insensitive", async () => {
    const caseMetadata = (await fetchCasesAndFilter(
      helper.postgres.readonly,
      { asn: asnWithoutSlashes.toLowerCase(), ...defaultQuery },
      user
    )) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(1)
    expect(caseMetadata.totalCases).toBe(1)
    expect(caseMetadata.returnCases).toBe(1)
    expect(caseMetadata.cases[0].asn).toStrictEqual(asnWithoutSlashes)
  })

  it("will match cases when the ASN is invalid", async () => {
    const caseMetadata = (await fetchCasesAndFilter(
      helper.postgres.readonly,
      { asn: invalidAsnInput, ...defaultQuery },
      user
    )) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(1)
    expect(caseMetadata.totalCases).toBe(1)
    expect(caseMetadata.returnCases).toBe(1)
    expect(caseMetadata.cases[0].asn).toStrictEqual(invalidAsnWithoutSlashes)
  })

  it("will partial match", async () => {
    const caseMetadata = (await fetchCasesAndFilter(
      helper.postgres.readonly,
      { asn: partialAsnInput, ...defaultQuery },
      user
    )) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(2)
    expect(caseMetadata.totalCases).toBe(2)
    expect(caseMetadata.returnCases).toBe(2)
    expect(caseMetadata.cases[0].asn).toStrictEqual(asnWithoutSlashes)
    expect(caseMetadata.cases[1].asn).toStrictEqual(validAsnWithoutSlashes)
  })

  it("will ignore slashes in the query", async () => {
    const caseMetadata = (await fetchCasesAndFilter(
      helper.postgres.readonly,
      { asn: asnWithSlashesInput, ...defaultQuery },
      user
    )) as CaseIndexMetadata

    expect(caseMetadata.cases).toHaveLength(1)
    expect(caseMetadata.totalCases).toBe(1)
    expect(caseMetadata.returnCases).toBe(1)
    expect(caseMetadata.cases[0].asn).toStrictEqual(asnWithoutSlashes)
  })
})
