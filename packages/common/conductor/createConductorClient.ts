import { type ConductorClient, orkesConductorClient } from "@io-orkes/conductor-javascript"

const createConductorClient = async (): Promise<ConductorClient> => {
  const username = process.env.CONDUCTOR_USERNAME ?? "bichard"
  const password = process.env.CONDUCTOR_PASSWORD ?? "password"
  const credentials = Buffer.from(`${username}:${password}`).toString("base64")

  const customFetch: typeof fetch = (input, init) => {
    const headers = new Headers(init?.headers)
    headers.set("Authorization", `Basic ${credentials}`)
    return fetch(input, { ...init, headers })
  }

  return await orkesConductorClient(
    {
      serverUrl: process.env.CONDUCTOR_URL ?? "http://localhost:5002/api"
    },
    customFetch
  )
}

export default createConductorClient
