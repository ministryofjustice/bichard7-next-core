import { hashToRatio, normalizeEmail } from "./createHash"

describe("hashToRatio", () => {
  it("should return a number between 0 and 1", () => {
    const result = hashToRatio("test@example.com")
    expect(result).toBeGreaterThanOrEqual(0)
    expect(result).toBeLessThanOrEqual(1)
  })

  it("should return the same value for the same input", () => {
    const email = "user@example.com"
    const result1 = hashToRatio(email)
    const result2 = hashToRatio(email)
    expect(result1).toBe(result2)
  })

  it("should return different values for different inputs", () => {
    const result1 = hashToRatio("user1@example.com")
    const result2 = hashToRatio("user2@example.com")
    expect(result1).not.toBe(result2)
  })
})

describe("normalizeEmail", () => {
  it("should convert email to lowercase", () => {
    expect(normalizeEmail("User@Example.COM")).toBe("user@example.com")
  })

  it("should trim whitespace", () => {
    expect(normalizeEmail("  user@example.com  ")).toBe("user@example.com")
  })

  it("should handle both lowercase and whitespace", () => {
    expect(normalizeEmail("  User@Example.COM  ")).toBe("user@example.com")
  })
})
