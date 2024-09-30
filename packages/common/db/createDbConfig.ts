import postgres from "postgres"

export type DbConfig = {
  host: string
  port: number
  username: string
  password: string
  max: number
  idle_timeout: number
  max_lifetime: number
  ssl: boolean | { rejectUnauthorized: false }
  types: Record<string, postgres.PostgresType>
}

const createDbConfig = (): DbConfig => ({
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? "5432"),
  username: process.env.DB_USER ?? "bichard",
  password: process.env.DB_PASSWORD ?? "password",
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
  max: 10,
  idle_timeout: 20,
  max_lifetime: 60 * 30,
  types: {
    bigint: postgres.BigInt
  }
})

export default createDbConfig
