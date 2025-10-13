import { createSsha, verifySsha } from "lib/ssha"

describe("ssha", () => {
  it("should verify SSHA secret", () => {
    const result = verifySsha("should verify SSHA secret", "{SSHA}aUbJsuyAq1gp7pNjLNKQUPCC9FB1JFoq")

    expect(result).toBe(true)
  })

  it("should not verify incorrect SSHA secret", () => {
    const result = verifySsha("should not verify SSHA secret", "{SSHA}aUbJsuyAq1gp7pNjLNKQUPCC9FB1JFoq")

    expect(result).toBe(false)
  })

  it("should return error when SSHA secret has invalid hash scheme", () => {
    const verificationResult = verifySsha("should not verify SSHA secret", "{MD5}aUbJsuyAq1gp7pNjLNKQUPCC9FB1JFoq")

    expect(verificationResult).toBe(false)
  })

  it("should not verify invalid SSHA secret", () => {
    const verificationResult = verifySsha("should not verify SSHA secret", "{SSHA}invalid_hash_string")

    expect(verificationResult).toBe(false)
  })

  it("should generate SSHA secret", () => {
    const hash = createSsha("Secret to be hashed")

    expect(hash).toMatch(/\{SSHA\}.+/)
  })

  it("should verify the generated SSHA secret", () => {
    const secret = "should generate and verify SSHA secret"
    const hash = createSsha(secret)
    const result = verifySsha(secret, hash)

    expect(result).toBe(true)
  })
})
