import request from "supertest"
import app from "../src/app"

describe("/status", () => {
  describe("GET", () => {
    it("returns a 200 status code", async () => {
      const response = await request(app).get("/status")

      expect(response.statusCode).toBe(200)
    })
  })
})
