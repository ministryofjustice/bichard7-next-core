import type { DataSourceOptions } from "typeorm"

import { baseConfig } from "@moj-bichard7/common/db/baseConfig"
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
    ...baseConfig,
    applicationName: "ui-connection",
    entities: [CourtCase, User, Trigger, Note, SurveyFeedback],
    extra: {
      max: 1
    },
    logging: false, // Set to true to see what queries are being sent to Postgres
    migrations: [],
    subscribers: [CourtCaseSubscriber, NoteSubscriber],
    synchronize: false, // It must be always false, otherwise it changes the database structure.
    type: "postgres",
    username: baseConfig.user
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
