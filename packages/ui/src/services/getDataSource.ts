import { baseConfig } from "@moj-bichard7/common/db/baseConfig"
import type { DataSourceOptions } from "typeorm"
import { DataSource } from "typeorm"
import CourtCase from "./entities/CourtCase"
import Note from "./entities/Note"
import SurveyFeedback from "./entities/SurveyFeedback"
import Trigger from "./entities/Trigger"
import User from "./entities/User"
import { CourtCaseSubscriber } from "./subscribers/courtCaseSubscriber"
import { NoteSubscriber } from "./subscribers/noteSubscriber"

let appDataSource: DataSource
const getDataSource = async (): Promise<DataSource> => {
  const config: DataSourceOptions = {
    type: "postgres",
    applicationName: "ui-connection",
    host: baseConfig.host,
    port: baseConfig.port,
    username: baseConfig.user,
    password: baseConfig.password,
    database: baseConfig.database,
    ssl: baseConfig.ssl,
    synchronize: false, // It must be always false, otherwise it changes the database structure.
    entities: [CourtCase, User, Trigger, Note, SurveyFeedback],
    subscribers: [CourtCaseSubscriber, NoteSubscriber],
    migrations: [],
    schema: "br7own",
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
