import type { NiamAuthenticationParameters } from "../../types/leds/NiamAuthenticationOptions"

import generateTestPrivateKeyAndCertificate from "./generateTestPrivateKeyAndCertificate"

const setLedsEnvironmentVariables = () => {
  const niamParams: NiamAuthenticationParameters = {
    claims: {
      aud: "dummy-aud",
      iss: "dummy-iss",
      sub: "dummy-sub"
    },
    clientAssertionType: "dummy-client-assertion-type",
    clientId: "dummy-client-id",
    grantType: "dummy-grant-type",
    scope: "dummy-scope"
  }

  const { privateKey, certificate } = generateTestPrivateKeyAndCertificate()

  process.env.LEDS_NIAM_AUTH_URL = "http://dummy/auth"
  process.env.LEDS_NIAM_PRIVATE_KEY = privateKey
  process.env.LEDS_NIAM_CERTIFICATE = certificate
  process.env.LEDS_NIAM_PARAMETERS = JSON.stringify(niamParams)
}

export default setLedsEnvironmentVariables
