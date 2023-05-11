import request from "supertest"
import { stringify } from "qs"
import app from "../src/app"
import { insertCourtCasesWithFields } from "./utils/insertCourtCases"
import CourtCase from "../src/services/entities/CourtCase"
import deleteFromEntity from "./utils/deleteFromEntity"

describe("/court-cases", () => {
  beforeEach(async () => {
    await deleteFromEntity(CourtCase)
  })

  afterAll(async () => {
    await deleteFromEntity(CourtCase)
  })

  describe("GET", () => {
    it("returns a 200 status code", async () => {
      const response = await request(app)
        .get("/court-cases")
        .query(stringify({ forces: ["01"], maxPageItems: "10" }))

      expect(response.statusCode).toBe(200)
    })

    it("returns a 400 status code if required query attributes are missing", async () => {
      const response = await request(app).get("/court-cases").query({})

      expect(response.statusCode).toBe(400)
    })

    it("returns a list of results and the total result count", async () => {
      const casesToInsert: Partial<CourtCase>[] = [
        {
          orgForPoliceFilter: "01"
        }
      ]
      await insertCourtCasesWithFields(casesToInsert)
      const response = await request(app)
        .get("/court-cases")
        .query(stringify({ forces: ["01"], maxPageItems: "10" }))

      expect(response.body.result).toHaveLength(1)
    })

    it("can filter on ptirun", async () => {
      const orgCode = "01"
      const firstCase = "00001"
      const secondCase = "00002"
      const thirdCase = "00003"

      await insertCourtCasesWithFields([
        { ptiurn: firstCase, orgForPoliceFilter: orgCode },
        { ptiurn: secondCase, orgForPoliceFilter: orgCode },
        { ptiurn: thirdCase, orgForPoliceFilter: orgCode }
      ])
      const response = await request(app)
        .get("/court-cases")
        .query(
          stringify({
            forces: ["01"],
            maxPageItems: "10",
            ptiurn: firstCase
          })
        )
      const resultedPtiurn = response.body.result[0].ptiurn
      expect(resultedPtiurn).toBe("00001")
      expect(response.body.result).toHaveLength(1)
    })

    it("can filter on courtDate", async () => {
      const orgCode = "01"
      const firstDate = new Date("2001-09-26")
      const secondDate = new Date("2008-01-26")
      const thirdDate = new Date("2008-03-26")
      const fourthDate = new Date("2013-10-16")

      await insertCourtCasesWithFields([
        { courtDate: firstDate, orgForPoliceFilter: orgCode },
        { courtDate: secondDate, orgForPoliceFilter: orgCode },
        { courtDate: thirdDate, orgForPoliceFilter: orgCode },
        { courtDate: fourthDate, orgForPoliceFilter: orgCode }
      ])

      const courtDateRangeQueryParams =
        "courtDateRange[0][from]=2008-01-01T00:00:00Z&courtDateRange[0][to]=2008-12-30T00:00:00Z"
      const response = await request(app).get(`/court-cases?forces[]=01&maxPageItems=10&${courtDateRangeQueryParams}`)

      expect(response.body.result).toHaveLength(2)
    })

    it("should filter on many fields", async () => {
      const orgCode = "01"
      await insertCourtCasesWithFields([
        { ptiurn: "00001", errorCount: 3, triggerCount: 0, orgForPoliceFilter: orgCode },
        { ptiurn: "00002", errorCount: 0, triggerCount: 2, orgForPoliceFilter: orgCode }
      ])
      let response = await request(app)
        .get("/court-cases")
        .query(stringify({ forces: [orgCode], maxPageItems: "10", reasons: ["Exceptions"] }))
      expect(response.body.result[0].ptiurn).toBe("00001")
      expect(response.body.result).toHaveLength(1)
      response = await request(app)
        .get("/court-cases")
        .query(stringify({ forces: [orgCode], maxPageItems: "10", reasons: ["Triggers"] }))
      expect(response.body.result[0].ptiurn).toBe("00002")
      expect(response.body.result).toHaveLength(1)
    })
  })
})
