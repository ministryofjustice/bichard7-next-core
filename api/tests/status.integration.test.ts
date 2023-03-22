import request from "supertest"
import app from "../src/app"

describe("/health", () => {
  describe("GET", () => {
    it("returns a 200 status code", async () => {
      const response = await request(app).get("/health")

      expect(response.statusCode).toBe(200)
    })
  })
})
