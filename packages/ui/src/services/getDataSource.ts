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
  const { NODE_ENV, CYPRESS } = process.env

  const config: DataSourceOptions = {
    ...baseConfig,
    type: "postgres",
    applicationName: "ui-connection",
    username: baseConfig.user,
    synchronize: false, // It must be always false, otherwise it changes the database structure.
    entities: [CourtCase, User, Trigger, Note, SurveyFeedback],
    subscribers: [CourtCaseSubscriber, NoteSubscriber],
    migrations: [],
    logging: false, // Set to true to see what queries are being sent to Postgres
    extra: {
      max: NODE_ENV === "test" || CYPRESS === "true" ? 1 : 20
    }
  }

  if (config.synchronize) {
    throw Error("Synchronize must be false.")
  }

  if (!appDataSource?.isInitialized) {
    appDataSource = await new DataSource(config).initialize()
  }

  return appDataSource
}

process.on("beforeExit", async () => {
  if (appDataSource?.isInitialized) {
    await appDataSource.destroy()
  }
})

export default getDataSource
