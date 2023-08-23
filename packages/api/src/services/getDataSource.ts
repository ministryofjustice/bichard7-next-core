import CourtCase from "src/services/entities/CourtCase"
import type { DataSourceOptions } from "typeorm"
import { DataSource } from "typeorm"
import type DatabaseConfig from "src/services/DatabaseConfig"
import User from "src/services/entities/User"
import Trigger from "src/services/entities/Trigger"
import Note from "src/services/entities/Note"

const databaseConfig: DatabaseConfig = {
  host: process.env.DB_HOST ?? process.env.DB_AUTH_HOST ?? "localhost",
  user: process.env.DB_USER ?? process.env.DB_AUTH_USER ?? "bichard",
  password: process.env.DB_PASSWORD ?? process.env.DB_AUTH_PASSWORD ?? "password",
  database: process.env.DB_DATABASE ?? process.env.DB_AUTH_DATABASE ?? "bichard",
  port: parseInt(process.env.DB_PORT ?? process.env.DB_AUTH_PORT ?? "5432", 10),
  ssl: (process.env.DB_SSL ?? process.env.DB_AUTH_SSL) === "true",
  schema: "br7own"
}

let appDataSource: DataSource
const getDataSource = async (): Promise<DataSource> => {
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

export default getDataSource
