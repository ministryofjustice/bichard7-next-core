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
  })
})
