import jwt from "jsonwebtoken"
import type { LedsBichard } from "../../types/LedsMock"

const addAuthMock = (bichard: LedsBichard) => {
  const tokenExpiry = new Date()
  tokenExpiry.setHours(tokenExpiry.getHours() + 1)
  const token = jwt.sign({ exp: Math.floor(tokenExpiry.getTime() / 1000) }, "secret-key")

  return bichard.policeApi.mockServerClient.addMock({
    path: "/auth",
    method: "POST",
    requestBody: {},
    count: 0,

    response: {
      status: 200,
      body: { access_token: token },
      headers: {}
    }
    // id: mock.id
  })
}

export default addAuthMock
