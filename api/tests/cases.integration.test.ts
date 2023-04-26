import request from "supertest"
import app from "../src/app"

describe("/cases", () => {
  describe("GET", () => {
    it("returns a 200 status code", async () => {
      const response = await request(app)
        .get("/health")
        .query({ forces: ["01"], maxPageItems: "10" })

      expect(response.statusCode).toBe(200)
    })
  })
})
