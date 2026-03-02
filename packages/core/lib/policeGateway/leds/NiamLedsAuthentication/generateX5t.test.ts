import crypto from "crypto"

import generateX5t from "./generateX5t"

const generateTestCredentials = () => {
  const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048
  })
  const publicKeyPem = publicKey.export({ type: "spki", format: "pem" })
  const certificate = publicKeyPem.replace("PUBLIC KEY", "CERTIFICATE")

  return { privateKey, certificate }
}

describe("generateX5t", () => {
  it("should generate X5T string", () => {
    const { certificate } = generateTestCredentials()

    const result = generateX5t(certificate)

    expect(result).toBeDefined()
  })

  it("should return error if certificate is empty string", () => {
    const result = generateX5t("")

    expect((result as Error).message).toBe("Failed to generate X5T: The resulting DER buffer is empty.")
  })
})
