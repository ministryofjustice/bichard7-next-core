export type DbConfig = {
  host: string
  port: number
  username: string
  password: string
}

const createDbConfig = (): DbConfig => ({
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? "5434"),
  username: process.env.DB_USER ?? "bichard",
  password: process.env.DB_PASSWORD ?? "password"
})

export default createDbConfig
