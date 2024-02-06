import { ConductorClient } from "@io-orkes/conductor-javascript"

const createConductorClient = () =>
  new ConductorClient({
    serverUrl: process.env.CONDUCTOR_URL ?? "http://localhost:5002/api",
    USERNAME: process.env.CONDUCTOR_USERNAME ?? "bichard",
    PASSWORD: process.env.CONDUCTOR_PASSWORD ?? "password"
  })

export default createConductorClient
