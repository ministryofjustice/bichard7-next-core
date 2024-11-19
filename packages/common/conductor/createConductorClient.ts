import { ConductorClient } from "@io-orkes/conductor-javascript"

const createConductorClient = () =>
  new ConductorClient({
    PASSWORD: process.env.CONDUCTOR_PASSWORD ?? "password",
    serverUrl: process.env.CONDUCTOR_URL ?? "http://localhost:5002/api",
    USERNAME: process.env.CONDUCTOR_USERNAME ?? "bichard"
  })

export default createConductorClient
