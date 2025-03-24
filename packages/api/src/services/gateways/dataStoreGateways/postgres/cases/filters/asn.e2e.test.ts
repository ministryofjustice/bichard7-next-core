import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"

import type { CaseIndexQuerystring } from "../../../../../../types/CaseIndexQuerystring"

import { createCases } from "../../../../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../../../../tests/helpers/setupAppEnd2EndHelper"
import { createUsers } from "../../../../../../tests/helpers/userHelper"
import { Reason } from "../../../../../../types/CaseIndexQuerystring"
import { fetchCasesAndFilter } from "../../../../../../useCases/cases/fetchCasesAndFilter"

describe("fetchCasesAndFilter filtering by ASN e2e", () => {
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance
  let user: User

  const defaultQuery: CaseIndexQuerystring = { maxPerPage: 25, pageNum: 1, reason: Reason.All }
  const asnWithoutSlashes = "1101ZD0100000448754K"
  const invalidAsnWithoutSlashes = "AAAAAAAAAAAAAAAAAAA"
  const validAsnWithoutSlashes = "1101ZD0100000410836V"
  const asnWithSlashesInput = "11/01ZD/01/00000448754K"
  const invalidAsnInput = "AA/AAAA/AA/AAAAAAAAAAA"
  const partialAsnInput = "01ZD/01/0"

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app
    helper.postgres.forceIds = [1]

    await helper.postgres.clearDb()
    await helper.dynamo.clearDynamo()

    user = (await createUsers(helper.postgres, 1))[0]
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
    const caseMetadata = await fetchCasesAndFilter(
      helper.postgres,
      { asn: asnWithoutSlashes.toLowerCase(), ...defaultQuery },
      user
    )

    expect(caseMetadata.cases).toHaveLength(1)
    expect(caseMetadata.totalCases).toBe(1)
    expect(caseMetadata.returnCases).toBe(1)
    expect(caseMetadata.cases[0].asn).toStrictEqual(asnWithoutSlashes)
  })

  it("will match cases when the ASN is invalid", async () => {
    const caseMetadata = await fetchCasesAndFilter(helper.postgres, { asn: invalidAsnInput, ...defaultQuery }, user)

    expect(caseMetadata.cases).toHaveLength(1)
    expect(caseMetadata.totalCases).toBe(1)
    expect(caseMetadata.returnCases).toBe(1)
    expect(caseMetadata.cases[0].asn).toStrictEqual(invalidAsnWithoutSlashes)
  })

  it("will partial match", async () => {
    const caseMetadata = await fetchCasesAndFilter(helper.postgres, { asn: partialAsnInput, ...defaultQuery }, user)

    expect(caseMetadata.cases).toHaveLength(2)
    expect(caseMetadata.totalCases).toBe(2)
    expect(caseMetadata.returnCases).toBe(2)
    expect(caseMetadata.cases[0].asn).toStrictEqual(asnWithoutSlashes)
    expect(caseMetadata.cases[1].asn).toStrictEqual(validAsnWithoutSlashes)
  })

  it("will ignore slashes in the query", async () => {
    const caseMetadata = await fetchCasesAndFilter(helper.postgres, { asn: asnWithSlashesInput, ...defaultQuery }, user)

    expect(caseMetadata.cases).toHaveLength(1)
    expect(caseMetadata.totalCases).toBe(1)
    expect(caseMetadata.returnCases).toBe(1)
    expect(caseMetadata.cases[0].asn).toStrictEqual(asnWithoutSlashes)
  })
})
