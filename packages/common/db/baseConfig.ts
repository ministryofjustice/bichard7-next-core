export const baseConfig = {
  database: process.env.DB_DATABASE ?? "bichard",
  host: process.env.DB_HOST ?? "localhost",
  password: process.env.DB_PASSWORD ?? "password",
  port: Number(process.env.DB_PORT ?? "5432"),
  schema: process.env.DB_SCHEMA ?? "br7own",
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
  user: process.env.DB_USER ?? "bichard"
}
