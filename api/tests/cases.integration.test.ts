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
  })
})
