import type ConductorConfig from "src/ConductorConfig"

const createConductorConfig = () => {
  const conductorConfig: ConductorConfig = {
    url: process.env.CONDUCTOR_URL ?? "http://localhost:5002",
    username: process.env.CONDUCTOR_USERNAME ?? "bichard",
    password: process.env.CONDUCTOR_PASSWORD ?? "password"
  }

  return conductorConfig
}

export default createConductorConfig
