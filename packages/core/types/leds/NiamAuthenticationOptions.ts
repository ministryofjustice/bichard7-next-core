export type NiamAuthenticationParameters = {
  claims: {
    aud: string
    iss: string
    sub: string
  }
  clientAssertionType: string
  clientId: string
  grantType: string
  scope: string
  tlsStrictMode?: boolean
}

type NiamAuthenticationOptions = {
  authenticationUrl: string
  certificate: string
  parameters: NiamAuthenticationParameters
  privateKey: string
}

export default NiamAuthenticationOptions
