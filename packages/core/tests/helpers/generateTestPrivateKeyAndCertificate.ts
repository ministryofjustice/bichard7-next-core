import crypto from "node:crypto"

const generateTestPrivateKeyAndCertificate = () => {
  const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem"
    },
    publicKeyEncoding: {
      type: "spki",
      format: "pem"
    }
  })

  return {
    privateKey: privateKey.toString(),
    certificate: publicKey.toString().replace(/PUBLIC KEY/g, "CERTIFICATE")
  }
}

export default generateTestPrivateKeyAndCertificate
