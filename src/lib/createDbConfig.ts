import type { ClientConfig } from "pg"

const createDbConfig = (): ClientConfig => ({
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? "5434"),
  user: process.env.DB_USER ?? "bichard",
  password: process.env.DB_PASSWORD ?? "password"
})

export default createDbConfig
