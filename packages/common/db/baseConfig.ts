export const baseConfig = {
  host: process.env.DB_HOST ?? "localhost",
  user: process.env.DB_USER ?? "bichard",
  password: process.env.DB_PASSWORD ?? "password",
  database: process.env.DB_DATABASE ?? "bichard",
  port: Number(process.env.DB_PORT ?? "5432"),
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
  schema: process.env.DB_SCHEMA ?? "br7own"
}
