import type { DataSourceOptions } from "typeorm"
import { DataSource } from "typeorm"
import type DatabaseConfig from "../services/DatabaseConfig"
import CourtCase from "../services/entities/CourtCase"
import Note from "../services/entities/Note"
import Trigger from "../services/entities/Trigger"
import User from "../services/entities/User"

const defaultDatabaseConfig: DatabaseConfig = {
  host: process.env.DB_HOST ?? process.env.DB_AUTH_HOST ?? "localhost",
  user: process.env.DB_USER ?? process.env.DB_AUTH_USER ?? "bichard",
  password: process.env.DB_PASSWORD ?? process.env.DB_AUTH_PASSWORD ?? "password",
  database: process.env.DB_DATABASE ?? process.env.DB_AUTH_DATABASE ?? "bichard",
  port: parseInt(process.env.DB_PORT ?? process.env.DB_AUTH_PORT ?? "5432", 10),
  ssl: (process.env.DB_SSL ?? process.env.DB_AUTH_SSL) === "true",
  schema: "br7own"
}

let appDataSource: DataSource
const getDataSource = async (dbConfig?: DatabaseConfig): Promise<DataSource> => {
  const databaseConfig = dbConfig || defaultDatabaseConfig

  const config: DataSourceOptions = {
    type: "postgres",
    applicationName: "ui-connection",
    host: databaseConfig.host,
    port: databaseConfig.port,
    username: databaseConfig.user,
    password: databaseConfig.password,
    database: databaseConfig.database,
    synchronize: false, // It must be always false, otherwise it changes the database structure.
    entities: [CourtCase, User, Trigger, Note],
    subscribers: [],
    migrations: [],
    schema: databaseConfig.schema,
    ssl: databaseConfig.ssl ? { rejectUnauthorized: false } : false,
    logging: false, // Set to true to see what queries are being sent to Postgres
    extra: {
      max: 1
    }
  }

  if (config.synchronize) {
    throw Error("Synchronize must be false.")
  }

  if (!appDataSource || !appDataSource.isInitialized) {
    appDataSource = await new DataSource(config).initialize()
  }

  return appDataSource
}

export { defaultDatabaseConfig }
export default getDataSource
