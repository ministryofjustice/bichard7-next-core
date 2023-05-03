import request from "supertest"
import { stringify } from "qs"
import app from "../src/app"

describe("/cases", () => {
  describe("GET", () => {
    it("returns a 200 status code", async () => {
      const response = await request(app)
        .get("/cases")
        .query(stringify({ forces: ["01"], maxPageItems: "10" }))

      expect(response.statusCode).toBe(200)
    })

    it("returns a 400 status code if required query attributes are missing", async () => {
      const response = await request(app).get("/cases").query({})

      expect(response.statusCode).toBe(400)
    })

    it("returns a list of results and the total result count", async () => {
      const response = await request(app)
        .get("/cases")
        .query(stringify({ forces: ["01"], maxPageItems: "10" }))
      expect(response.body.result).toHaveLength(10)
    })

    // TODO: replace with individual tests

    // it.only("should accept all optional query parameters", async () => {
    //   const caseListQuery: CaseListQueryParams = createFixture(caseListQuerySchema)
    //   caseListQuery.maxPageItems = "100"
    //   caseListQuery.courtDateRange = [
    //     { from: new Date(), to: new Date() },
    //     { from: new Date(), to: new Date() },
    //     { from: new Date(), to: new Date() }
    //   ]
    //   caseListQuery.orderBy = "desc"
    //   caseListQuery.pageNum = "2"
    //   const response = await request(app).get("/cases").query(stringify(caseListQuery))
    //   console.log(response.body)
    //   expect(response.statusCode).toBe(200)
    // })
  })
})
