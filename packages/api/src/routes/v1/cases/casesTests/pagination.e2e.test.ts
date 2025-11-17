import type { CaseIndexMetadata } from "@moj-bichard7/common/types/Case"
import type { FastifyInstance } from "fastify"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"

import { createCases } from "../../../../tests/helpers/caseHelper"
import { SetupAppEnd2EndHelper } from "../../../../tests/helpers/setupAppEnd2EndHelper"
import { createUserAndJwtToken } from "../../../../tests/helpers/userHelper"

describe("/v1/cases pagination e2e", () => {
  const endpoint = V1.Cases
  let helper: SetupAppEnd2EndHelper
  let app: FastifyInstance
  let jwt: string

  beforeAll(async () => {
    helper = await SetupAppEnd2EndHelper.setup()
    app = helper.app

    await helper.postgres.clearDb()
    await helper.dynamo.clearDynamo()

    const [encodedJwt] = await createUserAndJwtToken(helper.postgres)
    await createCases(helper.postgres, 123)

    jwt = encodedJwt
  })

  afterAll(async () => {
    await app.close()
    await helper.postgres.close()
  })

  const useFetch = async (searchQuery?: URLSearchParams) => {
    let url = `${helper.address}${endpoint}`

    if (searchQuery) {
      url = `${url}?${searchQuery}`
    }

    return await fetch(url, {
      headers: { Authorization: `Bearer ${jwt}` },
      method: "GET"
    })
  }

  it("default pagination query params", async () => {
    const response = await useFetch()

    expect(response.ok).toBe(true)

    const result = (await response.json()) as CaseIndexMetadata

    expect(result.cases).toHaveLength(50)
    expect(result.maxPerPage).toBe(50)
    expect(result.pageNum).toBe(1)
    expect(result.returnCases).toBe(50)
    expect(result.totalCases).toBe(123)
  })

  it("can change the page pagination query params", async () => {
    const query = new URLSearchParams()
    query.append("pageNum", "2")

    const response = await useFetch(query)

    expect(response.ok).toBe(true)

    const result = (await response.json()) as CaseIndexMetadata

    expect(result.cases).toHaveLength(50)
    expect(result.maxPerPage).toBe(50)
    expect(result.pageNum).toBe(2)
    expect(result.returnCases).toBe(50)
    expect(result.totalCases).toBe(123)
  })

  it("can change the maxPerPage pagination query params", async () => {
    const query = new URLSearchParams()
    query.append("maxPerPage", "25")

    const response = await useFetch(query)

    expect(response.ok).toBe(true)

    const result = (await response.json()) as CaseIndexMetadata

    expect(result.cases).toHaveLength(25)
    expect(result.maxPerPage).toBe(25)
    expect(result.pageNum).toBe(1)
    expect(result.returnCases).toBe(25)
    expect(result.totalCases).toBe(123)
  })

  it("can change the maxPerPage and page pagination query params", async () => {
    const query = new URLSearchParams()
    query.append("maxPerPage", "100")
    query.append("pageNum", "2")

    const response = await useFetch(query)

    expect(response.ok).toBe(true)

    const result = (await response.json()) as CaseIndexMetadata

    expect(result.cases).toHaveLength(23)
    expect(result.maxPerPage).toBe(100)
    expect(result.pageNum).toBe(2)
    expect(result.returnCases).toBe(23)
    expect(result.totalCases).toBe(123)
  })

  it("ignores not validate query params", async () => {
    const query = new URLSearchParams()
    query.append("maxPage", "100")
    query.append("page", "2")

    const response = await useFetch(query)

    expect(response.ok).toBe(true)

    const result = (await response.json()) as CaseIndexMetadata

    expect(result.cases).toHaveLength(50)
    expect(result.maxPerPage).toBe(50)
    expect(result.pageNum).toBe(1)
    expect(result.returnCases).toBe(50)
    expect(result.totalCases).toBe(123)
  })
})
